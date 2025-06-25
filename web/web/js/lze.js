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
