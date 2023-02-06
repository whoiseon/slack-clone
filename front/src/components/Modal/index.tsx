import { useCallback } from 'react';
import { CloseModalButton, CreateModal } from 'components/Modal/styles';

interface Props {
  show: boolean;
  children: JSX.Element;
  onCloseModal: () => void;
}

const Modal = ({ show, children, onCloseModal }: Props) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        { children }
      </div>
    </CreateModal>
  );
};

export default Modal;
