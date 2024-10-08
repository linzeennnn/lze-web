darkcolor='#1f2324';
lightcolor='#969fa2';
let doc_path;
let pic_path;
let mon_path;
let not_path;
let bok_path;
let tra_path;
const protocol = window.location.protocol === 'file:' ? '${protocol}' : window.location.protocol;

// notify
function notify(text) {
  const notify = document.createElement('div');
  notify.id = 'notify';
  const notifytext = document.createElement('span');
  notifytext.id = 'notifytext';
  notifytext.innerText = text;
  notify.appendChild(notifytext);
  document.body.appendChild(notify);
  notify.style.opacity = '1';
  setTimeout(function () {
    notify.style.opacity = '';
    setTimeout(function () {
      document.body.removeChild(notify);
    }, 1500);
  }, 1500);
}
// 锁屏
function lock(status){
  const lockpage=document.getElementById('lock-page');
  const live2d=document.getElementById('live2d-widget');
  switch(status){
    case 0:
      lockmove(0);
      dockmove(1);
      widgetmove(1);
      break;
    case 1:       
    lockpage.style.display='';
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
  const lockpage=document.getElementById('lock-page');
  const live2d=document.getElementById('live2d-widget');
  const btn=document.getElementById('home-btn');
  switch(status){
    case 0:
      lockpage.style.top='';
      live2d.style.top='';
      btn.style.top='';
      lockpage.style.opacity='0';
      live2d.style.opacity='0'
      lockpage.style.bottom='auto';
      setTimeout(() => {       
      lockpage.style.display='';
      live2d.style.display='none';   
        }, 500);
      break;
    case 1:       
    lockpage.style.display='flex';
    live2d.style.display='';  
      setTimeout(() => {  
        lockpage.style.top='0';
        live2d.style.top='200px'
        btn.style.top='500px';
        lockpage.style.opacity='';
        live2d.style.opacity=''
        lockpage.style.bottom='';
        }, 500);
      break;
  }
}
function comin(){
  console.log(document.referrer.split('#')[0]);
  console.log();
  if (document.referrer && document.referrer.split('#')[0] !== window.location.href.split('#')[0]) {
    dockmove(1);
    widgetmove(1);
} else {
    lock(1);
}
    document.querySelector(`.name`).style.width='200px';
    document.addEventListener('click', handleDocumentClick);
    access();
doc_path = `web/doc/doc.html#${ip}`;
pic_path = `web/pic/pic.html#${ip}`;
mon_path = `web/mon/monitor.html#${ip}`;
tra_path = `web/tra/tra.html#${ip}`; 
not_path = `web/not/not.html#${ip}`;
bok_path = `web/bok/bok.html#${ip}`;
ter_path = `web/ter/ter.html#${ip}`; 
};
window.onload = comin;
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
  widgetopen(path,widget,place,line);
document.getElementById(`home-bar`).style.top = '-150px';
document.querySelector('.next').style.opacity ='1';
setTimeout(() => {
window.location.replace(path);
}, 300);
}
// 打开widget
function widgetopen(path,widget,place,line){
  const title= widget.querySelector('.widget-title');
  const clone = widget.cloneNode(true);
  const linebox=document.getElementById(line);
  widget.style.position='absolute'
  switch(place){
    case 1:
      linebox.appendChild(clone);
  break;
  case 0:
    linebox.insertBefore(clone,linebox.firstChild);
    break;
  }
  widget.style.transform='scale(7)';
  widget.style.opacity='0.5';
  title.innerText='';
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
const dockback = document.querySelectorAll('dock-back');
const dock = document.getElementById('dock');
const widgetLines = document.querySelectorAll('.widget-line');
const line3 = document.getElementById('widget-line3');

document.addEventListener('drop', handleDropCombined);
document.addEventListener('dragstart', handleDragStart);
document.addEventListener('dragover', handleDragOver);

widgetLines.forEach(line => {
    line.addEventListener('dragover', handleDragOver);
    line.addEventListener('drop', handleDropCombined);
});

dock.addEventListener('dragover', handleDragOver);
dock.addEventListener('drop', handleDropCombined);
dock.addEventListener('mouseleave', function() {
    dock.style.transform = '';
});

function handleDragStart(e) {
  const drag=e.target;
    e.dataTransfer.setData('text', e.target.id);
    e.target.style.opacity = 0.5;

    // 设置原生拖拽图像
    e.dataTransfer.setDragImage(e.target, 32, 32); // 这里的偏移量可以根据需要调整
}

function handleDragOver(e) {
    e.preventDefault();
    if (e.target == dock) {
        dock.style.transform = 'scale(1.2)';
    } else {
        dock.style.transform = '';
    }
}

function handleDropCombined(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const draggedElement = document.getElementById(data);
    dock.style.transform = '';
    draggedElement.style.opacity = 1;

    if (e.target.classList.contains('widget-line') || e.target.classList.contains('widget')) {
        if (e.target.classList.contains('widget')) {
            const parentLine = e.target.parentElement;
            parentLine.insertBefore(draggedElement, e.target);
        } else {
            e.target.appendChild(draggedElement);
        }
        draggedElement.classList.remove('dock-back');
        draggedElement.classList.add('widget');
    } else if (e.target == dock || e.target == dockback) {
        dock.appendChild(draggedElement);
        draggedElement.classList.remove('widget');
        draggedElement.classList.add('dock-back');
    } else if (!e.target.classList.contains('widget-line') && !e.target.classList.contains('widget') && e.target != dock) {
        line3.appendChild(draggedElement);
        draggedElement.classList.remove('widget');
        draggedElement.classList.add('dock-back');
    }
}
