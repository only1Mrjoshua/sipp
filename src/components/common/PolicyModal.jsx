import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

const PolicyModal = ({ isOpen, onClose, title, content }) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-strong overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-background-light rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="prose prose-sm max-w-none text-text-secondary">
                {content}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-border-light px-6 py-4 flex justify-end">
              <Button variant="primary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PolicyModal;