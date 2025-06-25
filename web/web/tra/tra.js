let uploadpath;
let nowpath="/";//当前目录（要上传的目录）
let fullPath; 
let editmode=0;
let source_path=false
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
 loadFolder();
 theme(mode,"orange")
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
 async function loadFolder(folder = '') {
  if (folder == "/" || folder == "" || folder == " " || folder == ".")
      source_path=true
  else
      source_path=false
  recover_list.length=0
  selectedarray.length = 0;

  try {
    const response = await fetch(`${protocol}//${ip}/server/tra/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder: folder }),
    });
      const data = await response.json();
      const file_array = data.filelist;
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';

      const currentPath = document.getElementById('currentPath');
      fullPath = (data.currentFolder ? data.currentFolder : '') + '/';
      
      pathlen(currentPath, fullPath);
      currentPath.title = fullPath;
      for (const files of file_array) {
        if(files.type==="file"||files.type==="file_link"){
          const listItem = document.createElement('li');
          listItem.className = 'files';
          const fileLink = document.createElement('span');
          const Src = `${protocol}//${ip}/file/trash/` + (data.currentFolder ? data.currentFolder + '/' + files.name : files.name);
          const fileListContainer = document.getElementById('fileListContainer');
          fileLink.textContent = files.name;
          fileLink.classList.add('fileLink', 'filename');
          fileLink.title = `预览${files.name}`;
          
          listItem.addEventListener('click', function() {
              select(listItem, 1);
          });
          fileLink.addEventListener('click', function (event) {
              event.stopPropagation(); 
              if (event.target.isContentEditable) {
                  return; 
              }
              let filepath;
              nowpath = fullPath;
              let rootpath = `${protocol}//${ip}/file/trash/`;
              if (nowpath === "/") {
                  filepath = rootpath + files.name;
              } else {
                  filepath = rootpath + nowpath + files.name;
              }
              window.location.href = filepath;
          });
          const oripath = document.createElement('span');
          oripath.className = 'oripath';    
          if(files.delData==""||files.delData==null||files.delData==undefined)
                oripath.innerText="/";
          else  
                oripath.innerText=files.delData;
          oripath.title=`原路径${files.delData}`;
          listItem.appendChild(fileLink);
          listItem.appendChild(oripath);
          fileList.appendChild(listItem);    
        }
        if(files.type==="dir"||files.type==="ldir_link"){
          const listItem = document.createElement('li');
          listItem.className = 'files';
          const folderLink = document.createElement('span');
          folderLink.textContent = files.name;
          folderLink.classList.add('folderLink', 'filename');

          listItem.addEventListener('click', function() {
              select(listItem, 2);
          });
          folderLink.addEventListener('click', function (event) {
              event.stopPropagation(); 
              if (event.target.isContentEditable) {
                  return; 
              }
              loadFolder(data.currentFolder ? data.currentFolder + '/' + files.name : files.name);
          });
          const oripath = document.createElement('span');
          oripath.className = 'oripath';    
          if(files.delData==""||files.delData==null||files.delData==undefined)
                oripath.innerText="/";
          else  
                oripath.innerText=files.delData;

          oripath.title=`原路径${files.delData}`;
          listItem.appendChild(folderLink);
          listItem.appendChild(oripath);
          fileList.appendChild(listItem);
        }
      }

      // 处理返回上级目录按钮
      const upButton = document.getElementById('upButton');
      if (data.currentFolder && data.currentFolder !== '') {
          upButton.style.display = 'block';
          upButton.dataset.parentFolder = data.parentFolder;
          upButton.style.pointerEvents = 'auto';
      } else {
          upButton.style.pointerEvents = 'none';
      }
  } catch (error) {
      console.error('Error loading folder:', error);
  }
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
// 选中
let filesname;
let selectedpath;
let selectedarray = [];
let index;
let selectcount;
let recoverpath;
// 用于存储 selectedpath 和 recoverpath 的对象
let recover_list = [];

// 恢复
function recover() {
  if(confirm("确定恢复吗")){
  ifroot()
let data = {
  recover_list: recover_list,
  user,
  token,
  source_path
};

    fetch(`${protocol}//${ip}/server/tra/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if(response.ok){
        selectedarray.length==0;
        loadFolder(removeslash(nowpath));
        notify("已恢复");
        selectedarray.length = 0;
      }
     else if (response.status === 401) {
      selectedarray.length==0;
      loadFolder(removeslash(nowpath));
        notify("无恢复权限")
        selectedarray.length = 0;
        throw new Error('未授权访问');
      }
      else  {
        selectedarray.length==0;
        loadFolder(removeslash(nowpath));
          notify(response.status+"错误")
          selectedarray.length = 0;
          throw new Error('未授权访问');
        }
      })
    .catch((error) => {
      console.error('错误:', error);
    });
  }

  }





function select(fileitem, type) {
  let filesname;

  switch (type) {
    case 1:
      filesname = fileitem.querySelector('.fileLink');
      break;
    case 2:
      filesname = fileitem.querySelector('.folderLink');
      break;
  }

  selectedpath = fullPath + filesname.innerText;

  if (fileitem.classList.contains('selected')) {
    notify("取消选择");
    fileitem.classList.remove('selected');
    index = selectedarray.indexOf(selectedpath);
    selectedarray.splice(index, 1);
    recover_list.splice(recover_list.indexOf(selectedpath), 1); // 从 recover 数组移除
  } else {
    selectcount = selectedarray.length + 1;
    notify("已选择" + selectcount + "个文件");
    fileitem.classList.add('selected');
    selectedarray.push(selectedpath);
    recover_list.push(selectedpath); 
  }
}

// 去除最后斜杠
function removeslash(path) {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
// 清空
function cleanall(){
  if (confirm('确定清空回收站吗')) {
    ifroot();
  fetch(`${protocol}//${ip}/server/tra/del`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({user,token}),
  })
  .then(response => {
    if(response.ok){
      loadFolder(removeslash(nowpath));
      notify("已清空");
    }
   else if (response.status === 401) {
    selectedarray.length==0;
    loadFolder(removeslash(nowpath));
      notify("无清空权限")
      throw new Error('未授权访问');
    }
    else  {
      selectedarray.length==0;
      loadFolder(removeslash(nowpath));
        notify(response.status+"错误")
        throw new Error('未授权访问');
      }
    })
  .catch((error) => {
    console.error('错误:', error);
  });
}
}
