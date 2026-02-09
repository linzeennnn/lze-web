import { useEffect, useRef, useState } from "react";
import { GetText } from "../../utils/common";
import { Icon } from "../../utils/icon";
import "../../css/common/floatWin.css";

export default function FloatWin({
  children,
  start = () => {},
  end = () => {},
  show,
  setShow,
}) {
  const startedRef = useRef(false);
  const winRef = useRef(null);
  const [fullScreen,setFullScreen]=useState(false)
  /* 生命周期 */
  useEffect(() => {
    if (show) {
      if (!startedRef.current) {
        start();
        startedRef.current = true;
      }
    } else {
      if (startedRef.current) {
        end();
        startedRef.current = false;
      }
    }
  }, [show, start, end]);

  useEffect(() => {
    return () => {
      if (startedRef.current) {
        end();
        startedRef.current = false;
      }
    };
  }, [end]);

  /* 拖动窗口 */
  useEffect(() => {
    if (!show) return;
    const win = winRef.current;
    const bar = document.getElementById("float-win-top-bar");
    if (!win || !bar) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const down = (e) => {
      dragging = true;
      const r = win.getBoundingClientRect();
      offsetX = e.clientX - r.left;
      offsetY = e.clientY - r.top;
    };

    const move = (e) => {
      if (!dragging) return;
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      const maxX = window.innerWidth - win.offsetWidth;
      const maxY = window.innerHeight - win.offsetHeight;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      win.style.left = x + "px";
      win.style.top = y + "px";
    };

    const up = () => (dragging = false);

    bar.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      bar.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [show]);

  /* 8方向缩放 */
  useEffect(() => {
    if (!show) return;
    const win = winRef.current;
    if (!win) return;

    const handles = win.querySelectorAll(".resize-handle");

    let resizing = false;
    let dir = "";
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let startL = 0;
    let startT = 0;

    const MIN_W = 250;
    const MIN_H = 150;

    const down = (e) => {
      e.stopPropagation();
      resizing = true;
      dir = e.target.dataset.dir;

      const r = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startW = r.width;
      startH = r.height;
      startL = r.left;
      startT = r.top;
    };

    const move = (e) => {
      if (!resizing) return;

      let dx = e.clientX - startX;
      let dy = e.clientY - startY;

      let newW = startW;
      let newH = startH;
      let newL = startL;
      let newT = startT;

      if (dir.includes("r")) newW = startW + dx;
      if (dir.includes("l")) {
        newW = startW - dx;
        newL = startL + dx;
      }
      if (dir.includes("b")) newH = startH + dy;
      if (dir.includes("t")) {
        newH = startH - dy;
        newT = startT + dy;
      }

      /* 最小尺寸限制 */
      if (newW < MIN_W) {
        if (dir.includes("l")) newL -= MIN_W - newW;
        newW = MIN_W;
      }
      if (newH < MIN_H) {
        if (dir.includes("t")) newT -= MIN_H - newH;
        newH = MIN_H;
      }

      /* 屏幕边界限制 */
      newL = Math.max(0, newL);
      newT = Math.max(0, newT);
      newW = Math.min(window.innerWidth - newL, newW);
      newH = Math.min(window.innerHeight - newT, newH);

      win.style.width = newW + "px";
      win.style.height = newH + "px";
      win.style.left = newL + "px";
      win.style.top = newT + "px";
    };

    const up = () => (resizing = false);

    handles.forEach((h) => h.addEventListener("mousedown", down));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      handles.forEach((h) => h.removeEventListener("mousedown", down));
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="bg-enable">
      <div className={"float-win "+(fullScreen?"full-screen":"")} ref={winRef}>
        <div id="float-win-top-bar">
          <button
            className="btn float-btn"
            title={GetText("close")}
            onClick={() => setShow(false)}
          >{Icon("no")}
          </button>
          <button className="btn float-btn" title={GetText("zoom_in")}
          onClick={() => setFullScreen(!fullScreen)}
          >{Icon("circle")}</button>
        </div>

        {children}

        {/* 8个缩放手柄 */}
        <div className="resize-handle t" data-dir="t" />
        <div className="resize-handle b" data-dir="b" />
        <div className="resize-handle l" data-dir="l" />
        <div className="resize-handle r" data-dir="r" />
        <div className="resize-handle tl" data-dir="tl" />
        <div className="resize-handle tr" data-dir="tr" />
        <div className="resize-handle bl" data-dir="bl" />
        <div className="resize-handle br" data-dir="br" />
      </div>
    </div>
  );
}
