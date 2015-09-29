package org.zanata.feature.manual;

import com.google.common.collect.ImmutableList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.zanata.common.LocaleId;
import org.zanata.common.ProjectType;
import org.zanata.rest.dto.resource.Resource;
import org.zanata.rest.dto.resource.TextFlow;
import org.zanata.rest.dto.resource.TextFlowTarget;
import org.zanata.rest.dto.resource.TranslationsResource;
import org.zanata.util.SampleDataResourceClient;
import org.zanata.util.SampleProjectRule;
import org.zanata.util.ZanataRestCaller;

import java.util.List;
import java.util.stream.IntStream;

import static org.zanata.util.ZanataRestCaller.*;

/**
 * This is a manual test that will help tuning/troubleshooting copyTrans. This
 * will just set up a project ovirt-reports-history and push up a few version's
 * translation.
 *
 * @author Patrick Huang <a
 *         href="mailto:pahuang@redhat.com">pahuang@redhat.com</a>
 */
@Slf4j
public class CopyTransTuningTest {
    private static final String PROJECT_SLUG = "ovirt-reports-history";
    @Rule
    public SampleProjectRule rule = new SampleProjectRule();
    private ZanataRestCaller restCaller;

    private List<LocaleId> translatedLocales =
            ImmutableList.<LocaleId> builder()
                    .add(new LocaleId("ja"))
                    .add(new LocaleId("de"))
                    .add(new LocaleId("es"))
                    .add(new LocaleId("zh")).build();
    private Resource[] resources;
    private Pair[] translations;

    @Before
    public void setUp() throws Exception {
        for (LocaleId locale : translatedLocales) {
            SampleDataResourceClient.addLanguage(locale.getId());
        }

        restCaller = new ZanataRestCaller();
        String projectType = ProjectType.Utf8Properties.name().toLowerCase();
        restCaller.createProjectAndVersion(PROJECT_SLUG, "master",
                projectType);
        restCaller.createProjectAndVersion(PROJECT_SLUG, "3.3",
                projectType);
        restCaller.createProjectAndVersion(PROJECT_SLUG, "3.4",
                projectType);
        restCaller.createProjectAndVersion(PROJECT_SLUG, "3.5",
                projectType);

        final int numOfTextFlows = 2000;
        Resource message1 =
                buildSourceResource("message1", generateTextFlows(
                        numOfTextFlows));
        Resource message2 =
                buildSourceResource("message2", generateTextFlows(
                        numOfTextFlows));
        Resource message3 =
                buildSourceResource("message3", generateTextFlows(
                        numOfTextFlows));
        Resource message4 =
                buildSourceResource("message4", generateTextFlows(
                        numOfTextFlows));
        resources = new Resource[] { message1/*, message2, message3, message4*/ };

        TranslationsResource translation1 =
                buildTranslationResource(generateTextFlowTargets(
                numOfTextFlows));
        TranslationsResource translation2 =
                buildTranslationResource(generateTextFlowTargets(
                numOfTextFlows));
        TranslationsResource translation3 =
                buildTranslationResource(generateTextFlowTargets(
                numOfTextFlows));
        TranslationsResource translation4 =
                buildTranslationResource(generateTextFlowTargets(
                numOfTextFlows));
        translations = new Pair[] { Pair.of(message1, translation1) };
                // , Pair.of(message2, translation2),
                // Pair.of(message3, translation3),
                // Pair.of(message4, translation4) };
    }

    private static TextFlow[] generateTextFlows(int numOfTextFlows) {
        return IntStream.range(0, numOfTextFlows).boxed().map(i ->
            buildTextFlow("res" + i,
                    RandomStringUtils.randomAlphabetic(10))
        ).toArray(TextFlow[]::new);
    }

    private static TextFlowTarget[] generateTextFlowTargets(int numOfTargets) {
        return IntStream.range(0, numOfTargets).boxed().map(i ->
                        buildTextFlowTarget("res" + i, "translation no. " + i)
        ).toArray(TextFlowTarget[]::new);
    }

    private void pushSource(String iterationSlug) {
        for (Resource resource : resources) {
            restCaller.postSourceDocResource(PROJECT_SLUG, iterationSlug,
                    resource,
                    false);
        }
    }

    private void pushTargets(String iterationSlug) {
        for (LocaleId localeId : translatedLocales) {
            for (Pair pair : translations) {
                log.info("pushing translation - version:{}, id:{}, locale:{}",
                        iterationSlug, pair.source.getName(), localeId);
                restCaller.postTargetDocResource(PROJECT_SLUG, iterationSlug,
                        pair.source.getName(),
                        localeId, pair.target, "import");
            }
        }
    }

    @Test
    public void pushPreviousVersions() {
        pushSource("master");
//        pushSource("3.3");
//        pushSource("3.4");
        pushSource("3.5");
        pushTargets("master");
//        pushTargets("3.3");
//        pushTargets("3.4");
/*

        List<String> locales = Lists.transform(translatedLocales,
                Functions.toStringFunction());
        String[] localesArray = locales.toArray(new String[locales.size()]);
        ContainerTranslationStatistics statistics =
                restCaller.getStatistics(PROJECT_SLUG, "master", localesArray);

        List<TranslationStatistics> statsList = statistics.getStats();
        for (TranslationStatistics translationStatistics : statsList) {
            log.info("statistics for locale: {}",
                    translationStatistics.getLocale());
            Assertions.assertThat(translationStatistics.getPercentTranslated())
                    .isEqualTo(100);
        }
*/

    }

    @RequiredArgsConstructor(staticName = "of")
    private static class Pair {
        private final Resource source;
        private final TranslationsResource target;
    }

}
