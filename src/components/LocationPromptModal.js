import React from 'react';
import '../styles/LocationPromptModal.css';

const LocationPromptModal = ({ onModeSelect }) => {
  return (
    <div className="prompt-modal-overlay">
      <div className="prompt-modal-content">
        <h2>¿Dónde disfrutarás tus tacos?</h2>
        <div className="prompt-modal-buttons">
          <button 
            className="btn prompt-btn btn-online"
            onClick={() => onModeSelect('online')}
          >
            Pedido en Línea
          </button>
          <button 
            className="btn prompt-btn btn-local"
            onClick={() => onModeSelect('in-store')}
          >
            Estoy en el Local (Solo ver menú)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPromptModal;
