function send_pass(user, pass) {
    if (user !== "lze" && user !== "admin") {
        notify("游客登陆");
        return;
    }

    const data = {
        name: user,
        password: pass
    };

    fetch(`${protocol}//${ip}/server/login/login.cgi`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 401) {
            notify("密码错误");
            throw new Error("Unauthorized"); 
        }
        return response.json();
    })
    .then(data => {
        notify("已登陆");
        localStorage.setItem("user", user);
        localStorage.setItem("token", data.token);
        reloadPage();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
function log_out() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    notify("已登出");
    reloadPage()
}
    function loginwindow(){
        const loginBox = document.createElement('div');
        loginBox.id = 'login-box';
        
        const logTitBox = document.createElement('div');
        logTitBox.classList.add('log-tit-box');
        
        const ipBox = document.createElement('div');
        ipBox.id = 'ip-box';
        ipBox.classList.add('log-switch-box');
        const ipIcon = document.createElement('div');
        ipIcon.id = 'ip-icon';
        ipIcon.classList.add('log-switch-icon');
        const ipBar = document.createElement('span');
        ipBar.id = 'ip-bar';
        ipBar.classList.add('log-switch-span');
        ipBar.title = '切换主机';
        ipBar.textContent = '127.0.0.1';
        
        const userBox = document.createElement('div');
        userBox.id = 'user-box';
        userBox.classList.add('log-switch-box');
        
        const userIcon = document.createElement('div');
        userIcon.id = 'user-icon';
        userIcon.classList.add('log-switch-icon');
        
        const userName = document.createElement('span');
        userName.id = 'user-name';
        userName.classList.add('log-switch-span');
        userName.title = '切换用户';
        userName.textContent = user;
        const logoutbtn=document.createElement('div');
        logoutbtn.id="logout";
        logoutbtn.title="退出登陆";
        logoutbtn.onclick=function(){
            if(confirm("确定退出登陆吗")){
            log_out();
            }
        }
        logTitBox.appendChild(ipBox);
        ipBox.appendChild(ipIcon);
        ipBox.appendChild(ipBar);
        logTitBox.appendChild(userBox);
        userBox.appendChild(userIcon);
        userBox.appendChild(userName);
        logTitBox.appendChild(logoutbtn);
        const loginOptBox = document.createElement('div');
        loginOptBox.id = 'login-opt-box';
        
        const ipInputBox = document.createElement('div');
        ipInputBox.id = 'ip-input-box';
        ipInputBox.classList.add('log-box');
        
        const ipInput = document.createElement('input');
        ipInput.type = 'text';
        ipInput.placeholder = '输入主机名';
        ipInput.classList.add('login-input');
        ipInput.id = 'ip-input';
        
        const ipSend = document.createElement('div');
        ipSend.id = 'ip-send';
        ipSend.classList.add('log-btn');
        ipSend.title = '链接ip';
        
        const sendIcon = document.createElement('div');
        sendIcon.classList.add('send-icon');
        
        ipSend.appendChild(sendIcon);
        ipInputBox.appendChild(ipInput);
        ipInputBox.appendChild(ipSend);
        
        const loginInputBox = document.createElement('div');
        loginInputBox.id = 'login-input-box';
        loginInputBox.classList.add('log-box');
        
        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = '用户名';
        userInput.classList.add('login-input');
        userInput.id = 'user-input';
        
        const passInput = document.createElement('input');
        passInput.type = 'password';
        passInput.placeholder = '密码';
        passInput.classList.add('login-input');
        passInput.id = 'pass-input';
        
        const loginSend = document.createElement('div');
        loginSend.id = 'login-send';
        loginSend.classList.add('log-btn');
        loginSend.title = '登陆';
        loginSend.onclick=function(){
            send_pass(userInput.value,passInput.value);
        }
        ipBox.onclick=function(){
            loginOptBox.innerHTML='';
            loginOptBox.appendChild(ipInputBox);
        }
        userBox.onclick=function(){
            loginOptBox.innerHTML='';
            loginOptBox.appendChild(loginInputBox);
        }
        loginSend.appendChild(sendIcon.cloneNode());
        loginInputBox.appendChild(userInput);
        loginInputBox.appendChild(passInput);
        loginInputBox.appendChild(loginSend);
        loginBox.appendChild(logTitBox);
        loginBox.appendChild(loginOptBox);
    newwindow(loginBox, 1)
    }
  