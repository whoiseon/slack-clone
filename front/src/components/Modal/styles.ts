

import styled from '@emotion/styled';
import { colors } from 'styles/variables';

export const CreateModal = styled.div`
  position: fixed;
  text-align: center;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1022;
  background-color: rgba(0, 0, 0, 0.3);
  & > div {
    margin-top: 200px;
    display: inline-block;
    width: 440px;
    background-color: ${colors.background.menu};
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    user-select: none;
    max-width: 440px;
    padding: 30px 40px;
    z-index: 1012;
    position: relative;
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
