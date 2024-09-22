document.body.innerHTML += `
<div id="login-bar"></div>
<div id="login-page">
  <div id="ip-status" title="已连接"></div>
  <div id="log-tool">
    <div id="reconnect" title="切换ip" onclick="switchip()"></div>
    <div id="logout" onclick="logout()" title="退出登陆"></div>
    <div id="clear-btn" onclick="clearData()"></div>
  </div>
</div>
<div id="pass-bar" class="login-box">
  <input id="password" contenteditable="true" class="login-input" placeholder="password" type="password"></input>
  <div id="send-pass" title="连接" class="login-btn" onclick="sendpass()"></div>
</div>
<div id="backlogin" onclick="showlogin(0)"></div>
<div id="hostlist-bar"></div>
<div id="host-bar" class="login-box">
  <input type="text" id="ip-input" class="login-input" placeholder="输入 IP 地址">
  <div onclick="addhost()" class="login-btn" id="addhost"></div>
</div>
<div id="host-box">
  <div id="ipList"></div>
</div>
<div class="phone_background">
  <div class="fixed"></div>
  <div class="next"></div>
</div>
`;
