/*
 * Copyright 2013, Red Hat, Inc. and individual contributors
 * as indicated by the @author tags. See the copyright.txt file in the
 * distribution for a full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
package org.zanata.service;

import java.util.Date;
import java.util.List;

import org.zanata.common.UserActionType;
import org.zanata.model.Activity;
import org.zanata.model.HPerson;
import org.zanata.model.ILoggable;
import org.zanata.model.type.EntityType;

/**
 * @author Alex Eng <a href="mailto:aeng@redhat.com">aeng@redhat.com</a>
 */
public interface ActivityService
{
   /**
    * Get all user activities
    * @param personId
    * @param contextId
    * @param offset
    * @param count
    * @return List<Activity>
    */
   List<Activity> getAllPersonActivities(Long personId, Long contextId, int offset, int count);
   
   /**
    * Log activity, record roll up in hourly basis
    * 
    * @param acter
    * @param context
    * @param target
    * @param action
    * @param wordCount
    */
   void logActivity(HPerson acter, ILoggable context, ILoggable target, UserActionType action, int wordCount);

   
   /**
    * Find activity with given person, context, action and time
    * 
    * @param acterId
    * @param contextId
    * @param action
    * @param roundOffActionTime
    * @return
    */
   Activity findUserActivityInTimeRange(Long acterId, Long contextId, UserActionType action, Date roundOffActionTime);

   /**
    * Get target or lastTarget entity in activity
    * 
    * @param entityType
    * @param entityId
    * @return
    * @throws Exception
    */
   Object getEntity(EntityType entityType, Long entityId) throws Exception;
}
