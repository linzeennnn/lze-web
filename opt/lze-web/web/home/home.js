// notify
function notify(text) {
  const notify = document.createElement('div');
  notify.id = 'notify';
  const notifytext = document.createElement('span');
  notifytext.id = 'notifytext';
  notifytext.innerText = text;
  notify.appendChild(notifytext);
  document.body.appendChild(notify);
  setTimeout(function () {
    notify.style.opacity = '1';
    notify.style.top='5px';
  }, 10);
  setTimeout(function () {
    notify.style.opacity = '';
    setTimeout(function () {
      document.body.removeChild(notify);
    }, 1000);
  }, 1000);
}
// 锁屏
function lock(status){
  const live2d=document.getElementById('live2d-widget');
  switch(status){
    case 0:
      lockmove(0);
      dockmove(1);
      widgetmove(1);
      break;
    case 1:       
    live2d.style.display='';   
    lockmove(1);
    dockmove(0); 
    widgetmove(0);
      break;
  }
}
function dockmove(status){
  const dock=document.getElementById('dock');
  switch(status){
    case 1:
      dock.style.display='flex';
      setTimeout(() => {     
      dock.style.bottom='20px'  
        }, 500);
      break;
    case 0:       
    dock.style.bottom='';
      setTimeout(() => {  
        dock.style.display='';
        }, 500);
      break;
  }
}
function widgetmove(status){
  const widget=document.getElementById('widget-box');
  switch(status){
    case 1:
      widget.style.display='flex';
      setTimeout(() => {     
        widget.style.opacity='1';
        widget.style.transform='scale(1)';
        }, 500);
      break;
    case 0:       
    widget.style.opacity='';
    widget.style.transform='';
      setTimeout(() => {  
        widget.style.display='';
        }, 500);
      break;
  }
}
function lockmove(status){
  const live2d=document.getElementById('live2d-widget');
  const homebar=document.getElementById('home-bar');
  const btn=document.getElementById('home-btn');
  const page=document.getElementById('lock-page');
  switch(status){
    case 0:
      page.style.opacity='0';
      homebar.style.top='';
      live2d.style.top='';
      btn.style.top='';
      live2d.style.opacity='0'
      setTimeout(() => {       
      live2d.style.display='none';   
      homebar.style.display='none';
      btn.style.display='none';
      page.style.display='';
        }, 500);
      break;
    case 1:       
    page.style.display='block';
    homebar.style.display='';
    btn.style.display='';
    live2d.style.display='';  
      setTimeout(() => {  
        live2d.style.top='40px'
        btn.style.top='500px';
        live2d.style.opacity=''
        homebar.style.top='0';
        page.style.opacity='';
        }, 50);
      break;
  }
}
function comin(){
  color = localStorage.getItem('color');
  setcolor(color);
  if (document.referrer && document.referrer.split('#')[0] !== window.location.href.split('#')[0]) {
    dockmove(1);
    widgetmove(1);
    lock(0);
} else {
    lock(1);
}
    document.querySelector(`.name`).style.width='200px';
    document.addEventListener('click', handleDocumentClick);
    access();
    widget("all");
doc_path = `web/doc/doc.html#${ip}`;
pic_path = `web/pic/pic.html#${ip}`;
mon_path = `web/mon/monitor.html#${ip}`;
tra_path = `web/tra/tra.html#${ip}`; 
not_path = `web/not/not.html#${ip}`;
bok_path = `web/bok/bok.html#${ip}`;
ter_path = `web/ter/ter.html#${ip}`; 
};
window.onload = comin;
document.addEventListener('DOMContentLoaded', loadLayout);
function getip() {
return window.location.hash.substring(1); 
}
document.addEventListener('touchmove', function(event) {
禁用水平滑动
if (event.scaleX !== 1) {
event.preventDefault();
}
}, { passive: false });
$(function() {
var isMobile = /Mobi|Android/i.test(navigator.userAgent);

if (isMobile) {
    // 对于移动设备，使用长按事件来显示 tooltip
    var tooltipTrigger = $(".tooltip-trigger");
    var tooltip = $('<div class="tooltip"></div>').appendTo('body');
    var timeout;

    tooltipTrigger.on("touchstart", function(event) {
        timeout = setTimeout(function() {
            var content = tooltipTrigger.attr("title");
            tooltip.text(content).fadeIn(200);
            tooltip.css({
                left: event.originalEvent.touches[0].pageX + 10 + "px",
                top: event.originalEvent.touches[0].pageY + 10 + "px"
            });
        }, 500); // 长按持续时间 (500ms)
    }).on("touchend", function() {
        clearTimeout(timeout);
        tooltip.fadeOut(200);
    });

    $(document).on("touchstart", function(event) {
        if (!tooltipTrigger.is(event.target)) {
            tooltip.fadeOut(200);
        }
    });

} else {
    // 对于桌面设备，使用 jQuery UI 的 tooltip
    $(document).tooltip({
        track: true, // 跟随鼠标移动
        show: { effect: "blind", duration: 200, delay: 250 },
        position: {
            my: "left+15 top+15", // Tooltip 的位置点
            at: "left bottom"     // 目标元素的位置点
        }
    });
}
});

