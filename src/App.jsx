import React, { useState } from 'react';
import MoodBoard from './components/MoodBoard';
import BoardControls from './components/BoardControls';

function App() {
  const [boardSize, setBoardSize] = useState('square'); // square, landscape, portrait
  const [images, setImages] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prevImages => [...prevImages, {
          id: Date.now() + Math.random(),
          src: e.target.result,
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: 1
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="app">
      <BoardControls 
        boardSize={boardSize} 
        setBoardSize={setBoardSize}
        onFileUpload={handleFileUpload}
      />
      <MoodBoard 
        images={images} 
        setImages={setImages}
        boardSize={boardSize}
      />
    </div>
  );
}

export default App; 