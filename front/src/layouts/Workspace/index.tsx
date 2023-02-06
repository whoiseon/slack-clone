import { lazy, useCallback } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import fetcher from 'utils/fetcher';
import { Routes, Route, Navigate } from "react-router-dom";
import gravatar from 'gravatar';

import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from 'layouts/Workspace/styles';

const Channel = lazy(() => import('pages/Channel'));
const DirectMessage = lazy(() => import('pages/DirectMessage'));

const Workspace = () => {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery('user', () =>
    fetcher({ queryKey: '/api/users' })
  );

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    })
      .then(() => {
        queryClient.setQueriesData('user', () => null);
      })
  }, [queryClient])

  if (!userData) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button
        type="button"
        onClick={onLogout}
      >
        로그아웃
      </button>
      <WorkspaceWrapper>
        <Workspaces>
          test
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
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
