import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export type TheiaModalProps = {
  isModalOpen: boolean;
  modalContent: JSX.Element;
};

function TheiaModal(props: TheiaModalProps) {
  return (
    <Modal open={props.isModalOpen}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {props.modalContent}
      </Box>
    </Modal>
  );
}

export default TheiaModal;
