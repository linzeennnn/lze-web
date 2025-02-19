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
loginBtn.onclick = () => loginwindow();
loginBtn.innerHTML = '<div id="login"></div><span class="side-text">登陆</span>';

// 创建主题按钮
const themebtn = document.createElement('div');
themebtn.className = 'side-btn';
themebtn.id = 'theme-btn';
themebtn.title = '主题布局';
themebtn.onclick = () => showtheme(1);
themebtn.innerHTML = '<div id="theme"></div><span class="side-text">主题</span>';
// 监视器
const sysbtn = document.createElement('div');
sysbtn.className = 'side-btn';
sysbtn.title = '系统监视器';
sysbtn.onclick = () => getsystem(1);
sysbtn.innerHTML = '<div id="system"></div><span class="side-text">系统</span>';

// 将按钮添加到容器中
sideBox.appendChild(loginBtn);
sideBox.appendChild(themebtn);
sideBox.appendChild(sysbtn);

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