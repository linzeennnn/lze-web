const createLoginPage = () => {
    const loginPage = document.createElement('div');
    loginPage.id = 'login-page';
  
    const loginList = document.createElement('div');
    loginList.id = 'login-list';
  
    const backLogin = document.createElement('div');
    backLogin.id = 'backlogin';
    backLogin.title = '关闭页面';
    backLogin.onclick = () => showlogin(0);
  
    const loginBar = document.createElement('div');
    loginBar.id = 'login-bar';
  
    const ipStatus = document.createElement('div');
    ipStatus.id = 'ip-status';
    ipStatus.title = '已连接';
  
    const logTool = document.createElement('div');
    logTool.id = 'log-tool';
  
    const reconnect = document.createElement('div');
    reconnect.id = 'reconnect';
    reconnect.title = '切换ip';
    reconnect.onclick = () => switchip();
  
    const logoutBtn = document.createElement('div');
    logoutBtn.id = 'logout';
    logoutBtn.title = '退出登陆';
    logoutBtn.onclick = () => logout();
  
    const clearBtn = document.createElement('div');
    clearBtn.id = 'clear-btn';
    clearBtn.onclick = () => clearData();
  
    const passBar = document.createElement('div');
    passBar.id = 'pass-bar';
    passBar.className = 'login-box';
  
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.contentEditable = 'true';
    passwordInput.className = 'login-input';
    passwordInput.placeholder = 'password';
    passwordInput.type = 'password';
  
    const sendPass = document.createElement('div');
    sendPass.id = 'send-pass';
    sendPass.title = '连接';
    sendPass.className = 'login-btn';
    sendPass.onclick = () => sendpass();
  
    passBar.appendChild(passwordInput);
    passBar.appendChild(sendPass);
  
    const hostlistBar = document.createElement('div');
    hostlistBar.id = 'hostlist-bar';
  
    const hostBar = document.createElement('div');
    hostBar.id = 'host-bar';
    hostBar.className = 'login-box';
  
    const ipInput = document.createElement('input');
    ipInput.type = 'text';
    ipInput.id = 'ip-input';
    ipInput.className = 'login-input';
    ipInput.placeholder = '输入 IP 地址';
  
    const addHostBtn = document.createElement('div');
    addHostBtn.id = 'addhost';
    addHostBtn.className = 'login-btn';
    addHostBtn.onclick = () => addhost();
  
    hostBar.appendChild(ipInput);
    hostBar.appendChild(addHostBtn);
  
    const hostBox = document.createElement('div');
    hostBox.id = 'host-box';
  
    const ipList = document.createElement('div');
    ipList.id = 'ipList';
  
    hostBox.appendChild(ipList);
  
    logTool.appendChild(reconnect);
    logTool.appendChild(logoutBtn);
    logTool.appendChild(clearBtn);
    logTool.appendChild(passBar);
    logTool.appendChild(hostlistBar);
    logTool.appendChild(hostBar);
  
    loginList.appendChild(backLogin);
    loginList.appendChild(loginBar);
    loginList.appendChild(ipStatus);
    loginList.appendChild(logTool);
    loginList.appendChild(passBar);
    loginList.appendChild(hostlistBar);
    loginList.appendChild(hostBar);
    loginList.appendChild(hostBox);
  
    loginPage.appendChild(loginList);
  
    document.body.appendChild(loginPage);
  };
  
  createLoginPage();
  