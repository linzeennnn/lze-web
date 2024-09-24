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


function comin(){
var button = document.getElementById('myButton');
    document.getElementById(`home-bar`).style.top = '0';
    document.querySelector(`.name`).style.width='200px';
document.getElementById('myButton').style.bottom='35%';
    // 添加点击页面任意地方的事件监听器
    document.addEventListener('click', handleDocumentClick);

  
if(!getip()){
  ip = window.location.hostname;
  }
  else {
  ip =getip();
  }
  // 本地打开html
  if(ip==''){
    logstatus=0;
    showlogin(1);
  }else if(ip!=''){
    logstatus=1;
    checklogin(0); 
  }
ipstatus();
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


function tonext(bodyback,path,bar_type) {
  buttonState = 2;
handleButtonClick();
document.getElementById(`home-bar`).style.top = '-150px';
document.getElementById('myButton').style.display = `none`;
document.querySelector('body').style.backgroundImage = `url(${wallpath}${bodyback})`;
document.querySelector('.next').style.backgroundImage = `url(${wallpath}${bodyback})`;
document.querySelector('.next').style.opacity ='1';
setTimeout(() => {
window.location.replace(path);
}, 1000); // 1000 毫秒 = 1 秒
}





var buttonState = 1; // 初始状态为1

function handleButtonClick() {
var button = document.getElementById('myButton');
var popup = document.getElementById('customPopup');

if (buttonState === 1) {
popup.classList.add('active');
button.style.bottom = '60%'; // 降落到页面正中心
buttonState = 2; // 更新状态为2
} else {
popup.classList.remove('active');
button.style.bottom = '35%'; // 升回标题底部
buttonState = 1; // 更新状态为1
// 隐藏所有的框
var additionalPopups = document.querySelectorAll('.additionalPopup');
additionalPopups.forEach(function (popup) {
  popup.classList.remove('active', 'return'); // 移除所有类
});
}
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

