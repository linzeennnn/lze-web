const loginpage=document.getElementById('login-page');
const passbar=document.getElementById('pass-bar');
const hostbar=document.getElementById('host-bar');
const hostbox=document.getElementById('host-box');
let password;
let ip;
let logstatus;
let passtatus;
const login=document.getElementById('login');
const root = document.documentElement;
let token;
let enterpass = null; 
let enterip = null; 
 // 初始化数据
 const defaulthost = {
    host: [
    ]
};
creatlist();
function showlogin(status){
    ipstatus();
    if(logstatus==0 && status!=0){
        status=1;
    }
    else if(logstatus==1 && passtatus==0 && status!=0){
        status=2
    }
    switch(status){
        case 1:
            if (enterpass) {
                document.removeEventListener('keydown', enterpass); 
            }
            enterip = function(event) {
                enter(1, event);
            };
            document.addEventListener('keydown', enterip);
            notify("输入主机");
            loginpage.style.display='flex';
            passbar.style.opacity='';
            hostbar.style.display='flex';
            hostbox.style.display='flex';
            backlogin.style.display='block';
            setTimeout(function () { 
            loginpage.style.opacity='1';
            hostbar.style.opacity='1';
            hostbox.style.opacity='1';
            passbar.style.display='';
            backlogin.style.opacity='1';
            }, 10);
            break;
        case 2: 
        if (enterip) {
            document.removeEventListener('keydown', enterip);
        }
        enterpass = function(event) {
            enter(2, event);
        };
        document.addEventListener('keydown', enterpass);
            notify("输入密码");
            hostbar.style.opacity='';
            hostbox.style.opacity='';
        loginpage.style.display='flex';
        passbar.style.display='flex';
        backlogin.style.display='block';
            setTimeout(function () { 
            hostbar.style.display='';
            hostbox.style.display='';
            loginpage.style.opacity='1';
            passbar.style.opacity='1';
            backlogin.style.opacity='1';
            }, 10);
            break;
        case 3:
            notify("已登陆");
            loginpage.style.display='flex';
            hostbar.style.display='';
            passbar.style.display='';
            hostbox.style.display='';
            backlogin.style.display='block';
            setTimeout(function () { 
            loginpage.style.opacity='1';
            hostbar.style.opacity='';
            hostbox.style.opacity='';
            passbar.style.opacity='';
            backlogin.style.opacity='1';
            }, 10);
            break;
         case 4:
                reloadPage();
                break;
        case 0:
            loginpage.style.opacity='';
            passbar.style.opacity='';
            hostbar.style.opacity='';
            hostbox.style.display='';
            backlogin.style.opacity='';
        setTimeout(function () { 
            loginpage.style.display='';
            passbar.style.display='';
            hostbox.style.opacity='';
            hostbar.style.display='';
            backlogin.style.display='';
              }, 1000);
           break;

    }
   
}
// 回车事件
function enter(status,event){
    switch(status){
        case 1:
            if (event.key === 'Enter') {
                console.log("ip");
                addhost();
            }
            break;
        case 2:
            if (event.key === 'Enter') {
                console.log("pass");
                sendpass();
            }
            break;
    }
    enterevent=1;
}
// access
function access(){
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
function sendpass() {
    const password = btoa(document.getElementById('password').value);

    fetch(`${protocol}//${ip}/code/auth/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 使用 IP 作为 key 存储 token
            localStorage.setItem(`authToken_${ip}`, data.token);
            reloadPage();
        } else {
            notify("验证失败: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout(){
    localStorage.removeItem(`authToken_${ip}`);
        notify("已登出");
        reloadPage();
}
function checklogin(status) {
   token =localStorage.getItem(`authToken_${ip}`)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${protocol}//${ip}/code/auth/check.php`, true); // 替换为你的 PHP 文件路径

    // 设置 Authorization 头部
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    // 处理响应
    xhr.onreadystatechange = function() {
        try {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    passtatus = 1;
                    if (status == 0) {
                        showlogin(0);
                    } else if (status == 1) {
                        showlogin(4);
                    }
                } else {
                    passtatus = 0;
                    loginicon();
                    showlogin(2);
                }
            }
        } 
        catch (error) {
            console.log(error);
            notify(error);
        }
    };

    xhr.send();
}







function loginicon(){
    root.style.setProperty('--login', 'url(../../icon/nologin_grey.svg)');
    root.style.setProperty('--loginhover', 'url(../../icon/nologin_white.svg)');
}
function xmlnologin(xml){
    if (xml.status=== 401) { 
        loginicon();
        checklogin();
    }
}
function xmltoken(xml){
    if (token) {
        xml.setRequestHeader('Authorization', `Bearer ${token}`);
    }
}
function fetchtoken(){
    return{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    }
}
function fetchnologin(response){
    if (response.status === 401) {
        loginicon();
        checklogin();
      } 
}
// switch ip
function switchip(){
    logstatus=0;
    showlogin(1);
}

// check ip
function connect(){
    ip =document.getElementById('ip-input').value;
    logstatus ='1';
    checklogin(1);
    }
// local window ip login
function local(){
    ip = window.location.hostname;
    logstatus ='1';
    } 


// 从 localStorage 中获取数据
function gethost() {
    const hostlist = localStorage.getItem('host');
    return hostlist ? JSON.parse(hostlist) : defaulthost;
}

// 保存数据到 localStorage
function savehost(hostlist) {
    localStorage.setItem('host', JSON.stringify(hostlist));
}

// 清空所有数据
function clearData() {
    if (confirm('确定要清空所有数据吗？')) {
        localStorage.removeItem('host');
        creatlist();
    }
}

// 渲染 IP 列表
function creatlist() {
    const data = gethost();
    const ipList = document.getElementById('ipList');
    ipList.innerHTML = '';
    data.host.forEach((savehost, index) => {
        const hostbtn = document.createElement('li');
        hostbtn.className = 'host-btn';
        hostbtn.innerHTML = `${savehost} <button class="removehost" onclick="deletehost(${index})"></button>`;
        hostbtn.addEventListener('click', function() {
         ip = savehost; // 这里我们直接用savehost的值
         logstatus=1;
         checklogin(1);
        });
        ipList.appendChild(hostbtn);
    });
}

// 添加 IP 地址
function addhost() {
    logstatus=0;
    const ipinput = document.getElementById('ip-input');
    const hostname = ipinput.value.trim();
    if (hostname) {
        const data = gethost();
        if (!data.host.includes(hostname)) {
            data.host.push(hostname);
            savehost(data);
            creatlist();
        } 
        connect();
        ipinput.value = '';
    } else {
        alert('请输入一个有效的 IP 地址。');
    }
}

// 删除 IP 地址
function deletehost(index) {
    const data = gethost();
    data.host.splice(index, 1);
    savehost(data);
    creatlist();
}

// ipstatus
function ipstatus(){
    document.getElementById('ip-status').innerText=ip;
    if (typeof ishome !== 'undefined' && ishome){
    document.getElementById('ip-li').innerText=ip;
    }
    }