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
  theme(mode,'green');
 loadFolder();
 document.querySelector('.backbtn').style.left='5%';
 document.getElementById('fileListContainer').style.opacity='1';
 document.getElementById('option-bar').style.left='0';
 document.getElementById('option-bar').style.opacity='1';
     document.getElementById('top-bar').style.top = `77px`;
   };
   window.onload = comin;
 function goBack() {
   window.location.replace(`../../index.html#${ip}`);
 }
 function loading(status) {
  
   const fileInput = document.getElementById('uploadfile');
   const folderInput = document.getElementById('uploadfolder');
   const load = document.getElementById('loading');
   const loadbox = document.getElementById('rotate-box');
   const loadText = document.getElementById('load-text');
   const goupbtn = document.getElementById('upButton');
   const path = document.getElementById('currentPath');
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
      loadbox.style.display = 'block';
      break;
   case 0:
      path.style.display = '';
      goupbtn.style.display = '';
      progress.style.display = 'none';
      load.style.display = 'none';
      loadbox.style.display = 'none';
     break;
   }

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
  pageloading(1);
   selectedarray.length = 0;
   fetch(`${protocol}//${ip}/server/doc/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ folder: folder }) 
  })
 .then(response => {
   return response.json();
 })
     .then(data => {
       const fileList = document.getElementById('fileList');
       fileList.innerHTML = '';

       const currentPath = document.getElementById('currentPath');
       fullPath = (data.currentFolder ? data.currentFolder : '')+'/';
       
       pathlen(currentPath, fullPath);
       currentPath.title = fullPath;
       const file_array = data.filelist;
       for (const files of file_array) {
        if(files.type==="file"||files.type==="file_link"){
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
         const Src = `${protocol}//${ip}/file/Documents/` + (data.currentFolder ? data.currentFolder + '/' + name : name);
         const fileListContainer = document.getElementById('fileListContainer');
         fileLink.textContent = files.name;
         fileLink.className = 'fileLink';
         fileLink.title = `预览${files.name}`;
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
           let rootpath=`${protocol}//${ip}/file/Documents/`;
           if (nowpath==="/"){
             filepath=rootpath + files.name;
           }
           else{
             filepath=rootpath + nowpath + files.name;
           }
           window.location.href = filepath;
         });

         listItem.appendChild(filetit);
         listItem.appendChild(fileLink);
         listItem.appendChild(editbtn);
         listItem.appendChild(savebtn);
         const downloadLink = document.createElement('div');
         downloadLink.className = 'downloadLink';
         downloadLink.classList.add('down-btn');
         downloadLink.title = `下载${files.name}`;
         downloadLink.textContent = `下载 ${files.name}`;
         downloadLink.addEventListener('click',()=>{
           event.stopPropagation(); 
           download(data.currentFolder,files.name,"file")
         });

         listItem.appendChild(downloadLink);

         fileList.appendChild(listItem);
        }

       if(files.type==="dir"||files.type==="dir_link"){
        const listItem = document.createElement('li');
         const editbtn= document.createElement('div');
         const downbtn= document.createElement('div');
         downbtn.classList.add('down-btn');
         downbtn.title=`下载${files.name}`;
         downbtn.addEventListener('click',function(){

          event.stopPropagation(); 
          if (confirm(`确定要下载`+files.name+'吗?')) {
          download(data.currentFolder,files.name,"folder")
          }
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
         folderLink.textContent = files.name;
         folderLink.className = 'folderLink';
         folderLink.title='进入'+files.name;
         listItem.addEventListener('click', function() {
           select(listItem,2);
         });
         folderLink.addEventListener('click', function () {
           event.stopPropagation(); 
           if (event.target.isContentEditable) {
             return; 
         }
           loadFolder(data.currentFolder ? data.currentFolder + '/' + files.name : files.name);

       });
        listItem.appendChild(filetit);
         listItem.appendChild(folderLink);
         listItem.appendChild(downbtn);
         listItem.appendChild(editbtn);
         listItem.appendChild(savebtn);
         fileList.appendChild(listItem);
       }
       }
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
  pageloading(1);
   if (folderName===""){
     folderName="new_folder";
   }
   if (folderName.includes('/') || folderName.includes('\\')) {
        notify("文件夹名称不能包含 / 或 \\");
        pageloading(0);
        return;
      }
   fetch(`${protocol}//${ip}/server/doc/new_folder`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify({ folderName, nowpath,user,token })
 })
 .then(response => {
  if (response.status === 401) {
    notify("无新建文件夹权限")
    pageloading(0)
    throw new Error('未授权访问');
  }
  return response.text();  
})
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
  if (confirm('确定要删除所选文件吗')) {
    ifroot();
    pageloading(1);
    const dellist = selectedarray;
    const requestData = { dellist: dellist };
    requestData.user = user;
    requestData.token = token;
    
    fetch(`${protocol}//${ip}/server/doc/del`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (response.status === 401) {
        notify("无删除权限")
        pageloading(0)
        throw new Error('未授权访问');
      }
      return response.text();  
    })
    .then(data => {
      loadFolder(removeslash(nowpath));
      notify("已删除");
      pastebtn.style.display = 'none';
      copyarray.length = 0;
    })
    .catch((error) => {
      console.error('错误:', error);
    });
  }
}
// 下载
function download(path,name,type){
  pageloading(1);
  switch(type){
  case "file":
      path=path+'/'+name
      window.location.href = `${protocol}//${ip}/server/doc/download_file?file_path=${path}&token=${token}&user=${user}`
      notify("开始下载")
      pageloading(0);
      break;
  case "folder":
    path=path+'/'+name
      fetch(`${protocol}//${ip}/server/doc/zip_folder`,{
        method: "POST",
        headers: {
        "Content-Type": "application/json" 
    },
    body: JSON.stringify({ folder_path: path ,token,user}) 
      })
      .then(response => {
        if (response.status === 401) {
          notify("无下载文件夹权限")
          pageloading(0)
          throw new Error('未授权访问');
        }
        return response.text();  
      })
      .then(text => {
        downToken=text
      window.location.href = `${protocol}//${ip}/server/doc/down_zip?downToken=${downToken}`
      notify("开始下载")
      pageloading(0);
    })
    .catch(error => console.error("请求失败:", error));
      break;
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
 copylist = copyarray;

 // 创建一个对象，包含 copylist 和 nowpath
 const requestData = {
   copylist: copylist,
   nowpath: nowpath,
   user: user,
   token: token
 };
 
switch (pastestatus){
 case 1:{
  pageloading(1);
 fetch(`${protocol}//${ip}/server/doc/copy`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(requestData),  
 })
 .then(response => {
  if (response.status === 401) {
    notify("无复制权限")
    pageloading(0)
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
  pageloading(1);
   fetch(`${protocol}//${ip}/server/doc/move`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(requestData),  // 将对象转换为 JSON 字符串
   })
   .then(response => {
    if (response.status === 401) {
      notify("无移动权限")
      pageloading(0)
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
   
   fetch(`${protocol}//${ip}/server/doc/rename`, {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
     },
     body: JSON.stringify({
        user: user,
        token: token,
         oldpath: oldpath,
         newpath: newpath
     }),
 })
 .then(response => {
  if (response.status === 401) {
    notify("无重命名权限")
    pageloading(0)
    throw new Error('未授权访问');
  }
  return response.text();  
})
 .then(data => {
 loadFolder(removeslash(nowpath))
 editmode=0;
 notify("修改成功");
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