let darkcolor;
let lightcolor
darkcolor='#271f25';
lightcolor='#966a85';
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
     document.querySelector('body').style.backgroundImage = `url(${wallpath}home.svg)`;
     document.querySelector('.next').style.backgroundImage = `url(${wallpath}home.svg)`;
   document.querySelector('.next').style.opacity ='1';  
   
   setTimeout(() => {
   window.location.replace(`../../index.html#${ip}`);
}, 1000); // 1000 毫秒 = 1 秒
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
   fetch(`${protocol}//${ip}/code/trash/doc_list.php?folder=` + folder)
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
         listItem.className = 'files';
         const folderLink = document.createElement('span');
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
         listItem.appendChild(folderLink);
         fileList.appendChild(listItem);
       });

       data.files.forEach(file => {
         const listItem = document.createElement('li');
         listItem.className = 'files';
         const fileLink = document.createElement('span');
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

         listItem.appendChild(fileLink);

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
// 恢复
function recover() {
  access();
  if (confirm('确定要恢复所选文件吗')) {
    ifroot();
    const dellist = JSON.stringify(selectedarray);
    const requestData = { dellist: dellist };

    fetch(`${protocol}//${ip}/code/trash/recover.php`, {
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
// 去除最后斜杠
function removeslash(path){
 return path.endsWith('/') ? path.slice(0, -1) : path;
}

