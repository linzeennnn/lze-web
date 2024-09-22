 let darkcolor;
 let lightcolor
 darkcolor='#271f25';
 lightcolor='#966a85';
 let uploadpath;
 let nowpath="/";//当前目录（要上传的目录）
 let fullPath; 
 function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
          document.getElementById('top-btn').style.bottom = '90px';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.width = '70%';
          document.getElementById('top-bar').style.left = '10%';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('cover-bar').style.top = '0';
      document.getElementById('top-bar').style.backdropFilter = `none`;
      document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
          
        } else {
          document.getElementById('top-btn').style.bottom = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.querySelector('.backbtn').style.width = '';
          document.getElementById('top-bar').style.boxShadow = '';
          document.getElementById('top-bar').style.top = '77px';
          document.getElementById('top-bar').style.width = '80%';
          document.getElementById('top-bar').style.left = '';
          document.getElementById('top-bar').style.backgroundColor = '';
          document.getElementById('cover-bar').style.top = '';
          document.getElementById('top-bar').style.backdropFilter = ``;
          document.getElementById('top-bar').style.webkitBackdropFilter = ``;
         
        }
}

window.addEventListener('scroll', handleScroll);

  function comin(){
    // 初始加载根文件夹内容
  loadFolder();
      document.querySelector('.backbtn').style.left = '5%';
      document.getElementById('fileListContainer').style.right = `0`;
      document.getElementById('top-bar').style.top = `77px`;
      loginstatus();
    };
    window.onload = comin;
  function goBack() {
    window.removeEventListener('scroll',handleScroll);
    document.getElementById('cover-bar').style.top = `-80px`;
    document.querySelector('.backbtn').style.left = '-30%';
    document.getElementById('fileListContainer').style.right = `-100%`;
      document.getElementById('top-bar').style.top = `-60px`;
      document.getElementById('top-btn').style.bottom = `-5%`;
      document.querySelector('body').style.backgroundImage = `url(${wallpath}home.svg)`;
      document.querySelector('.next').style.backgroundImage = `url(${wallpath}home.svg)`;
    document.querySelector('.next').style.opacity ='1';  
    
    setTimeout(() => {
    window.location.replace(`../../index.html#${ip}`);
}, 1000); // 1000 毫秒 = 1 秒
  }
  function loading(status) {
   
    const fileInput = document.getElementById('uploadfile');
    const load = document.getElementById('loading');
    const loadbox = document.getElementById('rotate-box');
    const loadText = document.getElementById('load-text');
    const upbtn = document.getElementById('up-btn');
    const goupbtn = document.getElementById('upButton');
    const path = document.getElementById('currentPath');
    const cancel = document.getElementById('cancel');
    const progress = document.getElementById('progress');
    
    if (fileInput.files.length === 0) {
      notify("请先选择一个文件进行上传");
        return; // 没有选择文件，直接返回
    }
    if (status==1){
    path.style.display = 'none';
    upbtn.style.display = 'none';
    goupbtn.style.display = 'none';
    progress.style.display = 'block';
    load.style.display = 'block';
    cancel.style.display = 'block';
    loadbox.style.display = 'block';
    }
    else {
      path.style.display = '';
      upbtn.style.display = '';
      goupbtn.style.display = '';
      progress.style.display = 'none';
      load.style.display = 'none';
      cancel.style.display = 'none';
      loadbox.style.display = 'none';
    }
 
  }
  function cancelUpload() {
    reloadPage();
  }
  function pathlen(textid, text) {
    const barWidth = textid.offsetWidth;
    const tempElement = document.createElement('span');
    tempElement.style.visibility = 'hidden';
    tempElement.style.position = 'absolute';
    tempElement.style.font = window.getComputedStyle(textid).font;
    tempElement.innerText = '字';
    document.body.appendChild(tempElement);
    const charWidth = tempElement.offsetWidth;
    document.body.removeChild(tempElement);

    const maxLength = Math.floor(barWidth / (charWidth));
    let displayPath = text;

    if (text.length > maxLength && textid.id === 'currentPath') {
      displayPath = '...' + text.slice(-maxLength);  
    }
    else if(text.length > maxLength){
      displayPath = text.slice(0,maxLength) +'...' ; 
    }

    textid.innerText = displayPath;
  }
  function loadFolder(folder = '',status) {
    selectedarray.length = 0;
    fetch(`http://${ip}/code/Documents/doc_list.php?folder=` + folder, fetchtoken())
  .then(response => {
    fetchnologin(response)
    return response.json();
  })
      .then(data => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        const currentPath = document.getElementById('currentPath');
        if(status==1){
        fullPath = (data.currentFolder ? data.currentFolder : '');
        }
        else{
        fullPath = (data.currentFolder ? data.currentFolder : '')+'/';
        }
        pathlen(currentPath, fullPath);
        currentPath.title = fullPath;

        data.folders.forEach(folder => {
          const listItem = document.createElement('li');
          listItem.className = 'files';
          const folderLink = document.createElement('span');
          folderLink.textContent = folder + '/';
          folderLink.className = 'folderLink';
          listItem.addEventListener('click', function() {
            select(listItem,2);
          });
          folderLink.addEventListener('click', function () {
            event.stopPropagation(); 
            if(status==1){
              loadFolder(data.currentFolder ? data.currentFolder  + folder : folder);
            }
           else{
            loadFolder(data.currentFolder ? data.currentFolder + '/' + folder : folder);
           }
        });
          listItem.appendChild(folderLink);
          fileList.appendChild(listItem);
        });

        data.files.forEach(file => {
          const listItem = document.createElement('li');
          listItem.className = 'files';
          const fileLink = document.createElement('span');
          const Src = `http://${ip}/file/Documents/upload/` + (data.currentFolder ? data.currentFolder + '/' + file : file);
          const fileListContainer = document.getElementById('fileListContainer');
          fileLink.textContent = file;
          fileLink.className = 'fileLink';
          fileLink.title = `预览${file}`;
          listItem.addEventListener('click', function() {
            select(listItem,1);
          });
          fileLink.addEventListener('click', function () {
            event.stopPropagation(); 
            let filepath;
            nowpath = currentPath.innerText;
            let rootpath=`http://${ip}/file/Documents/upload/`;
            if (nowpath==="/"){
              filepath=rootpath + file;
            }
            else{
              filepath=rootpath + nowpath + file;
            }
            window.location.href = filepath;
          });

          listItem.appendChild(fileLink);

          const downloadLink = document.createElement('a');
          // 修改 downloadLink 的 href 指向 PHP 脚本而不是直接文件路径
          downloadLink.className = 'downloadLink';
          downloadLink.href = `http://${ip}/code/Documents/doc_download.php?file=${encodeURIComponent(file)}&folder=${encodeURIComponent(data.currentFolder || '')}`;
          downloadLink.title = `下载${file}`;
          downloadLink.textContent = `下载 ${file}`;
          downloadLink.addEventListener('click',()=>notify("开始下载"));

          listItem.appendChild(downloadLink);

          fileList.appendChild(listItem);
        });

        // 处理返回上级目录按钮
        const upButton = document.getElementById('upButton');
        if (data.currentFolder && data.currentFolder !== '') {
          upButton.style.display = 'block';
          upButton.style.opacity = '1';
          upButton.dataset.parentFolder = data.parentFolder;
          upButton.style.pointerEvents = 'auto';
        } else {
          upButton.style.pointerEvents = 'none';
          upButton.style.opacity = '0.5';
        }
      });
}

  function goUp() {
    const upButton = document.getElementById('upButton');
    const parentFolder = upButton.dataset.parentFolder;
    loadFolder(parentFolder);
  }

 
  function selfile() {
    nowpath = fullPath;  
    var files = document.getElementById('uploadfile').files;
    if (files.length === 0) {
        notify("请先选择文件");
        return;
    }
    loading(1);
    var chunkSize = 1024 * 1024; // 每个块的大小（1MB）
    var file = files[0];
    var totalChunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;

    function uploadChunk() {
        var start = currentChunk * chunkSize;
        var end = Math.min(start + chunkSize, file.size);
        var chunk = file.slice(start, end);

        var fd = new FormData();
        fd.append('file', chunk);
        fd.append('fileName', file.name);
        fd.append('totalChunks', totalChunks);
        fd.append('currentChunk', currentChunk);
        fd.append('nowpath', nowpath);  // 传递 nowpath 变量

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `http://${ip}/code/Documents/upload.php`, true);
        xmltoken(xhr);
        xhr.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
                var percent = ((currentChunk + ev.loaded / ev.total) / totalChunks) * 100;
                var percentElement = document.getElementById('percent');
                document.getElementById('bar').style.width = percent + '%';
                percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
            }
        };

        xhr.onload = function () {
            xmlnologin(xhr);
            if (xhr.status === 200) {
                currentChunk++;
                if (currentChunk < totalChunks) {
                    uploadChunk(); // 上传下一个块
                } else {
                    notify("上传成功");
                    uploadpath = xhr.responseText;
                    console.log(uploadpath);
                    loading(0);
                    loadFolder(nowpath,1);
                    desktopnot('恩的文件', '新上传文件:', `${file.name}`, uploadpath);
                }
            }
        };

        xhr.send(fd);
    }

    uploadChunk(); // 开始上传第一个块
}
// 新建文件夹
function newfolder(status){
  const pathbar=document.getElementById('path-bar');
  const namebar=document.getElementById('folder-name-bar');
  const comfirm=document.getElementById('comfirm');
  const cancelfolder=document.getElementById('cancel-folder');
  const upbtn=document.getElementById('upButton');
  const newfod=document.getElementById('add-folder');
  let folderName=namebar.value;
  switch (status){
    case 1:
  pathbar.style.display='none';
  namebar.style.display='block';
  comfirm.style.display='block'
  cancelfolder.style.display='block'
  upbtn.style.display='none';
  newfod.style.display='none';
  break;
  case 0:
    pathbar.style.display='';
    namebar.style.display='';
    comfirm.style.display=''
    cancelfolder.style.display=''
    upbtn.style.display='';
    newfod.style.display='';
    break;
    case 2:
      nowpath = fullPath;  
      console.log(nowpath)
    if (folderName===""){
      folderName="new_folder";
    }
    fetch(`http://${ip}/code/Documents/new_folder.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderName, nowpath })
  })
  .then(response => response.text())
  .then(data => {
      console.log(data);
      loadFolder(nowpath,1);
      namebar.value="";
      notify("新建:"+folderName)
  })
  .catch(error => {
      console.error('Error:', error);
  });
  newfolder(0);
    break;
  }
}
// 删除
function del(){
  if (confirm('确定要删除所选文件吗')) {
  nowpath = fullPath;  
const  dellist = JSON.stringify(selectedarray);

  // 创建一个对象，包含 copylist 和 nowpath
  const requestData = {
    dellist: dellist
  };
  fetch(`http://${ip}/code/Documents/delete.php`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
  })
  .then(response => response.json())
  .then(data => {
    loadFolder(nowpath,1);
    notify("已删除");
    selectedarray.length=0;
  })
  .catch((error) => {
    notify('错误:'+error);
  });
}
}

