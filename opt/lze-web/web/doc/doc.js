let darkcolor;
let lightcolor
darkcolor='#1c2825';
lightcolor='#6b9683';
let uploadpath;
let nowpath="/";//当前目录（要上传的目录）
let fullPath; 
let editmode=0;
//  操作导航栏
function optionbar(status){
 const optionbar=document.getElementById('option-bar');
 const openbtn=document.getElementById('openbar');
switch(status){
 case 0:
   allmove(status);
   optionstatus=0;
   openbtn.style.display='block';
   optionbar.style.left='';
   setTimeout(() => {
     optionbar.style.display='none';
 }, 1000);
   break;
 case 1:
 allmove(status);
   optionstatus=1;
   optionbar.style.display='';
   setTimeout(() => {
     openbtn.style.display='none';
     optionbar.style.left='0';
 }, 10);
   break;
}
}
//  整体页面的位置
function allmove(status){
 const elements = document.querySelectorAll('.main');
 switch(status){
   case 1:
     elements.forEach(function(element, index) {
         if (element) {
             element.style.marginLeft = '';
         } 
     });
     break;
   case 0:
elements.forEach(function(element, index) {
       element.style.marginLeft = '0';
});
     break;
 }
}
function handleScroll() {
   var scrollTop = window.scrollY || document.documentElement.scrollTop;
       
       if (scrollTop > 100) {
         document.getElementById('top-btn').style.bottom = '90px';
         document.querySelector('.backbtn').style.left = '1%';
         document.getElementById('top-bar').style.boxShadow = 'none';
         document.getElementById('top-bar').style.top = '10px';
         document.getElementById('top-bar').style.backgroundColor = 'transparent';
         document.getElementById('cover-bar').style.top = '0';
     document.getElementById('top-bar').style.backdropFilter = `none`;
     document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
         
       } else {
         document.getElementById('top-btn').style.bottom = '';
         document.querySelector('.backbtn').style.left = '5%';
         document.getElementById('top-bar').style.boxShadow = '';
         document.getElementById('top-bar').style.top = '77px';
         document.getElementById('top-bar').style.backgroundColor = '';
         document.getElementById('cover-bar').style.top = '';
         document.getElementById('top-bar').style.backdropFilter = ``;
         document.getElementById('top-bar').style.webkitBackdropFilter = ``;
        
       }
}

