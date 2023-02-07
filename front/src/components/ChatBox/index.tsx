import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from 'components/ChatBox/styles';
import { ReactNode, useCallback, useEffect, useRef } from 'react';

import TextareaAutosize from "react-textarea-autosize";
import { Mention, SuggestionDataItem } from 'react-mentions';
import { useQuery, useQueryClient } from 'react-query';
import { IChannel, IUser } from 'typings/db';
import fetcher from 'utils/fetcher';
import { useParams } from 'react-router';
import * as React from 'react';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onChangeChat, onSubmitForm, placeholder }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

  const queryClient = useQueryClient();
  const { data: userData } = useQuery<IUser>('user', () =>
    fetcher({ queryKey: '/api/users' })
  );
  const { data: memberData } = useQuery<IUser[]>(
    ['workspace', workspace, 'channel', channel, 'member'], () =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/members` }),
    {
      enabled: !!userData,
    }
  );

  const onKeydownChat = useCallback((e: any) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, [onSubmitForm]);

  const renderSuggestion = useCallback((
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ): React.ReactNode => {
    if (!memberData) return;
    return (
      <EachMention focus={focused}>
        <img src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })} alt={memberData[index].nickname} />
        <span>{ highlightedDisplay }</span>
      </EachMention>
    )
  }, [memberData]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea>
          <TextareaAutosize
            ref={textareaRef}
            placeholder={placeholder}
            value={chat}
            onChange={onChangeChat}
            onKeyDown={onKeydownChat}
            rows={1}
          >
            <Mention
              appendSpaceOnAdd
              trigger="@"
              data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
              renderSuggestion={renderSuggestion}
            />
          </TextareaAutosize>
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
