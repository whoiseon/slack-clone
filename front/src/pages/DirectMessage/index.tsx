import { Container, Header } from 'pages/DirectMessage/styles';
import gravatar from 'gravatar';
import { useQuery, useInfiniteQuery, useQueryClient, useMutation, InfiniteData } from 'react-query';
import { useParams } from 'react-router';
import fetcher, { fetcherPostChat } from 'utils/fetcher';
import ChatBox from 'components/ChatBox';
import ChatList from 'components/ChatList';
import useInput from 'hooks/useInput';
import { useCallback, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { IDM } from 'typings/db';
import makeSection from 'utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import useSocket from 'hooks/useSocket';

const DirectMessage = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const { workspace, id } = useParams<{ workspace: string, id: string }>()

  const [socket] = useSocket(workspace);

  const queryClient = useQueryClient();
  const { data: userData } = useQuery(
    ['workspace', workspace, 'member', id],
    () => (
      fetcher({ queryKey: `/api/workspaces/${workspace}/users/${id}` })
    )
  );
  const { data: myData } = useQuery(
    'user',
    () => (
      fetcher({ queryKey: '/api/users' })
    )
  );
  const { data: chatData, fetchNextPage, hasNextPage } = useInfiniteQuery<IDM[]>(
    ['workspace', workspace, 'dm', id, 'chat'],
    ({ pageParam = 0 }) => {
      return fetcher({ queryKey: `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${pageParam + 1}` })
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      }
    }
  )

  const isEmpty = chatData?.pages?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData?.pages[chatData?.pages.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  const mutation = useMutation<IDM, any, { content: string }>(
    ['workspace', workspace, 'dm', id, 'chat'],
    () => fetcherPostChat({
      queryKey: `/api/workspaces/${workspace}/dms/${id}/chats`,
      data : { content: chat }
    }),
    {
      onMutate(mutateData) {
        queryClient.setQueryData<InfiniteData<IDM[]>>(['workspace', workspace, 'dm', id, 'chat'], (data) => {
          const newPages = data?.pages.slice() || [];
          newPages[0].unshift({
            id: (data?.pages[0][0]?.id || 0) + 1,
            content: mutateData.content,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return {
            pageParams: data?.pageParams || [],
            pages: newPages,
          };
        });
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      },
      onSuccess() {
        queryClient.refetchQueries(['workspace', workspace, 'dm', id, 'chat']);
      },
      onError(error) {
        console.error(error);
      },
    },
  );

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        mutation.mutate({ content: chat });
      }
    },
    [chat, chatData, mutation],
  );

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      queryClient.setQueryData<InfiniteData<IDM[]>>(['workspace', workspace, 'dm', id, 'chat'], (prev) => {
        const newPages = prev?.pages.slice() || [];
        newPages[0].unshift(data);

        return {
          pageParams: prev?.pageParams || [],
          pages: newPages
        };
      });
      if (scrollbarRef.current) {
        if (scrollbarRef.current.getScrollHeight() < (scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150)) {
          console.log('scrollToBottom!', scrollbarRef.current?.getValues());
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 50)
        }
      }
    }
  }, [workspace, id, myData.id, queryClient]);

  useEffect(() => {
    socket?.on('dm', onMessage);

    return () => {
      socket?.off('dm', onMessage);
    }
  }, [socket, id, myData]);

  useEffect(() => { // ????????? ???????????? ??? ??????
    if (chatData?.pages.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData, scrollbarRef]);


  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.pages.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{ userData.nickname }</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        fetchNext={fetchNextPage}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
        placeholder={myData.id === Number(id) ? '????????? ??????????????????' : `${userData.nickname}??? ????????? ?????????`}
      />
    </Container>
  )
}

export default DirectMessage;
