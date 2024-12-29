import React from 'react';
import ImageItem from './ImageItem';
import '../styles/MoodBoard.css';

const MoodBoard = ({ images, setImages, boardSize }) => {
  const updateImagePosition = (id, newPosition) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, position: newPosition } : img
      )
    );
  };

  const updateImageProperties = (id, properties) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, ...properties } : img
      )
    );
  };

  return (
    <div className={`mood-board ${boardSize}`}>
      {images.map(image => (
        <ImageItem
          key={image.id}
          image={image}
          onPositionChange={(newPos) => updateImagePosition(image.id, newPos)}
          onPropertiesChange={(props) => updateImageProperties(image.id, props)}
        />
      ))}
    </div>
  );
};

export default MoodBoard; 