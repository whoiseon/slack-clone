import styled from '@emotion/styled';
import { colors } from 'styles/variables';

export const ChatWrapper = styled.div`
  display: flex;
  padding: 8px 20px;
  width: 100%;
  &:hover {
    background: ${colors.background.chat};
  }
  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 8px;
    & img {
      width: 36px;
      height: 36px;
    }
  }
  & .chat-text {
    & > p {
      margin-top: 8px;
    }
    & .chat-user {
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        margin-left: 6px;
        color: ${colors.text.gray};
      }
    }
  }
`;