window.addEventListener('scroll', handleScroll);

 function comin(){
   access();
 loadFolder();
 document.querySelector('.backbtn').style.left='5%';
 document.getElementById('fileListContainer').style.opacity='1';
 document.getElementById('option-bar').style.left='0';
 document.getElementById('option-bar').style.opacity='1';
     document.getElementById('top-bar').style.top = `77px`;
     loginstatus();
   };
   window.onload = comin;
 function goBack() {
   window.removeEventListener('scroll',handleScroll);
   document.getElementById('cover-bar').style.top = `-80px`;
   document.querySelector('.backbtn').style.left = '';
   document.querySelector('.backbtn').style.opacity = '0';
   document.getElementById('fileListContainer').style.opacity = ``;
   document.getElementById('option-bar').style.left='';
 document.getElementById('option-bar').style.opacity='0';
     document.getElementById('top-bar').style.top = `-60px`;
     document.getElementById('top-btn').style.bottom = `-5%`;
   
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
   selectedarray.length = 0;
   fetch(`${protocol}//${ip}/code/Documents/doc_list.php?folder=` + folder)
 .then(response => {
   fetchnologin(response)
   return response.json();
 })
     .then(data => {
       const fileList = document.getElementById('fileList');
       fileList.innerHTML = '';

       const currentPath = document.getElementById('currentPath');
       fullPath = (data.currentFolder ? data.currentFolder : '')+'/';
       
       pathlen(currentPath, fullPath);
       currentPath.title = fullPath;

       data.folders.forEach(folder => {
         const listItem = document.createElement('li');
         const editbtn= document.createElement('div');
         const downbtn= document.createElement('div');
         downbtn.classList.add('down-btn');
         downbtn.title=`下载${folder}`;
         downbtn.addEventListener('click',function(){

          event.stopPropagation(); 
          downfolder(listItem);
        });
         editbtn.className='edit li-btn';
         editbtn.title = `重命名`;
         editbtn.addEventListener('click',function(){
           event.stopPropagation(); 
           rename(0,listItem,2);
         });
         const savebtn= document.createElement('div');
         savebtn.className='save li-btn';
         savebtn.addEventListener('click',function(){
           event.stopPropagation(); 
           rename(1,listItem);
         });
         listItem.className = 'files';
         const folderLink = document.createElement('span');
         const filetit = document.createElement('input');
         filetit.classList.add('file-tit');
         folderLink.textContent = folder;
         folderLink.className = 'folderLink';
         listItem.addEventListener('click', function() {
           select(listItem,2);
         });
         folderLink.addEventListener('click', function () {
           event.stopPropagation(); 
           if (event.target.isContentEditable) {
             return; 
         }
           loadFolder(data.currentFolder ? data.currentFolder + '/' + folder : folder);

       });
        listItem.appendChild(filetit);
         listItem.appendChild(folderLink);
         listItem.appendChild(downbtn);
         listItem.appendChild(editbtn);
         listItem.appendChild(savebtn);
         fileList.appendChild(listItem);
       });

       data.files.forEach(file => {
         const listItem = document.createElement('li');
         const editbtn= document.createElement('div');
         editbtn.className='edit li-btn';
         editbtn.title = `重命名`;
         editbtn.addEventListener('click',function(){
           event.stopPropagation(); 
           rename(0,listItem,1);
         });
         const savebtn= document.createElement('div');
         savebtn.className='save li-btn';
         savebtn.addEventListener('click',function(){
           event.stopPropagation(); 
           rename(1,listItem);
         });
         listItem.className = 'files';
         const fileLink = document.createElement('span');
         const filetit = document.createElement('input');
         filetit.classList.add('file-tit');
         const Src = `${protocol}//${ip}/file/Documents/upload/` + (data.currentFolder ? data.currentFolder + '/' + file : file);
         const fileListContainer = document.getElementById('fileListContainer');
         fileLink.textContent = file;
         fileLink.className = 'fileLink';
         fileLink.title = `预览${file}`;
         listItem.addEventListener('click', function() {
           select(listItem,1);
         });
         fileLink.addEventListener('click', function () {
           event.stopPropagation(); 
           if (event.target.isContentEditable) {
             return; 
         }
           let filepath;
           nowpath = fullPath;
           let rootpath=`${protocol}//${ip}/file/Documents/upload/`;
           if (nowpath==="/"){
             filepath=rootpath + file;
           }
           else{
             filepath=rootpath + nowpath + file;
           }
           window.location.href = filepath;
         });

         listItem.appendChild(filetit);
         listItem.appendChild(fileLink);
         listItem.appendChild(editbtn);
         listItem.appendChild(savebtn);

         const downloadLink = document.createElement('a');
         // 修改 downloadLink 的 href 指向 PHP 脚本而不是直接文件路径
         downloadLink.className = 'downloadLink';
         downloadLink.classList.add('down-btn');
         downloadLink.href = `${protocol}//${ip}/code/Documents/doc_download.php?file=${encodeURIComponent(file)}&folder=${encodeURIComponent(data.currentFolder || '')}`;
         downloadLink.title = `下载${file}`;
         downloadLink.textContent = `下载 ${file}`;
         downloadLink.addEventListener('click',()=>{
           event.stopPropagation(); 
           notify("开始下载")
         });

         listItem.appendChild(downloadLink);

         fileList.appendChild(listItem);
       });

       // 处理返回上级目录按钮
       const upButton = document.getElementById('upButton');
       if (data.currentFolder && data.currentFolder !== '') {
         upButton.style.display = 'block';
         upButton.dataset.parentFolder = data.parentFolder;
         upButton.style.pointerEvents = 'auto';
       } else {
         upButton.style.pointerEvents = 'none';
       }
     });
}
// 回到上一级
 function goUp() {
   const upButton = document.getElementById('upButton');
   const parentFolder = upButton.dataset.parentFolder;
   loadFolder(parentFolder);
 }
