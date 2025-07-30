// notify.js
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// 内部通知组件
function Notify({ message, duration = 1000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => setVisible(false), duration);
    const removeTimer = setTimeout(() => onClose(), duration + 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`notify ${visible ? 'notify-show' : ''}`}>
      <span className="notify-text">{message}</span>
    </div>
  );
}

// 全局调用接口
export function notify(text, duration = 1000) {
  const container = document.createElement('div');
  const app = document.getElementById('app');
  app.appendChild(container);

  const root = createRoot(container);

  const cleanup = () => {
    root.unmount();
    app.removeChild(container);
  };

  root.render(<Notify message={text} duration={duration} onClose={cleanup} />);
}
