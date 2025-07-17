import { useEffect } from 'react';

export function WinBg({ showBg, children }) {
  useEffect(() => {
    if (showBg) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // 清理
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showBg]);

  return (
    <div className={showBg ? 'bg-enable' : 'bg-disable'}>
      {children}
    </div>
  );
}
