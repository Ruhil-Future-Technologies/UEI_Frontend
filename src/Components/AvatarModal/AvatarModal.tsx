import React from 'react';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

const AvatarModal = ({ open, handleClose, handleAvatarSelect, avatars }:any) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ backgroundColor: 'white', padding: '20px', margin: 'auto', marginTop: '10%', width: '20%' ,marginLeft:"150px" }}>
        <h4>Select an Avatar</h4>
        <div className="avatar-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {avatars?.map((avatar: string | undefined, index: React.Key | null | undefined) => (
            <img
              key={index}
              src={avatar}
              alt="avatar"
              style={{ width: '50px', height: '50px', cursor: 'pointer' }}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AvatarModal;