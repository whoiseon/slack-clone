import { Container, Header } from 'pages/DirectMessage/styles';
import gravatar from 'gravatar';
import { useQuery, useInfiniteQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import fetcher from 'utils/fetcher';
import ChatBox from 'components/ChatBox';
import ChatList from 'components/ChatList';
import useInput from 'hooks/useInput';
import { useCallback } from 'react';
import axios from 'axios';
import { IDM } from 'typings/db';

const DirectMessage = () => {
  const [chat, onChangeChat, setChange] = useInput('');

  const { workspace, id } = useParams<{ workspace: string, id: string }>()

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
  const { data: chatData } = useQuery<IDM[]>(
    ['workspace', workspace, 'dm', id, 'chat'],
    () => (
      fetcher({ queryKey: `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`})
    )
  )

  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      }, {
        withCredentials: true
      })
        .then(() => {
          queryClient.refetchQueries(['workspace', workspace, 'dm', id, 'chat'])
          setChange('');
        })
        .catch((error) => {
          console.dir(error);
        })
    }
  }, [chat, workspace, id, queryClient]);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{ userData.nickname }</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
        placeholder={myData.id === Number(id) ? '내용을 입력해주세요' : `${userData.nickname}에 메세지 보내기`}
      />
    </Container>
  )
}

export default DirectMessage;
