/*
 * Copyright 2010, Red Hat, Inc. and individual contributors as indicated by the
 * @author tags. See the copyright.txt file in the distribution for a full
 * listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this software; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA, or see the FSF
 * site: http://www.fsf.org.
 */
package org.zanata.security;

import java.io.IOException;
import java.io.Serializable;
import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.callback.UnsupportedCallbackException;

import static org.jboss.seam.ScopeType.SESSION;
import static org.jboss.seam.annotations.Install.APPLICATION;

import org.jboss.seam.annotations.Install;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.jboss.seam.annotations.intercept.BypassInterceptors;
import org.zanata.security.openid.OpenIdProviderType;

import lombok.extern.slf4j.Slf4j;

/**
 * Overrides the default Seam credentials. Adds app-specific security concepts
 * like authentication mechanisms.
 *
 * @author Carlos Munoz <a
 *         href="mailto:camunoz@redhat.com">camunoz@redhat.com</a>
 */
@Name("org.jboss.seam.security.credentials")
@Scope(SESSION)
@Install(precedence = APPLICATION)
@BypassInterceptors
@Slf4j
public class ZanataCredentials implements Serializable {
    private static final long serialVersionUID = 5520824011655916917L;
    private String username;
    private String password;
    private boolean initialized;
    private boolean invalid;

    private AuthenticationType authType;

    private OpenIdProviderType openIdProviderType;

    public AuthenticationType getAuthType() {
        return authType;
    }

    public void setAuthType(AuthenticationType authType) {
        this.authType = authType;
    }

    public OpenIdProviderType getOpenIdProviderType() {
        return openIdProviderType;
    }

    public void setOpenIdProviderType(OpenIdProviderType openIdProviderType) {
        this.openIdProviderType = openIdProviderType;
    }

    public boolean isSet() {
        return getUsername() != null && password != null;
    }

    public boolean isInvalid() {
        return invalid;
    }

    public void clear() {
        username = null;
        password = null;
        authType = null;
        openIdProviderType = null;
    }

    public String getUsername() {
        if (!isInitialized()) {
            setInitialized(true);
        }
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        invalid = false;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
        invalid = false;
    }

    public boolean isInitialized() {
        return initialized;
    }

    public void setInitialized(boolean initialized) {
        this.initialized = initialized;
    }

    public void invalidate() {
        invalid = true;
    }

    public CallbackHandler createCallbackHandler() {
        return new CallbackHandler() {
            public void handle(Callback[] callbacks) throws IOException,
                    UnsupportedCallbackException {
                for (int i = 0; i < callbacks.length; i++) {
                    if (callbacks[i] instanceof NameCallback) {
                        ((NameCallback) callbacks[i]).setName(getUsername());
                    } else if (callbacks[i] instanceof PasswordCallback) {
                        ((PasswordCallback) callbacks[i])
                                .setPassword(getPassword() != null ? getPassword()
                                        .toCharArray() : null);
                    } else if (callbacks[i] instanceof AuthenticationTypeCallback) {
                        ((AuthenticationTypeCallback) callbacks[i])
                                .setAuthType(getAuthType());
                    } else {
                        log.warn("Unsupported callback " + callbacks[i]);
                    }
                }
            }
        };
    }
}