function reloadPage() {
if(logstatus=='1'){
location.hash = `#${ip}`;
} 
location.reload();
}


function tonext(path,widget,place,line) {
  widgetopen(path,widget);
setTimeout(() => {
window.location.replace(path);
}, 300);
}
// 打开widget
function widgetopen(path,widget){
  const icon =widget.querySelector('div');
  const widgetback = window.getComputedStyle(widget).backgroundColor; 
  const iconback=window.getComputedStyle(icon).backgroundImage;
  const rect = widget.getBoundingClientRect();
  const open = document.createElement('div');
  const openicon = document.createElement('div');
  open.classList.add('widget-open');
  open.style.backgroundColor=widgetback;
  openicon.style.backgroundImage=iconback;
open.style.width = (rect.width+"px"); 
open.style.height = (rect.height+"px");
open.style.top = (rect.top+"px");
open.style.left = (rect.left+"px");
open.appendChild(openicon);
document.body.appendChild(open);
setTimeout(() => {
  open.style.top=("50%");
  open.style.left=("50%");
  open.style.transform = 'translate(-50%, -50%) scale(10)';
  open.style.opacity='0';

  open.styletransform=("translate(-50%, -50%)");
  }, 10);
}
function handleTopBarButtonClick(index) {
  var buttons = document.querySelectorAll('#topBar button');
  buttons.forEach(function (button, i) {
    button.classList.remove('selected');
    if (i === index) {
      button.classList.add('selected');
    }
  });

  var additionalPopups = document.querySelectorAll('.additionalPopup');
  additionalPopups.forEach(function (popup, i) {
    if (i === index) {
      popup.classList.add('active');
    } else {
      popup.classList.remove('active', 'return');
    }
  });
}

function handleDocumentClick(event) {
  var buttons = document.querySelectorAll('#topBar button');
  var isButtonClick = false;

  buttons.forEach(function (button) {
    if (button.contains(event.target)) {
      isButtonClick = true;
    }
  });

  if (!isButtonClick) {
    buttons.forEach(function (button) {
      button.classList.remove('selected');
    });

    // 隐藏所有的框
    var additionalPopups = document.querySelectorAll('.additionalPopup');
    additionalPopups.forEach(function (popup) {
      popup.classList.remove('active', 'return');
    });
  }
}
// 鼠标拖拽
const dockback = document.querySelectorAll('.dock-back'); // 使用类选择器
const dock = document.getElementById('dock');
const widgetLines = document.querySelectorAll('.widget-line');
const line3=document.getElementById('widget-line3');
let dragmove = null;
let space = null;

