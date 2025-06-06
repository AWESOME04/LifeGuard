import { useRef, useEffect } from 'react';
import { FaKeyboard, FaTimes } from 'react-icons/fa';
import { KEYBOARD_SHORTCUTS } from '../../utils/keyboardShortcuts';
import { KeyboardShortcut } from '../../types/common.types';
import './KeyboardShortcutsHelp.css';

interface KeyboardShortcutsHelpProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const KeyboardShortcutsHelp = ({ isVisible, onClose, isDarkMode }: KeyboardShortcutsHelpProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? '⌘' : 'Ctrl';

  const getKeyDisplay = (shortcut: KeyboardShortcut): string => {
    if (shortcut.withModifier) {
      return `${modifierKey} + ${shortcut.key.toUpperCase()}`;
    }

    if (shortcut.key === '/') {
      return '/';
    }

    return shortcut.key;
  };

  return (
    <div className={`keyboard-shortcuts-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      <div
        ref={modalRef}
        className="keyboard-shortcuts-modal"
        role="dialog"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <div className="keyboard-shortcuts-header">
          <h2 id="keyboard-shortcuts-title">
            <FaKeyboard /> Keyboard Shortcuts
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close keyboard shortcuts">
            <FaTimes />
          </button>
        </div>

        <div className="keyboard-shortcuts-content">
          <ul className="shortcuts-list">
            {Object.values(KEYBOARD_SHORTCUTS).map((shortcut: KeyboardShortcut) => (
              <li key={shortcut.key} className="shortcut-item">
                <span className="shortcut-key">{getKeyDisplay(shortcut)}</span>
                <span className="shortcut-description">{shortcut.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="keyboard-shortcuts-footer">
          <p>
            Press <strong>?</strong> to toggle this help screen or <strong>Esc</strong> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
