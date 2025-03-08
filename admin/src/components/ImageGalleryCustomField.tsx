import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// A sortable item that renders an image preview and a remove button.
const SortableItem = ({
  id,
  image,
  onRemove,
}: {
  id: string;
  image: any;
  onRemove: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '4px',
    background: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={image.url}
        alt="preview"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
      <div>
        <button type="button" onClick={() => onRemove(id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

interface ImageGalleryCustomFieldProps {
  name: string;
  value: any[];
  onChange: (value: any[]) => void;
}

const ImageGalleryCustomField: React.FC<ImageGalleryCustomFieldProps> = ({
  name,
  value,
  onChange,
}) => {
  // Keep local state; if no value is set, default to an empty array.
  const [images, setImages] = useState<any[]>(value || []);

  // Handle file upload, create a preview URL, and add the image object to state.
  const handleFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const newImages = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange(updatedImages);
  };

  // Remove an image by its id.
  const handleRemove = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  // Update ordering when drag ends.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const newImages = arrayMove(images, oldIndex, newIndex);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFilesUpload} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.id)}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {images.map((image) => (
              <SortableItem key={image.id} id={image.id} image={image} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImageGalleryCustomField;
