import styled from '@emotion/styled';
import { colors } from 'styles/variables';
// import { MentionsInput } from 'react-mentions';

export const ChatArea = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px 20px 20px;
`;

export const Form = styled.form`
  color: rgb(29, 28, 29);
  font-size: 15px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #565856;
  background-color: ${colors.background.chat};
`;

export const MentionsTextarea = styled.div`
  font-size: 15px;
  padding: 8px 9px;
  width: 100%;
  & strong {
    background: skyblue;
  }
  & textarea {
    font-family: 'Apple SD Gothic Neo', 'monospace', sans-serif;
    font-size: 15px;
    width: 100%;
    height: 38px;
    padding: 9px 10px !important;
    outline: none !important;
    border-radius: 4px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
    background-color: ${colors.background.chat};
    color: ${colors.text.white};
  }
  & ul {
    border: 1px solid lightgray;
    max-height: 200px;
    overflow-y: auto;
    padding: 9px 10px;
    background: white;
    border-radius: 4px;
    width: 150px;
  }
`;

export const Toolbox = styled.div`
  position: relative;
  background: ${colors.background.chat};
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export const SendButton = styled.button`
  position: absolute;
  right: 5px;
  top: 0;
  
  i {
    color: ${colors.text.white};
    opacity: 0.5;
    
    &:hover {
      opacity: 1;
    }
  }
`;

export const EachMention = styled.button<{ focus: boolean }>`
  padding: 4px 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: rgb(28, 29, 28);
  width: 100%;
  & img {
    margin-right: 5px;
  }
  ${({ focus }) =>
  focus &&
  `
    background: #1264a3;
    color: white;
  `};
`;
