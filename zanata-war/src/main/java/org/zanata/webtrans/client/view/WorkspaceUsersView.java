package org.zanata.webtrans.client.view;

import org.zanata.webtrans.client.presenter.WorkspaceUsersPresenter;
import org.zanata.webtrans.client.resources.UiMessages;
import org.zanata.webtrans.client.ui.HasManageUserPanel;
import org.zanata.webtrans.client.ui.UserPanel;
import org.zanata.webtrans.shared.model.Person;
import org.zanata.webtrans.shared.rpc.HasWorkspaceChatData.MESSAGE_TYPE;

import com.google.common.base.Strings;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.HasAllFocusHandlers;
import com.google.gwt.event.dom.client.HasClickHandlers;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PushButton;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.SplitLayoutPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.inject.Inject;

public class WorkspaceUsersView extends Composite implements WorkspaceUsersPresenter.Display
{

   private static WorkspaceUsersViewUiBinder uiBinder = GWT.create(WorkspaceUsersViewUiBinder.class);

   interface WorkspaceUsersViewUiBinder extends UiBinder<SplitLayoutPanel, WorkspaceUsersView>
   {
   }

   interface Styles extends CssResource
   {
      String systemMsg();

      String userName();

      String systemWarn();
      
      String msg();
   }

   @UiField
   VerticalPanel userListPanel;

   @UiField(provided = true)
   SplitLayoutPanel mainPanel;

   @UiField
   VerticalPanel chatRoom;

   @UiField
   TextBox chatInput;

   @UiField
   PushButton sendButton;

   @UiField
   ScrollPanel chatRoomScrollPanel;

   @UiField
   Styles style;

   @Inject
   public WorkspaceUsersView(final UiMessages uiMessages)
   {
      mainPanel = new SplitLayoutPanel(5);
      initWidget(uiBinder.createAndBindUi(this));

      sendButton.setText(uiMessages.sendLabel());
   }

   @Override
   public Widget asWidget()
   {
      return this;
   }

   @Override
   public HasManageUserPanel addUser(Person person)
   {
      UserPanel userPanel = new UserPanel(person.getName(), person.getAvatarUrl());
      userListPanel.add(userPanel);
      return userPanel;
   }

   @Override
   public void removeUser(HasManageUserPanel userPanel)
   {
      for (int i = 0; i < userListPanel.getWidgetCount(); i++)
      {
         if (userPanel.equals(userListPanel.getWidget(i)))
         {
            userListPanel.remove(i);
         }
      }
   }

   @Override
   public HasClickHandlers getSendButton()
   {
      return sendButton;
   }

   @Override
   public HasText getInputText()
   {
      return chatInput;
   }

   @Override
   public void appendChat(String user, String timestamp, String msg, MESSAGE_TYPE messageType)
   {
      Label timestampLabel = new Label("[" + timestamp + "]");
      Label msgLabel = new Label(msg);
      if (messageType == MESSAGE_TYPE.SYSTEM_MSG)
      {
         timestampLabel.setStyleName(style.systemMsg());
         msgLabel.setStyleName(style.systemMsg());
      }
      else if (messageType == MESSAGE_TYPE.SYSTEM_WARNING)
      {
         timestampLabel.setStyleName(style.systemWarn());
         msgLabel.setStyleName(style.systemWarn());
      } 
      else
      {
         timestampLabel.setStyleName(style.msg());
         msgLabel.setStyleName(style.msg());
      }

      HorizontalPanel hp = new HorizontalPanel();

      if (!Strings.isNullOrEmpty(timestamp))
      {
         hp.add(timestampLabel);
      }
      if (!Strings.isNullOrEmpty(user))
      {
         Label userLabel = new Label(user + ":");
         userLabel.setStyleName(style.userName());
         hp.add(userLabel);
      }
      hp.add(msgLabel);

      chatRoom.add(hp);

      chatRoomScrollPanel.scrollToBottom();
   }

   @Override
   public HasAllFocusHandlers getFocusInputText()
   {
      return chatInput;
   }
}
