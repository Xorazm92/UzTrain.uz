import React, { useContext, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { store } from '../../App';
import './AppWindow.scss';

interface AppWindowProps {
  appId: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({
  appId,
  title,
  icon,
  children,
  defaultWidth = 900,
  defaultHeight = 600,
  defaultX = 100,
  defaultY = 50,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  const [state, dispatch] = useContext(store);
  const isWindowMinimized = state[`${appId}Window`]?.minimized;

  // If minimized, do not render (or render hidden if animation needed)
  if (isWindowMinimized) return null;
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [prevSize, setPrevSize] = useState({ width: defaultWidth, height: defaultHeight });
  const nodeRef = useRef(null);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: `${appId}/CLOSE` });
    onClose?.();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: `${appId}/MINI` });
    onMinimize?.();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMaximized) {
      setSize(prevSize);
      setIsMaximized(false);
    } else {
      setPrevSize(size);
      setSize({ width: window.innerWidth - 20, height: window.innerHeight - 80 });
      setIsMaximized(true);
    }
    onMaximize?.();
  };

  const handleFocus = () => {
    dispatch({ type: `${appId}/Z-SELECT` });
  };

  return (
    <Draggable
      handle=".app-window-header"
      nodeRef={nodeRef}
      defaultPosition={{ x: defaultX, y: defaultY }}
      disabled={isMaximized}
    >
      <div
        ref={nodeRef}
        className={`app-window ${isMaximized ? 'maximized' : ''}`}
        style={{
          width: isMaximized ? '100vw' : size.width,
          height: isMaximized ? 'calc(100vh - 60px)' : size.height,
          left: isMaximized ? 0 : undefined,
          top: isMaximized ? 28 : undefined,
        }}
        onClick={handleFocus}
      >
        <div className="app-window-header">
          <div className="window-controls">
            <button className="control-btn close" onClick={handleClose}>
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="control-btn minimize" onClick={handleMinimize}>
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="control-btn maximize" onClick={handleMaximize}>
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path d="M3 3L6 1L9 3M3 9L6 11L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="window-title">
            {icon && <img src={icon} alt={title} className="window-icon" />}
            <span>{title}</span>
          </div>
          <div className="window-spacer" />
        </div>
        <div className="app-window-content">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default AppWindow;
