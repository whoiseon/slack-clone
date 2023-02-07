import Modal from 'components/Modal';
import { Button, Input, Label } from 'pages/SignUp/styles';
import { Dispatch, SetStateAction, useCallback } from 'react';
import useInput from 'hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: Props) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

  const queryClient = useQueryClient();

  const onCreateChannel = useCallback((e: any) => {
    e.preventDefault();

    axios.post(`/api/workspaces/${workspace}/channels`, {
      name: newChannel,
    }, {
      withCredentials: true,
    })
      .then(() => {
        setShowCreateChannelModal(false);
        queryClient.refetchQueries(['workspace', workspace, 'channel']);
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      })
  }, [newChannel, workspace, queryClient, onCloseModal]);

  if (!show) {
    return null;
  }

  return (
    <Modal
      show={show}
      onCloseModal={onCloseModal}
    >
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
