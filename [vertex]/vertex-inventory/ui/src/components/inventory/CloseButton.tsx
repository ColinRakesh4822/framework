import React from 'react';
import { fetchNui } from '../../utils/fetchNui';

const CloseButton: React.FC = () => {
  const handleClose = () => {
    fetchNui('exit');
  };

  return (
    <div className="close-button">
      <div className="close-button-content">
        <div className="close-option" onClick={handleClose}>
          <span className="close-key">ESC</span>
          <span className="close-name">Close</span>
        </div>
      </div>
    </div>
  );
};

export default CloseButton;
