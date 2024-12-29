import React from 'react';

const BoardControls = ({ boardSize, setBoardSize, onFileUpload }) => {
  return (
    <div className="board-controls">
      <div className="size-controls">
        <button
          className={boardSize === 'square' ? 'active' : ''}
          onClick={() => setBoardSize('square')}
        >
          Square
        </button>
        <button
          className={boardSize === 'landscape' ? 'active' : ''}
          onClick={() => setBoardSize('landscape')}
        >
          Landscape
        </button>
        <button
          className={boardSize === 'portrait' ? 'active' : ''}
          onClick={() => setBoardSize('portrait')}
        >
          Portrait
        </button>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFileUpload}
      />
    </div>
  );
};

export default BoardControls; 