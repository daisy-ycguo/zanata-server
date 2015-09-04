import _ from 'lodash';
import StringUtils from './StringUtils'

var GlossaryHelper = {

  /**
   * Generate org.zanata.rest.dto.GlossaryTerm object
   * @param data
   */
  generateGlossaryTermDTO: function (data) {
    var term = {};
    term['content'] = data.content;
    term['locale'] = data.locale;
    term['comments'] = data.comment;
    return term;
  },

  /**
   * Generate org.zanata.rest.dto.Glossary object
   * @param data
   */
  generateGlossaryDTO: function (data) {
    var glossary = {}, entry = {};
    glossary['glossaryEntries'] = [];

    entry['resId'] = data.resId;
    entry['pos'] = data.pos;
    entry['description'] = data.description;
    entry['srcLang'] = data.srcTerm.locale;
    entry['sourceReference'] = data.srcTerm.reference;
    entry['glossaryTerms'] = [];

    var srcTerm = this.generateGlossaryTermDTO(data.srcTerm);
    entry['glossaryTerms'].push(srcTerm);

    var transTerm = this.generateGlossaryTermDTO(data.transTerm);
    entry['glossaryTerms'].push(transTerm);

    glossary['glossaryEntries'].push(entry);
    return glossary;
  },

  /**
   *
   * @param localeList - Array org.zanata.rest.dto.GlossaryLocaleStats
   * @param displayName locale display name. e.g English (United States)
   */
  getLocaleIdByDisplayName: function (localeList, displayName) {
    var localeId = _(localeList)
      .filter(function(locale) { return locale.locale.displayName === displayName; })
      .pluck('locale.localeId')
      .value();

    return localeId[0];
  },

  getTermByLocale: function (terms, localeId) {
    var term =  _(terms)
      .filter(function(term) { return term.locale === localeId; })
      .value();

    return term[0];
  }
};
export default GlossaryHelper;