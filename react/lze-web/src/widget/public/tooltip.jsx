import { useEffect, useRef, useState } from "react";

const Tooltip = () => {
  const tooltipRef = useRef(null);
  const [activeElement, setActiveElement] = useState(null);
  const lastMoveTime = useRef(0);
  const MOUSE_UPDATE_INTERVAL = 50;

  // 获取提示内容
  const handleTooltipContent = (element) => {
    if (element.hasAttribute("title") && element.hasAttribute("tip-title")) {
      const title = element.getAttribute("title");
      element.setAttribute("tip-title", title);
      element.removeAttribute("title");
      return title;
    }
    if (element.hasAttribute("title") && !element.hasAttribute("tip-title")) {
      const title = element.getAttribute("title");
      element.setAttribute("tip-title", title);
      element.removeAttribute("title");
      return title;
    }
    if (element.hasAttribute("tip-title")) {
      return element.getAttribute("tip-title");
    }
    return "";
  };

  useEffect(() => {
    const tooltip = tooltipRef.current;

    const onMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveTime.current < MOUSE_UPDATE_INTERVAL) return;
      lastMoveTime.current = now;

      const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
      const target = hoverElement?.closest("[title], [tip-title]");

      if (!target) {
        if (activeElement) {
          tooltip.style.opacity = "0";
          setActiveElement(null);
        }
        return;
      }

      const winPad = 15;
      const mousePad = 20;
      const tooltipWidth = tooltip.offsetWidth || 200;
      const tooltipHeight = tooltip.offsetHeight || 40;

      let left = e.clientX + mousePad;
      let top = e.clientY + mousePad;

      if (left + tooltipWidth > window.innerWidth - winPad) {
        left = e.clientX - tooltipWidth - mousePad;
      }
      if (top + tooltipHeight > window.innerHeight - winPad) {
        top = e.clientY - tooltipHeight - mousePad;
      }

      tooltip.style.left = `${Math.max(winPad, Math.min(left, window.innerWidth - tooltipWidth - winPad))}px`;
      tooltip.style.top = `${Math.max(winPad, Math.min(top, window.innerHeight - tooltipHeight - winPad))}px`;

      if (activeElement !== target) {
        const content = handleTooltipContent(target);
        setActiveElement(target);
        if (content) {
          tooltip.textContent = content;
          tooltip.style.opacity = "1";
        } else {
          tooltip.style.opacity = "0";
        }
      }
    };

    const onMouseOver = (e) => {
      if (!e.target.closest("[tip-title]") && activeElement) {
        tooltip.style.opacity = "0";
        setActiveElement(null);
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.removedNodes.length &&
          activeElement &&
          !document.contains(activeElement)
        ) {
          tooltip.style.opacity = "0";
          setActiveElement(null);
        }
      });
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      observer.disconnect();
    };
  }, [activeElement]);

  return (
    <div
      ref={tooltipRef}
      className="tooltip"
      style={{
        position: "fixed",
        pointerEvents: "none",
        opacity: 0,
        zIndex: 9999,
      }}
    />
  );
};
export default Tooltip