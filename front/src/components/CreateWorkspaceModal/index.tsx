import Modal from 'components/Modal';
import { Button, Input, Label } from 'pages/SignUp/styles';
import { Dispatch, SetStateAction, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useInput from 'hooks/useInput';
import { useQueryClient } from 'react-query';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateWorkspaceModal: Dispatch<SetStateAction<boolean>>
}

const CreateWorkspaceModal = ({ show, onCloseModal, setShowCreateWorkspaceModal }: Props) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const queryClient = useQueryClient();

  const onCreateWorkspace = useCallback((e: any) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;
    if (!newUrl || !newUrl.trim()) return;

    axios.post('/api/workspaces', {
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

  if (!show) {
    return null;
  }

  return (
    <Modal
      show={show}
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
  );
};

export default CreateWorkspaceModal;
