// 创建主题页面
function themepage(){
let themePanel = document.createElement('div');
let lightBtn = document.createElement('div');
lightBtn.className = 'theme-list';
lightBtn.id = 'light-btn';
lightBtn.setAttribute('onclick', "theme('light',color)");
let lightIcon = document.createElement('div');
lightIcon.id = 'light-icon';
let lightText = document.createElement('span');
lightText.innerText = '亮模式';
lightBtn.appendChild(lightIcon);
lightBtn.appendChild(lightText);
let darkBtn = document.createElement('div');
darkBtn.className = 'theme-list';
darkBtn.id = 'dark-btn';
darkBtn.setAttribute('onclick', "theme('dark',color)");
let darkIcon = document.createElement('div');
darkIcon.id = 'dark-icon';
let darkText = document.createElement('span');
darkText.innerText = '暗模式';
darkBtn.appendChild(darkIcon);
darkBtn.appendChild(darkText);
let recoverTheme = document.createElement('div');
recoverTheme.className = 'theme-list';
recoverTheme.id = 'recover-theme';
recoverTheme.setAttribute('onclick', 'clearLayout()');
let oriTheme = document.createElement('div');
oriTheme.id = 'ori-theme';
let recoverText = document.createElement('span');
recoverText.innerText = '还原布局';
recoverTheme.appendChild(oriTheme);
recoverTheme.appendChild(recoverText);
let colorBar = document.createElement('div');
colorBar.id = 'color-bar';
let colors = ['default', 'green', 'blue', 'yellow', 'orange', 'pink', 'red'];
let colorNames = ['默认', '绿', '蓝', '黄', '橙', '粉', '红'];
colors.forEach((color, index) => {
    let colorDiv = document.createElement('div');
    colorDiv.id = color;
    colorDiv.className = 'color';
    colorDiv.title = colorNames[index];
    colorDiv.setAttribute('onclick', `theme(mode,'${color}')`);
    colorBar.appendChild(colorDiv);
});
themePanel.appendChild(lightBtn);
themePanel.appendChild(darkBtn);
themePanel.appendChild(recoverTheme);
themePanel.appendChild(colorBar);
newwindow(themePanel, 1)

}
// 正式函数
let sheetpath;
if(typeof ishome !== 'undefined' && ishome){
  sheetpath='web/home/'
}
else{
  sheetpath='./'
}
// 设置颜色
function setcolor(colortheme){
  let colbtn =document.querySelectorAll('.color');
  colbtn.forEach(colbtn => {
    colbtn.style.filter = '';
});
const listpage=document.querySelectorAll('.list-page');
    const phoneback=document.getElementById('phone-back');
    const dock=document.getElementById('dock');
      const btn=document.getElementById('home-btn');
    const bar=document.getElementById('home-bar');
    const widget=document.getElementById('theme-dis');
      if(colortheme=='default'||!colortheme){
        color="default";
        if (typeof ishome !== 'undefined' && ishome){
              bar.style.backgroundColor='';
              btn.style.backgroundColor='';
              dock.style.backgroundColor='';
              widget.style.backgroundColor=``;
              listpage.forEach(listpage=> {
              listpage.style.backgroundColor = '';
              });
              }
        colbtn=document.getElementById('default');
        phoneback.style.backgroundColor=``;
        document.body.style.backgroundColor=``;
        localStorage.removeItem(`color`);
      }
      else{
        color=colortheme;
        if(typeof ishome !== 'undefined' && ishome){
            bar.style.backgroundColor=`var(--${colortheme})`;
            btn.style.backgroundColor=`var(--${colortheme})`;
            dock.style.backgroundColor=`var(--${colortheme}-nor)`;
            widget.style.backgroundColor=`var(--${colortheme})`;
            listpage.forEach(listpage=> {
              listpage.style.backgroundColor = `var(--${colortheme}-page)`;
            });
              }
        phoneback.style.backgroundColor=`var(--${colortheme})`;
        document.body.style.backgroundColor=`var(--${colortheme})`;
      }
    }
// 设置亮暗
  function setmode(thememode) {
    const darkbtn=document.getElementById('dark-btn');
    const lightbtn=document.getElementById('light-btn');
    const themesheet = document.getElementById('themesheet');
    switch (thememode) {
        case 'dark':
          mode=thememode;
          themesheet.href = `${sheetpath}dark.css`;
            break;
        case 'light':
          mode=thememode;
          themesheet.href = `${sheetpath}light.css`;
            break;
        default:
          mode="dark";
          themesheet.href = `${sheetpath}dark.css`;
    }
  }
  // 存储主题设置
  function theme(newmode,newcolor){
    if (typeof ishome !== 'undefined' && ishome){
      localStorage.setItem(`color`, newcolor);
    }
    localStorage.setItem('mode', newmode);
    setmode(newmode);
    setcolor(newcolor);
    document.querySelector('meta[name="theme-color"]').setAttribute('content',metacolor[newmode][newcolor]);
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.themeColor) {
      window.webkit.messageHandlers.themeColor.postMessage(metaThemeColor.content);
  }
  }
 
// 恢复初始布局
function clearLayout() {
  localStorage.removeItem('layout');
  loadLayout();
  notify("已恢复初始布局");
  if (typeof ishome !== 'undefined' && ishome){
    reloadPage();
  }
}
// 保存布局
function saveLayout() {
  const layout = {
    dock: [],
    widgetLines: {}
  };
  dock.querySelectorAll('.dock-back').forEach(item => {
    layout.dock.push(item.id);
  });
  widgetLines.forEach((line, index) => {
    layout.widgetLines[index] = [];
    line.querySelectorAll('.widget').forEach(item => {
      layout.widgetLines[index].push(item.id);
    });
  });


  localStorage.setItem('layout', JSON.stringify(layout));
}
// 恢复布局
function loadLayout() {
  const savedLayout = localStorage.getItem('layout');
  if (savedLayout) {
    let layout = JSON.parse(savedLayout);


    // 清理 dock 中不存在的元素
    layout.dock = layout.dock.filter(id => {
      const item = document.getElementById(id);
      if (item) { 
        dock.appendChild(item);
        item.classList.add('dock-back');
        item.classList.remove('widget');
        return true;
      }
      return false;
    });


    // 清理 widgetLines 中不存在的元素
    widgetLines.forEach((line, index) => {
      layout.widgetLines[index] = layout.widgetLines[index].filter(id => {
        const item = document.getElementById(id);
        if (item) { 
          line.appendChild(item);
          item.classList.add('widget');
          item.classList.remove('dock-back');
          return true; // 元素存在，保留在 layout.widgetLines 中
        }
        return false; // 元素不存在，移除
      });
    });


    // 将更新后的布局重新保存到 localStorage
    localStorage.setItem('layout', JSON.stringify(layout));
  }
}