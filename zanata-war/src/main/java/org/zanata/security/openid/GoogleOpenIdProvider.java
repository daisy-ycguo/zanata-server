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
package org.zanata.security.openid;

import java.util.HashMap;
import java.util.Map;

import org.openid4java.message.MessageException;
import org.openid4java.message.ParameterList;
import org.openid4java.message.ax.FetchRequest;

/**
 * Google Open Id provider.
 *
 * @author Carlos Munoz <a href="mailto:camunoz@redhat.com">camunoz@redhat.com</a>
 */
public class GoogleOpenIdProvider implements OpenIdProvider
{
   @Override
   public String getOpenId(String username)
   {
      return "https://www.google.com/accounts/o8/id";
   }

   @Override
   public String extractEmailAddress(ParameterList paramList)
   {
      return paramList.getParameterValue("openid.ext1.value.email");
   }

   @Override
   public void prepareFetchRequest(FetchRequest request)
   {
      try
      {
         request.addAttribute("email", "http://schema.openid.net/contact/email", true);
      }
      catch (MessageException e)
      {
         throw new RuntimeException(e);
      }
   }
}
