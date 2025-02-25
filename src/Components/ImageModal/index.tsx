import React, { useEffect, useRef } from 'react';
import './ImageModal.scss';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        modalRef.current?.classList.add('show');
      }, 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    modalRef.current?.classList.remove('show');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      ref={modalRef}
      className="image-modal"
      onClick={handleClose}
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <span className="close" onClick={handleClose}>
        &times;
      </span>
      <div
        ref={contentRef}
        className="image-modal-content"
        onClick={(e) => e.stopPropagation()}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
