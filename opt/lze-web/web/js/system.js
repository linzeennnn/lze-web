let diskspace,diskused,diskall;
let memspace,memused,memall;
let cpuValue, memValue, diskValue,netdownvalue,netupvalue;
let intervalId;
// 创建系统页面的主容器
const systemPage = document.createElement('div');
systemPage.id = 'system-page';
const closeSys = document.createElement('div');
closeSys.id = 'close-sys';
closeSys.onclick =  () => getsystem(0);
closeSys.title='关闭系统监视';
systemPage.appendChild(closeSys);
const systemBoxes = [
  { id: 'cpu', title: 'CPU' },
  { id: 'mem', title: '内存' },
  { id: 'disk', title: '磁盘' },
  { id: 'net', title: '网络' }
];
systemBoxes.forEach(box => {
  const sysBox = document.createElement('div');
  sysBox.className = 'sys-box';
  const sysIcon = document.createElement('div');
  sysIcon.id = box.id;
  sysIcon.className = 'sys-icon';
  sysIcon.setAttribute('title', box.title);
  const sysBar = document.createElement('div');
  sysBar.className = 'sys-bar';
  const sysProgress = document.createElement('div');
  sysProgress.className = 'sys-progress'; 
  const sysValue = document.createElement('span');
  const loading = document.createElement('div');
  loading.className = 'loading';
  sysValue.className = 'sys-value';
  netupvalue=document.createElement('span');
  netupvalue.className = 'sys-value';
  const netupicon=document.createElement('div');
  netupicon.className = 'sys-icon';
  netupicon.id = "netup-icon";
  netdownvalue=document.createElement('span');
  netdownvalue.className = 'sys-value';
  const netdownicon=document.createElement('div');
  netdownicon.className = 'sys-icon';
  netdownicon.id = "netdown-icon";
  switch(box.id){
    case "mem":
     memspace = document.createElement('span');
     memspace.classList.add('sys-space', 'sys-value');
     memspace.id = `${box.id}-used`;
      sysBox.appendChild(memspace);
      break;
    case "disk":
      diskspace = document.createElement('span');
      diskspace.classList.add('sys-space', 'sys-value');
      diskspace.id = `${box.id}-space`;
      sysBox.appendChild(diskspace);
      break;
  }
  sysBox.appendChild(sysIcon);
  systemPage.appendChild(sysBox);
  if(box.id != "net"){
  sysBar.appendChild(sysProgress);
  sysBox.appendChild(sysBar);
  sysBox.appendChild(sysValue);
  sysBox.appendChild(loading);
  }
 if(box.id == "net"){
  sysBox.appendChild(netupicon);
  sysBox.appendChild(netupvalue);
  sysBox.appendChild(netdownicon);
  sysBox.appendChild(netdownvalue);
  sysBox.appendChild(loading);
 }
document.body.appendChild(systemPage);
switch (box.id) {
  case 'cpu':
    cpuValue = sysValue;
    cpuProgress = sysProgress;
    break;
  case 'mem':
    memValue = sysValue;
    memProgress = sysProgress;
    break;
  case 'disk':
    diskValue = sysValue;
    diskProgress = sysProgress;
    break;
}
});
const loadsys=document.querySelectorAll('.sys-value');
const loading=document.querySelectorAll('.loading');
// loadsys.style.display='none';
// 监视系统
function getsystem(status){
    switch(status){
        case 1:
            systemPage.style.display='flex';
            setTimeout(() => {     
                systemPage.style.opacity='1';  
                  }, 10);
                  intervalId = setInterval(() => {
                    fetch(`${protocol}//${ip}/code/system/system.php`)
                        .then(response => response.json())
                        .then(data => {
                            cpuValue.textContent = data.cpuUsage + '%';
                            memValue.textContent=Math.floor((memused / memall) * 100) + '%';
                            diskValue.textContent=Math.floor((diskused / diskall) * 100) + '%';
                            memall = data.totalMemory;
                            memused = data.usedMemory;
                            memValue.textContent = Math.floor((data.usedMemory / data.totalMemory) * 100) + '%';
                            diskall = Math.floor(data.totalDisk / (1024 * 1024));
                            diskused = Math.floor(data.usedDisk / (1024 * 1024));
                            diskValue.textContent = Math.floor((data.usedDisk / data.totalDisk) * 100) + '%';
                            netdownvalue.textContent = data.networkRx + "MB/s";
                            netupvalue.textContent = data.networkTx + "MB/s";
                            cpuProgress.style.width = cpuValue.textContent;
                            memProgress.style.width = memValue.textContent;
                            diskProgress.style.width = diskValue.textContent;
                            memspace.textContent = memused + 'MB'+'/' + memall + 'MB';
                            diskspace.textContent = diskused + 'GB'+'/' + diskall + 'GB';
                            loading.forEach(loading => {
                              loading.style.display = 'none';
                          });
                            // loadsys.style.display='block';
                        })
                        .catch(error => console.error('Error fetching system info:', error));
                }, 4000); // 每 4 秒执行一次
            break;
        case 0:
          clearInterval(intervalId); 
            systemPage.style.opacity=''; 
            setTimeout(() => {      
                systemPage.style.display='';
                  }, 1000);
            break;
    }
}