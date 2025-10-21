import React from 'react';

const GalleryGrid = ({ images = [] }) => {
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image) => (
        <div key={image} className="relative overflow-hidden rounded-3xl border border-white/10">
          <img src={image} alt="profile gallery" className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
