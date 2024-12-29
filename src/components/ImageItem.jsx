import React from 'react';
import { Rnd } from 'react-rnd';
import '../styles/ImageItem.css';

const ImageItem = ({ image, onPositionChange, onPropertiesChange }) => {
  return (
    <Rnd
      default={{
        x: image.position.x,
        y: image.position.y,
        width: 200,
        height: 200,
      }}
      onDragStop={(e, d) => {
        onPositionChange({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onPropertiesChange({
          scale: ref.style.width / 200, // assuming 200 is base width
          position
        });
      }}
      style={{
        transform: `rotate(${image.rotation}deg)`,
      }}
    >
      <div className="image-container">
        <img
          src={image.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div className="image-controls">
          <button
            onClick={() => onPropertiesChange({
              rotation: (image.rotation + 90) % 360
            })}
          >
            Rotate
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default ImageItem; 