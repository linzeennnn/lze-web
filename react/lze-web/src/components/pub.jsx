// 禁用缩放
export function DisableZoom(){
   document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });}