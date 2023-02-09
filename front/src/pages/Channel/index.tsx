import { Container, Header } from 'pages/Channel/styles';
import ChatList from 'components/ChatList';
import ChatBox from 'components/ChatBox';
import useInput from 'hooks/useInput';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { IChannel, IDM, IChat } from 'typings/db';
import fetcher, { fetcherPostChat } from 'utils/fetcher';
import { Scrollbars } from 'react-custom-scrollbars';
import { AxiosError } from 'axios';
import makeSection from 'utils/makeSection';
import useSocket from 'hooks/useSocket';
import InviteChannelModal from 'components/InviteChannelModal';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const [chat, onChangeChat, setChat] = useInput('');
  const [socket] = useSocket(workspace);

  const queryClient = useQueryClient();
  const { data: myData } = useQuery(
    'user',
    () => (
      fetcher({ queryKey: '/api/users' })
    )
  );
  const { data: channelData } = useQuery<IChannel>(['workspace', workspace, 'channel', channel], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}` })
  )
  const { data: chatData, fetchNextPage, hasNextPage } = useInfiniteQuery<IDM[]>(
    ['workspace', workspace, 'channel', channel, 'chat'],
    ({ pageParam = 0 }) =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${pageParam + 1}` }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      }
    }
  )
  const { data: channelMembersData } = useQuery(['workspace', workspace, 'channel', channel, 'member'], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}/members` }),
    {
      enabled: !!myData,
    }
  )

  const isEmpty = chatData?.pages?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData?.pages[chatData?.pages.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  const mutation = useMutation<IChat, AxiosError, { content: string }>(
    ['workspace', workspace, 'channel', channel, 'chat'],
    () => fetcherPostChat({
      queryKey: `/api/workspaces/${workspace}/channels/${channel}/chats`,
      data: { content: chat },
    }),
    {
      onMutate(mutateData) {
        if (!channelData) return;
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ['workspace', workspace, 'channel', channel, 'chat'],
          (data) => {
            const newPages = data?.pages.slice() || [];
            newPages[0].unshift({
              id: (data?.pages[0][0]?.id || 0) + 1,
              content: mutateData.content,
              UserId: myData.id,
              User: myData,
              ChannelId: channelData.id,
              Channel: channelData,
              createdAt: new Date(),
            });
            return {
              pageParams: data?.pageParams || [],
              pages: newPages
            };
          },
        );
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      },
      onSuccess() {
        queryClient.refetchQueries(['workspace', workspace, 'channel', channel, 'chat']);
      },
      onError(error) {
        console.error(error);
      }
    }
  )

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    if (chat?.trim() && chatData && channelData) {
      mutation.mutate({ content: chat });
    }
  }, [chat, chatData, channelData, mutation]);

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ['workspace', workspace, 'channel', channel, 'chat'],
          (prev) => {
            const newPages = prev?.pages.slice() || [];
            newPages[0].unshift(data);
            return {
              pageParams: prev?.pageParams || [],
              pages: newPages,
            };
          },
        );
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      }
    },
    [channel, myData, queryClient, workspace],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.pages.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [chatData]);

  if (!myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.pages.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <span># { channel }</span>
        <div className="header-right">
          <span>{ channelMembersData?.length }</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        fetchNext={fetchNextPage}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
        placeholder={`#${channel}에 메세지 보내기`}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
};

export default Channel;
