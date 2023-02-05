import { useCallback } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';

const Workspace = () => {
  const queryClient = useQueryClient();

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    })
      .then(() => {
        queryClient.setQueriesData('user', () => null);
      })
  }, [queryClient])

  return (
    <button
      type="button"
      onClick={onLogout}
    >
      로그아웃
    </button>
  );
};

export default Workspace;
