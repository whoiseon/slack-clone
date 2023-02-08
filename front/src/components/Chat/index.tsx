import { ChatWrapper } from 'components/Chat/styles';
import gravatar from 'gravatar';
import { IDM } from 'typings/db';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { memo, useMemo } from 'react';

interface Props {
  data: IDM;
}

const Chat = ({ data }: Props) => {
  const { workspace } = useParams<{ workspace: string }>();
  const user = data.Sender;

  // @[테스트](1)
  // \d 숫자,
  // +는 1개 이상 ?는 0개나 1개 *는 0개 이상 g는 모두찾기
  const result = useMemo(() => (
    regexifyString({
      input: data.content,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      decorator(match, index) {
        const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
        if (arr) {
          return (
            <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
              @{arr[1]}
            </Link>
          );
        }
        return <br key={index} />;
      }
    })
  ), [data.content]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{ user.nickname }</b>
          <span>{ dayjs(data.createdAt).locale('ko').format('A h:mm') }</span>
        </div>
        <p>{ result }</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
