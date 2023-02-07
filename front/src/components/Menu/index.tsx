import { CloseModalButton, CreateMenu } from 'components/Menu/styles';
import { CSSProperties, useCallback } from 'react';

interface Props {
  children: JSX.Element;
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}

const Menu = ({ children, style, show, onCloseModal, closeButton }: Props) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        { closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton> }
        { children }
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: false,
}

export default Menu;
