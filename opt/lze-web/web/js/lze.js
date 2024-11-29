const protocol = window.location.protocol === 'file:' ? '${protocol}' : window.location.protocol;
// notify
function notify(text) {
  const notify = document.createElement('div');
  notify.id = 'notify';
  const notifytext = document.createElement('span');
  notifytext.id = 'notifytext';
  notifytext.innerText = text;
  notify.appendChild(notifytext);
  notify.classList.add("main");
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
// 加载页
const loadpage=document.createElement('div');
const loadloop=document.createElement('div');
loadpage.id='load-page';
loadloop.id='load-loop';
function pageloading(status) {
  switch (status) {
      case 1:
          if (!document.getElementById('load-page')) {
              loadpage.appendChild(loadloop);
              document.body.appendChild(loadpage);
          }
          break;
      case 0:
          const existingLoadPage = document.getElementById('load-page');
          if (existingLoadPage) {
              document.body.removeChild(existingLoadPage);
          }
          break;
  }
}
