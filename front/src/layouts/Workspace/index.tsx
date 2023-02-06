import { lazy, useCallback, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import fetcher from 'utils/fetcher';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import gravatar from 'gravatar';
import { toast } from 'react-toastify';

import {
  AddButton,
  Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg,
  ProfileModal, RightMenu, WorkspaceButton, WorkspaceName, Workspaces, WorkspaceWrapper,
} from 'layouts/Workspace/styles';
import Menu from 'components/Menu';
import Modal from 'components/Modal';
import { IUser, IWorkspace } from 'typings/db';
import { Label, Input, Button } from 'pages/SignUp/styles';
import useInput from 'hooks/useInput';

const Channel = lazy(() => import('pages/Channel'));
const DirectMessage = lazy(() => import('pages/DirectMessage'));

const Workspace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const queryClient = useQueryClient();
  const { data: userData } = useQuery<IUser>('user', () =>
    fetcher({ queryKey: '/api/users' })
  );

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
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

  const onCreateWorkspace = useCallback((e: any) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;

    axios.post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl
    }, {
      withCredentials: true,
    })
      .then(() => {
        queryClient.refetchQueries('user');
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error)
        toast.error(error.response?.data, {
          position: 'bottom-center'
        })
      })
  }, [newWorkspace, newUrl, queryClient]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
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
            {showUserMenu && (
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
            )}
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
          <WorkspaceName>
            Sleact
          </WorkspaceName>
          <MenuScroll>
            menu scroll
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="channel" element={<Channel />} />
            <Route path="dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      {
        showCreateWorkspaceModal && (
          <Modal
            show={showCreateWorkspaceModal}
            onCloseModal={onCloseModal}
          >
            <form onSubmit={onCreateWorkspace}>
              <Label id="workspace-label">
                <span>이름</span>
                <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
              </Label>
              <Label id="workspace-url-label">
                <span>주소</span>
                <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
              </Label>
              <Button type="submit">생성하기</Button>
            </form>
          </Modal>
        )
      }
    </div>
  );
};

export default Workspace;
