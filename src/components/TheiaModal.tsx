import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React, { useContext } from 'react';
import { Context } from '../context/Context';

function TheiaModal() {
  const { isModalOpen, modalContent } = useContext(Context);

  return (
    <Modal open={isModalOpen}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {modalContent.function(modalContent.props)}
      </Box>
    </Modal>
  );
}

export default TheiaModal;
