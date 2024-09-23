const protocol = window.location.protocol === 'file:' ? '${protocol}' : window.location.protocol;
// tool tip
$(function() {
  var isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
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
// reload
function reloadPage() {
    location.reload();
  }
//   totop
function totop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth' // 添加平滑滚动效果
    });
  }
// get ip
 function getip() {
    return window.location.hash.substring(1); 
}
ip = getip();
token =localStorage.getItem(`authToken_${ip}`)
// login status
function loginstatus(){
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
}
// desktop notify
async function desktopnot(title, content, fileName, finalFilePath){
  const data = new URLSearchParams();
  data.append('title', title);
  data.append('content', content);
  data.append('fileName', fileName);
  data.append('finalFilePath', finalFilePath);

  try {
      const response = await fetch(`${protocol}//${ip}/code/notify/notify.php`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data.toString()
      });
  } catch (error) {
      console.error('Fetch error:', error);
  }
}

