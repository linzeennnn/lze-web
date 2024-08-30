let wallpath;
let metaThemeColor = document.querySelector('meta[name="theme-color"]');
const darkbtn=document.getElementById('dark-btn');
const lightbtn=document.getElementById('light-btn');
document.addEventListener('DOMContentLoaded', () => {
    // 检查 localStorage 是否有保存的主题，如果没有，则设置为默认主题
    const savedTheme = localStorage.getItem('theme') || 'dark';
    switchTheme(savedTheme);
  });
  
  function switchTheme(theme) {
    const themesheet = document.getElementById('themesheet');
    // 根据传入的主题更新 CSS 文件路径
    switch (theme) {
        case 'dark':
          themesheet.href = 'web/home/dark.css';
          darkbtn.style.display='none';
          lightbtn.style.display='block';
          wallpath=`wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', darkcolor);
            break;
        case 'light':
          themesheet.href = 'web/home/light.css';
          darkbtn.style.display='block';
          lightbtn.style.display='none';
          wallpath=`wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', lightcolor);
            break;
        default:
          themesheet.href = 'web/home/dark.css';
          darkbtn.style.display='none';
          lightbtn.style.display='block';
          wallpath=`wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', darkcolor);
    }
    
    // 保存选择的主题到 localStorage
    localStorage.setItem('theme', theme);
  }