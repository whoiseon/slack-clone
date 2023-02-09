import { ChatZone, Section, StickyHeader } from 'components/ChatList/styles';
import { IChat, IDM } from 'typings/db';
import Chat from 'components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';
import { forwardRef, MutableRefObject, useCallback, useRef } from 'react';
import { InfiniteQueryObserverResult } from 'react-query';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  fetchNext: () => Promise<InfiniteQueryObserverResult>;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, isReachingEnd, fetchNext }, scrollRef) => {
  const onScroll = useCallback(
    (values: any) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('가장 위');
        fetchNext().then(() => {
          // 스크롤 위치 유지
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          current?.scrollTop(current.getScrollHeight() - values.scrollHeight);
          console.log(current.getScrollHeight() - values.scrollHeight)
        });
      }
    },
    [scrollRef, isReachingEnd, fetchNext],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {
          Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            )
          })
        }
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
