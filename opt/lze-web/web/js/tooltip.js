 // tool tip
 let tooltip = null;
 let titvalue = '';
 let tooltipVisible = false;
 
 document.addEventListener('mouseenter', function(event) {
   const target = event.target;
 
   if (target.nodeType === Node.ELEMENT_NODE) {
     const title = target.getAttribute('title');
     if (title) {
       titvalue = title;
       target.removeAttribute('title');
       showtooltip(title, event);
     }
   }
 }, true);
 
 document.addEventListener('mouseleave', function(event) {
   const target = event.target;
 
   if (target.nodeType === Node.ELEMENT_NODE && tooltip) {
     const tooltipRect = tooltip.getBoundingClientRect();
     const mouseX = event.clientX;
     const mouseY = event.clientY;
 
     // 检查鼠标是否仍在 tooltip 上
     if (!(mouseX >= tooltipRect.left && mouseX <= tooltipRect.right &&
           mouseY >= tooltipRect.top && mouseY <= tooltipRect.bottom)) {
       // 延迟恢复 title
       tooltipVisible = false;
       setTimeout(() => {
         if (!tooltipVisible) {
           removetooltip(target);
         }
       }, 200); // 延迟时间可以根据需要调整
     }
   }
 }, true);

 