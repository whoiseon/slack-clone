import styled from '@emotion/styled';
import { colors } from 'styles/variables';

export const CreateMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  & > div {
    position: absolute;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: ${colors.background.menu};
    border: 1px solid ${colors.border.channel};
    border-radius: 6px;
    user-select: none;
    min-width: 300px;
    z-index: 512;
    max-height: calc(100vh - 20px);
    color: ${colors.text.white};
    overflow: hidden;
    
    & > button {
      color: ${colors.text.white};
      
      &:hover {
        background: ${colors.button.primary};
        color: #FFFFFF;
      }
    }
  }
`;

export const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #FFFFFF;
  border-radius: 6px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
`;
