import { lazy, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import fetcher from 'utils/fetcher';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import gravatar from 'gravatar';
import { useParams } from 'react-router';

import {
  AddButton,
  Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg,
  ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper,
} from 'layouts/Workspace/styles';
import Menu from 'components/Menu';
import { IChannel, IUser, IWorkspace } from 'typings/db';
import CreateChannelModal from 'components/CreateChannelModal';
import CreateWorkspaceModal from 'components/CreateWorkspaceModal';
import InviteWorkspaceModal from 'components/InviteWorkspaceModal';
import InviteChannelModal from 'components/InviteChannelModal';
import ChannelList from 'components/ChannelList';
import DMList from 'components/DMList';
import useSocket from 'hooks/useSocket';

const Channel = lazy(() => import('pages/Channel'));
const DirectMessage = lazy(() => import('pages/DirectMessage'));

const Workspace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

  const queryClient = useQueryClient();
  const { data: userData } = useQuery<IUser>('user', () =>
    fetcher({ queryKey: '/api/users' })
  );
  const { data: channelData } = useQuery<IChannel[]>(
    ['workspace', workspace, 'channel'], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/channels` }),
    {
      enabled: !!userData,
    }
  );
  const { data: memberData } = useQuery<IChannel[]>(
    ['workspace', workspace, 'channel', channel, 'member'], () =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/members` }),
    {
      enabled: !!userData,
    }
  );

  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit('login', {
        id: userData.id,
        channels: channelData.map((v) => v.id),
      });
    }
  }, [channelData, userData, socket]);

  useEffect(() => {
    return () => {
      disconnect();
    }
  }, [workspace]);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    })
      .then(() => {
        queryClient.setQueriesData('user', () => null);
      })
  }, [queryClient]);

  const onClickUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  if (!userData) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            <Menu
              style={{ right: '14px', top: '38px' }}
              show={showUserMenu}
              onCloseModal={onClickUserProfile}
            >
              <>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{ userData.nickname }</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton
                  type="button"
                  onClick={onLogout}
                >
                  로그아웃
                </LogOutButton>
              </>
            </Menu>
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {
            userData.Workspaces.map((ws: IWorkspace) => {
              return (
                <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                  <WorkspaceButton>{ ws.name.slice(0, 1).toUpperCase() }</WorkspaceButton>
                </Link>
              )
            })
          }
          <AddButton onClick={onClickCreateWorkspace}>
            +
          </AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            Sleact
          </WorkspaceName>
          <MenuScroll>
            <Menu
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{ top: 84, left: 80 }}
            >
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>{workspace}에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 생성</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
    </div>
  );
};

export default Workspace;
