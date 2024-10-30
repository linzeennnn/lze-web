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
   const folderInput = document.getElementById('uploadfolder');
   const load = document.getElementById('loading');
   const loadbox = document.getElementById('rotate-box');
   const loadText = document.getElementById('load-text');
   const goupbtn = document.getElementById('upButton');
   const path = document.getElementById('currentPath');
   const cancel = document.getElementById('cancel');
   const progress = document.getElementById('progress');
   switch(status){
    case 1:
      if (fileInput.files.length === 0 && folderInput.files.length === 0) {
        notify("请先选择一个文件进行上传");
          return; // 没有选择文件，直接返回
      }
      path.style.display = 'none';
      goupbtn.style.display = 'none';
      progress.style.display = 'block';
      load.style.display = 'block';
      cancel.style.display = 'block';
      loadbox.style.display = 'block';
      break;
   case 0:
      path.style.display = '';
      goupbtn.style.display = '';
      progress.style.display = 'none';
      load.style.display = 'none';
      cancel.style.display = 'none';
      loadbox.style.display = 'none';
     break;
   }

 }
//  路径长度
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
//  加载文件夹
 function loadFolder(folder = '') {
  pageloading(1);
   fetch(`${protocol}//${ip}/code/Pictures/pic_list.php?folder=` + folder)
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
         listItem.classList.add('folder');
         const folderLink = document.createElement('span');
         const filetit = document.createElement('input');
         filetit.classList.add('file-tit');
         folderLink.textContent = folder;
         folderLink.className = 'folderLink';
         listItem.addEventListener('click', function() {
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
         listItem.classList.add('file');
         const fileLink = document.createElement('span');
         const filetit = document.createElement('input');
         filetit.classList.add('file-tit');
         const Src = `${protocol}//${ip}/file/Documents/upload/` + (data.currentFolder ? data.currentFolder + '/' + file : file);
         const fileListContainer = document.getElementById('fileListContainer');
         fileLink.textContent = file;
         fileLink.className = 'fileLink';
         fileLink.title = `预览${file}`;
         listItem.addEventListener('click', function() {
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
       pageloading(0);
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
// 去除最后斜杠
function removeslash(path){
 return path.endsWith('/') ? path.slice(0, -1) : path;
}
// 打开upload页面
function showupload(status){
  const page=document.getElementById('upload-page');
  switch(status){
    case 0:
      page.style.opacity='0';
    setTimeout(() => {      
      page.style.display='';
        }, 500);
      break;
    case 1:
      page.style.display='flex';
      setTimeout(() => {      
        page.style.opacity='1';
          }, 10);
      break;
  }  
}
// 点击事件
function clickable(status) {
  switch (status) {
      case 0:
          document.body.style.pointerEvents = 'none';
          break;
      case 1:
          document.body.style.pointerEvents = 'auto';
          break;
  }
}
// 其他目录
function showoth(){
    const dirbar=document.getElementById('oth-list');
    if(dirbar.style.display=='flex'){
        dirbar.style.display='none';
    }
    else{
        dirbar.style.display='flex';
    }
}