// 判断根目录
function ifroot(){
 if (fullPath=="/"){
   nowpath="";
 }
 else {
   nowpath=fullPath;
 }
}
// 发送文件
function selfile() {
  ifroot(); 
  var files = fileInput.files; // 直接使用 fileInput 的文件
  if (files.length === 0) {
      notify("请先选择文件");
      return;
  }
  var chunkSize = 1024 * 1024; // 每个块的大小（1MB）
  var totalFiles = files.length;
  var totalChunks = Array(totalFiles).fill(0); // 存储每个文件的总块数
  var currentChunks = Array(totalFiles).fill(0); // 存储每个文件的当前块数

  // 计算每个文件的总块数
  for (let i = 0; i < totalFiles; i++) {
    if (files[i].size === 0) {
        notify(`${files[i].name} 是空文件，上传失败`);
        return;
    }
    totalChunks[i] = Math.ceil(files[i].size / chunkSize);
}
loading(1);
  function uploadChunk(fileIndex) {
      if (fileIndex >= totalFiles) {
          loading(0);
          return;
      }

      var file = files[fileIndex];
      var start = currentChunks[fileIndex] * chunkSize;
      var end = Math.min(start + chunkSize, file.size);
      var chunk = file.slice(start, end);

      console.log(`开始上传文件: ${file.name}, 文件大小: ${file.size} 字节`);
      var fd = new FormData();
      fd.append('file', chunk);
      fd.append('fileName', file.name);
      fd.append('totalChunks', totalChunks[fileIndex]);
      fd.append('currentChunk', currentChunks[fileIndex]);
      fd.append('nowpath', nowpath);  // 传递 nowpath 变量

      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${protocol}//${ip}/code/Documents/upload.php`, true);
      xmltoken(xhr);
      xhr.upload.onprogress = function (ev) {
          if (ev.lengthComputable) {
              var percent = ((currentChunks[fileIndex] + ev.loaded / ev.total) / totalChunks[fileIndex]) * 100;
              var percentElement = document.getElementById('percent');
              document.getElementById('bar').style.width = percent + '%';
              percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
          }
      };

      xhr.onload = function () {
          xmlnologin(xhr);
          if (xhr.status === 200) {
              currentChunks[fileIndex]++;
              if (currentChunks[fileIndex] < totalChunks[fileIndex]) {
                  uploadChunk(fileIndex); // 上传下一个块
              } else {
                  // 上传下一个文件
                  uploadChunk(fileIndex + 1);
                  notify(`文件 ${file.name} 上传成功`);
                  console.log(`上传成功: ${file.name}, 文件大小: ${file.size} 字节`);
                  uploadpath = xhr.responseText;
                  console.log(uploadpath);
                  loadFolder(removeslash(nowpath));
                  desktopnot('新文件', `新上传文件: ${file.name}`, uploadpath);
              }
          }
      };

      xhr.send(fd);
  }

  uploadChunk(0); // 开始上传第一个文件
}

