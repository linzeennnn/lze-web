darkcolor='#1f2324';
lightcolor='#969fa2';
let doc_path;
let pic_path;
let mon_path;
let not_path;
let bok_path;
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
  switch(status){
    case 0:
      lockpage.style.top='-200px';
      live2d.style.top='-300px';
      lockpage.style.opacity='0';
      live2d.style.opacity='0'
      lockpage.style.bottom='auto';
      setTimeout(() => {       
      lockpage.style.display='none';
      live2d.style.display='none';   
        }, 500);
      break;
    case 1:       
    lockpage.style.display='';
    live2d.style.display='';  
      setTimeout(() => {  
        lockpage.style.top='';
        live2d.style.top=''
        lockpage.style.opacity='';
        live2d.style.opacity=''
        lockpage.style.bottom='';
        }, 500);
      break;
  }
}
function comin(){
  const lockpage=document.getElementById('lock-page');
  const live2d=document.getElementById('live2d-widget');
  lockpage.style.display='none';
  live2d.style.display='none';
  if (document.referrer) {
    dockmove(1);
    widgetmove(1);
} else {
    lock(1);
}
    document.getElementById(`home-bar`).style.top = '0';
    document.querySelector(`.name`).style.width='200px';
    access();
    document.addEventListener('click', handleDocumentClick);
doc_path = `web/doc/doc.html#${ip}`;
pic_path = `web/pic/pic.html#${ip}`;
mon_path = `web/mon/monitor.html#${ip}`;
not_path = `web/not/not.html#${ip}`;
bok_path = `web/bok/bok.html#${ip}`;
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
  widget.style.opacity='0';
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

