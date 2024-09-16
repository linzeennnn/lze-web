 let darkcolor;
 let lightcolor
 darkcolor='#271f25';
 lightcolor='#966a85';
 let uploadpath;
 let nowpath="/";//当前目录（要上传的目录）
 function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
          document.getElementById('top-btn').style.bottom = '5%';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.width = '70%';
          document.getElementById('top-bar').style.marginLeft = '10%';
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
          document.getElementById('top-bar').style.marginLeft = '';
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
  function loadFolder(folder = '') {
    fetch(`http://${ip}/code/Documents/doc_list.php?folder=` + folder, fetchtoken())
  .then(response => {
    fetchnologin(response)
    return response.json();
  })
      .then(data => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        const currentPath = document.getElementById('currentPath');
        const fullPath = (data.currentFolder ? data.currentFolder : '')+'/';
        pathlen(currentPath, fullPath);
        currentPath.title = fullPath;

        data.folders.forEach(folder => {
          const listItem = document.createElement('li');
          const folderLink = document.createElement('span');
          folderLink.textContent = folder + '/';
          folderLink.className = 'folderLink';
          folderLink.addEventListener('click', function () {
            loadFolder(data.currentFolder ? data.currentFolder + '/' + folder : folder);
          });
          listItem.appendChild(folderLink);
          fileList.appendChild(listItem);
        });

        data.files.forEach(file => {
          const listItem = document.createElement('li');

          const fileLink = document.createElement('span');
          const Src = `http://${ip}/file/Documents/upload/` + (data.currentFolder ? data.currentFolder + '/' + file : file);
          const fileListContainer = document.getElementById('fileListContainer');
          fileLink.textContent = file;
          fileLink.className = 'fileLink';
          fileLink.title = `预览${file}`;
          fileLink.addEventListener('click', function () {
            let filepath
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
    nowpath = currentPath.innerText;  // 获取当前路径
    console.log(nowpath);
    
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
                    loadFolder();
                    desktopnot('恩的文件', '新上传文件:', `${file.name}`, uploadpath);
                }
            }
        };

        xhr.send(fd);
    }

    uploadChunk(); // 开始上传第一个块
}
