// 添加提示框样式（确保提示框不拦截鼠标事件）
const style = document.createElement('style');
document.head.appendChild(style);

// 创建提示框元素
const tooltip = document.createElement("div");
tooltip.classList.add("tooltip");
document.body.appendChild(tooltip);

// 当前激活提示框的元素引用
let activeElement = null;

// 优化：添加防抖减少计算次数
let lastMoveTime = 0;
const MOUSE_UPDATE_INTERVAL = 50; // 毫秒

// 处理元素的提示文本逻辑
const handleTooltipContent = (element) => {
    // 新增：如果同时有tip-title和title，优先使用title
    if (element.hasAttribute("title") && element.hasAttribute("tip-title")) {
        const titleValue = element.getAttribute("title");
        element.setAttribute("tip-title", titleValue);
        element.removeAttribute("title");
        return titleValue;
    }
    // 迁移title到tip-title
    if (element.hasAttribute("title") && !element.hasAttribute("tip-title")) {
        const titleValue = element.getAttribute("title");
        element.setAttribute("tip-title", titleValue);
        element.removeAttribute("title");
        return titleValue;
    }
    // 使用现有的tip-title
    if (element.hasAttribute("tip-title")) {
        return element.getAttribute("tip-title");
    }
    return "";
};

document.addEventListener("mousemove", t => {
    const now = Date.now();
    if (now - lastMoveTime < MOUSE_UPDATE_INTERVAL) return;
    lastMoveTime = now;

    // 实时获取鼠标下方的元素
    const hoverElement = document.elementFromPoint(t.clientX, t.clientY);
    const target = hoverElement?.closest("[title], [tip-title]");
    
    // 核心修复：如果元素不存在/被移除，立即隐藏提示框
    if (!target) {
        if (activeElement) {
            tooltip.style.opacity = "0";
            activeElement = null;
        }
        return;
    }
    
    // 更新提示框位置（始终显示在鼠标右下方）
    const winPad = 15; // 窗口边距
    const mousePad = 20; // 鼠标偏移
    const tooltipWidth = tooltip.offsetWidth || 200; // 默认宽度
    const tooltipHeight = tooltip.offsetHeight || 40; // 默认高度
    
    let left = t.clientX + mousePad;
    let top = t.clientY + mousePad;
    
    // 防止超出右边界
    if (left + tooltipWidth > window.innerWidth - winPad) {
        left = t.clientX - tooltipWidth - mousePad;
    }
    
    // 防止超出下边界
    if (top + tooltipHeight > window.innerHeight - winPad) {
        top = t.clientY - tooltipHeight - mousePad;
    }
    
    // 确保位置在可视区域内
    tooltip.style.left = `${Math.max(winPad, Math.min(left, window.innerWidth - tooltipWidth - winPad))}px`;
    tooltip.style.top = `${Math.max(winPad, Math.min(top, window.innerHeight - tooltipHeight - winPad))}px`;
    
    // 仅当悬停新元素时更新内容
    if (activeElement !== target) {
        activeElement = target;
        
        // 处理提示文本内容
        const content = handleTooltipContent(target);
        if (content) {
            tooltip.textContent = content;
            tooltip.style.opacity = "1";
        } else {
            tooltip.style.opacity = "0";
        }
    }
});

// 全局检测：当鼠标移到无提示元素上时隐藏
document.addEventListener("mouseover", t => {
    if (!t.target.closest("[tip-title]") && activeElement) {
        tooltip.style.opacity = "0";
        activeElement = null;
    }
});

// 额外安全措施：当元素被移除时隐藏提示框
new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.removedNodes.length && activeElement && 
            !document.contains(activeElement)) {
            tooltip.style.opacity = "0";
            activeElement = null;
        }
    });
}).observe(document.body, { childList: true, subtree: true });