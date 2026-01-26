// 禁用缩放
export default function DisableZoom(){
   document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });}