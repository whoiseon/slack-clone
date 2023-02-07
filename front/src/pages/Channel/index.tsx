import { Container, Header } from 'pages/Channel/styles';
import ChatList from 'components/ChatList';
import ChatBox from 'components/ChatBox';
import useInput from 'hooks/useInput';
import { useCallback } from 'react';
import { useParams } from 'react-router';

const Channel = () => {
  const { channel } = useParams<{ channel: string }>();

  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    setChat('');
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
        placeholder={`#${channel}에 메세지 보내기`}
      />
    </Container>
  );
};

export default Channel;