// 新建文件夹
// 键盘回车
function keynewfolder(event) {
  if (event.key === 'Enter') {
    newfolder(2);
  }
}
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
    if(editmode!=0){
      notify("请保存正在编辑内容")
      return;
    }
    editmode=1;
 pathbar.style.display='none';
 namebar.style.display='block';
 comfirm.style.display='block'
 cancelfolder.style.display='block'
 upbtn.style.display='none';
 newfod.style.display='none';
 document.addEventListener('keydown', keynewfolder);
 break;
 case 0:
   pathbar.style.display='';
   namebar.style.display='';
   comfirm.style.display=''
   cancelfolder.style.display=''
   upbtn.style.display='';
   newfod.style.display='';
   editmode=0;
   document.removeEventListener('keydown', keynewfolder);
   break;
   case 2:
     ifroot();  
   if (folderName===""){
     folderName="new_folder";
   }
   fetch(`${protocol}//${ip}/code/Documents/new_folder.php`, {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer ' + token,
         'Content-Type': 'application/json'
     },
     body: JSON.stringify({ folderName, nowpath })
 })
 .then(response => response.text())
 .then(data => {
     loadFolder(removeslash(nowpath));
     namebar.value="";
     editmode=0;
     document.removeEventListener('keydown', keynewfolder);
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
function del() {
  access();
  if (confirm('确定要删除所选文件吗')) {
    ifroot();
    const dellist = JSON.stringify(selectedarray);
    const requestData = { dellist: dellist };

    fetch(`${protocol}//${ip}/code/Documents/delete.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (response.status === 401) {
        throw new Error('未授权访问');
      }
      return response.text();  
    })
    .then(data => {
      loadFolder(removeslash(nowpath));
      notify("已删除");
      pastebtn.style.display = 'none';
      copyarray.length = 0;
      console.log(data);
    })
    .catch((error) => {
      console.error('错误:', error);
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
 ifroot(); 
 copylist = JSON.stringify(copyarray);

 // 创建一个对象，包含 copylist 和 nowpath
 const requestData = {
   copylist: copylist,
   nowpath: nowpath
 };
switch (pastestatus){
 case 1:{
  access();
 fetch(`${protocol}//${ip}/code/Documents/copy.php`, {
   method: 'POST',
   headers: {
     'Authorization': 'Bearer ' + token,
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
 })
 .then(response => {
  if (response.status === 401) {
    throw new Error('未授权访问');
  }
  return response.text();  
})
 .then(data => {
   loadFolder(removeslash(nowpath));
   notify("已复制");
   pastebtn.style.display='none';
   copyarray.length=0;
 })
 .catch((error) => {
   console.error('错误:', error);
 });}
 break;
 case 0:{
  access();
   fetch(`${protocol}//${ip}/code/Documents/move.php`, {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer ' + token,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
   })
   .then(response => {
    if (response.status === 401) {
      throw new Error('未授权访问');
    }
    return response.text();  
  })
   .then(data => {
     loadFolder(removeslash(nowpath));
     notify("已移动");
     pastebtn.style.display='none';
     copyarray.length=0;
     console.log(data);
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
// 重命名
 let oldname;
 let newname;
function rename(option,fileitem,type,event){
 let newpath;
 let oldpath;
 let files;
 const editbtn=fileitem.querySelector('.edit');
 const savebtn=fileitem.querySelector('.save');
 const filetit=fileitem.querySelector('.file-tit');
 switch (type){
   case 1:
files=fileitem.querySelector('.fileLink');
   break;
   case 2:    
files=fileitem.querySelector('.folderLink');
     break;
 }
 switch(option){
   case 0:
    if(editmode!=0){
      notify("请保存正在编辑内容")
      return;
    }
    editmode=1;
     editbtn.style.display="none";
     savebtn.style.display="block";
     files.style.display='none';
     filetit.style.display='block';
     filetit.contentEditable = 'true';
     filetit.value=files.innerText;
     files.setAttribute('contenteditable', 'true');
 oldname=files.innerText;
   break;
   case 1:
   ifroot();  
   newname=filetit.value;
   oldpath=nowpath+oldname;
   newpath=nowpath+newname;   
   fetch(`${protocol}//${ip}/code/Documents/rename.php`, {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer ' + token,
         'Content-Type': 'application/json',
     },
     body: JSON.stringify({
         oldpath: oldpath,
         newpath: newpath
     }),
 })
 .then(response => response.text())
 .then(data => {
 loadFolder(removeslash(nowpath))
 editmode=0;
 notify(data);
 })
 .catch((error) => {
     console.log(error);
     notify(data);;
 });
     break;
 }
}
// 去除最后斜杠
function removeslash(path){
 return path.endsWith('/') ? path.slice(0, -1) : path;
}
//拖拽上传
const fileInput = document.getElementById('uploadfile');
const uploadarea = document.getElementById('upload-area');
const filelist = document.getElementById('fileListContainer');

document.addEventListener('dragover', handleDragOver);
document.addEventListener('dragleave', handleDragLeave);
document.addEventListener('drop', handleDrop);
filelist.addEventListener('dragover', handleDragOver);
filelist.addEventListener('dragleave', handleDragLeave);
filelist.addEventListener('drop', handleDrop);

function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '1';
}

function handleDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '';
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '';
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i]);
        }
        fileInput.files = dataTransfer.files; 
        selfile();
    }
}
// 下载文件夹
function downfolder(folder) {
  if (confirm('确定要下载文件夹吗')) {
    const name = folder.querySelector('.folderLink').innerText;
    let path;
    if (currentPath.innerText == "/") {
      path = currentPath.innerText;
    } else {
      path = "/" + currentPath.innerText;
    }

    const formData = new FormData();
    formData.append('folderPath', path);
    formData.append('foldername', name);

    // 使用 fetch 进行请求
    fetch(`${protocol}//${ip}/code/Documents/zip_folder.php`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
        notify("已压缩文件");
      } else {
        return response.json();
      }
    })
    .then(data => {
      if(!data.error){
      // 使用 href 进行下载
      const a = document.createElement('a');
      a.href = data.url; // 从响应中获取下载链接
      console.log(a.href);
      a.download = name + ".zip"; // 设置下载文件名
      document.body.appendChild(a);
      a.click(); // 触发下载
      a.remove(); // 移除链接
      }
      else{
        notify(data.error);
      }
    })
  }
}
