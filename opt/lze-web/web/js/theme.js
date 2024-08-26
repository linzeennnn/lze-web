let wallpath;
let metaThemeColor = document.querySelector('meta[name="theme-color"]');
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
          themesheet.href = 'dark.css';
          wallpath=`../../wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', darkcolor);
            break;
        case 'light':
          themesheet.href = 'light.css';
          wallpath=`../../wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', lightcolor);
            break;
        default:
          themesheet.href = 'dark.css';
          wallpath=`../../wallpaper/${theme}/`;
          metaThemeColor.setAttribute('content', darkcolor);
    }
    
    // 保存选择的主题到 localStorage
    localStorage.setItem('theme', theme);
  }
  