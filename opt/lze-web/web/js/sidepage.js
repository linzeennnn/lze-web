function creatsidepage(){
const sidePage = document.createElement('div');
sidePage.id = 'sidepage';
const closeside =document.createElement('div');
closeside.id='closeside'
closeside.onclick = () => openside();
// 创建顶部元素
const sideTop = document.createElement('div');
sideTop.id = 'side-top';

// 创建按钮容器
const sideBox = document.createElement('div');
sideBox.id = 'side-box';

// 创建登陆按钮
const loginBtn = document.createElement('div');
loginBtn.className = 'side-btn';
loginBtn.title = '登陆';
loginBtn.onclick = () => showlogin(3);
loginBtn.innerHTML = '<div id="login"></div><span class="side-text">登陆</span>';

// 创建暗主题按钮
const darkBtn = document.createElement('div');
darkBtn.className = 'side-btn';
darkBtn.id = 'dark-btn';
darkBtn.title = '切换暗主题';
darkBtn.style.display = 'none';
darkBtn.onclick = () => switchTheme('dark');
darkBtn.innerHTML = '<div id="dark"></div><span class="side-text">主题</span>';

// 创建亮主题按钮
const lightBtn = document.createElement('div');
lightBtn.className = 'side-btn';
lightBtn.id = 'light-btn';
lightBtn.title = '切换亮主题';
lightBtn.onclick = () => switchTheme('light');
lightBtn.innerHTML = '<div id="light"></div><span class="side-text">主题</span>';

// 将按钮添加到容器中
sideBox.appendChild(loginBtn);
sideBox.appendChild(darkBtn);
sideBox.appendChild(lightBtn);

// 将各部分添加到侧边页面
sidePage.appendChild(closeside);
sidePage.appendChild(sideTop);
sidePage.appendChild(sideBox);
sidePage.appendChild(document.createElement('div')); // side-bottom
sidePage.appendChild(document.createElement('div')); // blur-page

// 创建模糊页面元素
const blurPage = document.createElement('div');
blurPage.id = 'blur-page';
blurPage.onclick = () => openside();

// 添加侧边页面和模糊页面到文档中
document.body.appendChild(sidePage);
document.body.appendChild(blurPage);
}
creatsidepage();
// 函数部分
const sidepage=document.getElementById('sidepage');
const blurpage=document.getElementById('blur-page');
function openside(status){
    if (status==1){
    document.body.style.overflow = 'hidden';
    sidepage.style.display='flex';
    setTimeout(() => {
        sidepage.style.left='0';
        blurpage.style.display='block';
    }, 10); 
}
else {
    sidepage.style.left='';
    blurpage.style.display='';
    setTimeout(() => {
        document.body.style.overflow = '';
        sidepage.style.display='';
    }, 1000); 
}
}