// 为 widgetLines 和 dock 添加事件监听器
widgetLines.forEach(line => {
  line.addEventListener('dragstart', dragstart);
  line.addEventListener('dragover', dragover); 
  line.addEventListener('drop', drop);
});
dock.addEventListener('dragstart', dragstart);
dock.addEventListener('dragenter', dragenter);
dock.addEventListener('dragover', dragover); 
dock.addEventListener('drop', drop);
document.addEventListener('dragover', dragover); 
document.addEventListener('drop', drop);
function dragover(e) {
  e.preventDefault(); // 允许放置
}

function enterline(e) {
  e.preventDefault();  
  if (space == null) {
    space = document.createElement('div');
    space.classList.add('widget');
    space.style.opacity = '0';
    e.target.insertAdjacentElement('afterend', space);
  }
}

function leaveline(e) {
  e.preventDefault();  
  space.remove();
}

function dragstart(e) {
  const drag = e.target;
  e.dataTransfer.setData('text', e.target.id);
  e.target.style.opacity = 0;

  const icon = drag.querySelector('div');
  const iconback = getComputedStyle(icon).backgroundImage;
  const dragback = getComputedStyle(drag).backgroundColor;
  
  dragmove = document.createElement('div');
  dragmove.style.backgroundImage = iconback;
  if (dragback != "rgba(0, 0, 0, 0)") {
    dragmove.style.backgroundColor = dragback;
  }
  dragmove.classList.add('preview');
  document.body.appendChild(dragmove);
  
  e.dataTransfer.setDragImage(dragmove, 50, 50);
}

function mousemove(e) {
  if (dragmove) {
    dragmove.style.left = (e.clientX - dragmove.offsetWidth / 2) + 'px';
    dragmove.style.top = (e.clientY - dragmove.offsetHeight / 2) + 'px';
  }
}

function dragenter(e) {
  e.preventDefault();  
  if (e.target == dock) {
    dock.style.transform = 'scale(1.2)';
    dragmove.style.width = '64px';
    dragmove.style.height = '64px';
  } else {
    dock.style.transform = '';
    if (dragmove) {
      dragmove.style.width = '';
      dragmove.style.height = '';
    }
  }
}

function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  const draggedElement = document.getElementById(data);
  
  dock.style.transform = '';
  draggedElement.style.opacity = '';
  if(dragmove){
  document.body.removeChild(dragmove);
  }
dragmove=null;
  if (e.target.classList.contains('widget-line') || e.target.classList.contains('widget')) {
    if (e.target.classList.contains('widget')) {
      const parentLine = e.target.parentElement;
      parentLine.insertBefore(draggedElement, e.target);
    } else {
      e.target.appendChild(draggedElement);
    }
    draggedElement.classList.remove('dock-back');
    draggedElement.classList.add('widget');
  } else if (e.target === dock || e.target === dockback) {
    if(dock.offsetWidth<= document.body.offsetWidth+64){
    dock.appendChild(draggedElement);
    draggedElement.classList.remove('widget');
    draggedElement.classList.add('dock-back');
    }
    else{
      line3.appendChild(draggedElement);
      draggedElement.classList.remove('dock-back');
      draggedElement.classList.add('widget');
    }
  } else if (e.target !== dock && !e.target.classList.contains('widget-line')) {
    line3.appendChild(draggedElement);
    draggedElement.classList.remove('widget');
    draggedElement.classList.add('dock-back');
  }
  saveLayout();
}
// cat
let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      let cat = document.getElementById('live2dcanvas');
      if (cat) {
          // 先移除可能已经绑定的监听器
          cat.removeEventListener('click', catHandler); 
          // 然后再绑定监听器
          cat.addEventListener('click', catHandler);
          observer.disconnect(); // 找到元素后停止观察
      }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

function catHandler(){
  let random = Math.floor(Math.random() * 4); // 生成 0 到 3 的随机整数
  switch(random) {
      case 0:
          notify("人生何处不青山");
          break;
      case 1:
          notify("linzeen是大天才");
          break;
      case 2:
          notify("哈哈哈哈哈哈哈哈哈");
          break;
      case 3:
          notify("LZE web");
          break;
      default:
          console.log("林泽恩");
          break;
  }
}
