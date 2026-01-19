import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useMouseMenuStore } from "../../store/mouseMenu";

export default function MouseMenu() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [style, setStyle] = useState({});
  const menuRef = useRef(null);

  // 从 store 获取当前菜单项
  const menuOpt = useMouseMenuStore((state) => state.menuOpt);

  // 监听右键
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // 菜单渲染后，修正位置避免被挡住
  useLayoutEffect(() => {
    if (!visible || !menuRef.current) return;

    const menu = menuRef.current;
    const { innerWidth, innerHeight } = window;
    const rect = menu.getBoundingClientRect();

    let left = pos.x;
    let top = pos.y;

    if (pos.x + rect.width > innerWidth) {
      left = pos.x - rect.width;
    }
    if (pos.y + rect.height > innerHeight) {
      top = pos.y - rect.height;
    }

    left = Math.max(4, left);
    top = Math.max(4, top);

    setStyle({ left, top });
  }, [visible, pos, menuOpt]);

  if (!visible) return null;

  return (
    <div id="menu-back">
      <div
        id="mouse-menu"
        ref={menuRef}
        style={{
          ...style,}}
      >
        {Object.entries(menuOpt).map(([key, item]) => (
          <MenuItem key={key} onClick={() => item.fun && item.fun()}
            disabled={item.disable|| false}>
            {item.name}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}

function MenuItem({ children, onClick, disabled }) {
  return (
    <div
      className={"menu-item "+
        (disabled ? "menu-item-disabled" : "")
      }
      onClick={onClick}>
      {children}
    </div>
  );
}