let pastestatus;
let copyarray=[];
// 复制
const pastebtn=document.getElementById('paste');
function copy(status){
copyarray.length=0;
if (selectedarray.length==0){
  notify("请选择文件");
pastebtn.style.display="none";
  return;
}
switch (status){
  case 1:
    pastestatus=1;
    break;
  case 0:
  pastestatus=0;
  break;
}
copyarray=selectedarray.slice();
pastebtn.style.display="block";
}
// 粘贴
let copylist;
function paste() {
  nowpath = fullPath;  
  copylist = JSON.stringify(copyarray);

  // 创建一个对象，包含 copylist 和 nowpath
  const requestData = {
    copylist: copylist,
    nowpath: nowpath
  };
switch (pastestatus){
  case 1:{
  fetch(`http://${ip}/code/Documents/copy.php`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
  })
  .then(response => response.json())
  .then(data => {
    loadFolder(nowpath,1);
    notify("已复制");
    pastebtn.style.display='none';
    copyarray.length=0;
  })
  .catch((error) => {
    console.error('错误:', error);
  });}
  break;
  case 0:{
    fetch(`http://${ip}/code/Documents/move.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
    })
    .then(response => response.json())
    .then(data => {
      loadFolder(nowpath,1);
      notify("已移动");
      pastebtn.style.display='none';
      copyarray.length=0;
    })
    .catch((error) => {
      console.error('错误:', error);
    });
  }
  break;
}
  
}

// 选中
let filesname;
let selectedpath;
let selectedarray = [];
let index;
let selectcount;
function select(fileitem,type){
  switch (type){
    case 1:
     filesname=fileitem.querySelector('.fileLink');
    break;
    case 2:
       filesname=fileitem.querySelector('.folderLink');
      break;
  }
selectedpath = fullPath + filesname.innerText;
if (fileitem.classList.contains('selected')) {
  notify("取消选择");
  fileitem.classList.remove('selected');
  index = selectedarray.indexOf(selectedpath);
  selectedarray.splice(index, 1);
} else {
  selectcount=selectedarray.length+1;
  notify("已选择"+selectcount+"个文件");
  fileitem.classList.add('selected');
selectedarray.push(selectedpath);
}
}