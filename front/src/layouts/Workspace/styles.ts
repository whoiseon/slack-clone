import styled from '@emotion/styled';
import { colors } from 'styles/variables';

export const RightMenu = styled.div`
  float: right;
`;

export const Header = styled.header`
  height: 38px;
  background: ${colors.background.channel.topNav};
  color: #ffffff;
  box-shadow: 0 1px 0 0 rgb(209 210 211 / 10%);
  padding: 5px;
  text-align: center;
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 5px;
  right: 16px;
`;

export const ProfileModal = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  & img {
    display: flex;
    width: 28px;
    height: 28px;
  }
  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  & #profile-name {
    font-weight: bold;
    display: inline-flex;
  }
  & #profile-active {
    font-size: 13px;
    display: inline-flex;
  }
`;

export const LogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid ${colors.border.channel};
  background: transparent;
  color: ${colors.text.white};
  display: block;
  padding: 12px 20px;
  outline: none;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background: ${colors.button.primary};
    color: #FFFFFF;
  }
`;

export const WorkspaceWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const Workspaces = styled.div`
  width: 65px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: ${colors.background.channel.sideNav};
  border-top: 1px solid ${colors.border.channel};
  border-right: 1px solid ${colors.border.channel};
  vertical-align: top;
  text-align: center;
  padding: 15px 0 0;
`;

export const Channels = styled.nav`
  width: 260px;
  display: inline-flex;
  flex-direction: column;
  background: ${colors.background.channel.sideNav};
  border-right: 1px solid ${colors.border.channel};
  color: rgb(188, 171, 188);
  vertical-align: top;
  & a {
    padding-left: 16px;
    color: inherit;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    &.channels {
      font-weight: bold;
    }
    &.selected {
      color: white;
    }
    &:hover {
      background-color: ${colors.background.channel.sideNavHover};
    }
    
    span {
      i {
        font-style: normal;
        margin-right: 10px;
      }
    }
  }
  & .bold {
    color: white;
    font-weight: bold;
  }
  & .count {
    margin-left: auto;
    background: #cd2553;
    border-radius: 16px;
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    height: 18px;
    line-height: 18px;
    padding: 0 9px;
    color: white;
    margin-right: 16px;
  }
  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const WorkspaceName = styled.button`
  height: 50px;
  line-height: 50px;
  border: none;
  width: 100%;
  text-align: left;
  border-top: 1px solid ${colors.border.channel};
  border-bottom: 1px solid ${colors.border.channel};
  font-weight: 900;
  font-size: 15px;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 0 0 16px;
  margin: 0;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: ${colors.background.channel.sideNavHover};
  }
`;

export const MenuScroll = styled.div`
  height: calc(100vh - 102px);
  overflow-y: auto;
`;

export const WorkspaceModal = styled.div`
  padding: 10px 0 0;
  & h2 {
    padding-left: 20px;
  }
  & > button {
    width: 100%;
    padding: 10px 20px;
    text-align: left;
    border: none;
    background: transparent;
    border-top: 1px solid ${colors.border.channel};
    cursor: pointer;
    color: ${colors.text.white};

    &:hover {
      background: ${colors.button.primary};
      color: #FFFFFF;
    }
    
    &:last-of-type {
      border-bottom: 1px solid rgb(28, 29, 28);
    }
  }
`;

export const Chats = styled.div`
  flex: 1;
`;

export const AddButton = styled.button`
  color: white;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const WorkspaceButton = styled.button`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 3px solid #3f0e40;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  color: black;
  cursor: pointer;
`;
