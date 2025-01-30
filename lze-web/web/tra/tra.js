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
 theme(mode,"orange")
 document.querySelector('.backbtn').style.left='5%';
 document.getElementById('fileListContainer').style.opacity='1';
 document.getElementById('option-bar').style.left='0';
 document.getElementById('option-bar').style.opacity='1';
     document.getElementById('top-bar').style.top = `77px`;
     loginstatus();
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
  selectedarray.length = 0;

  try {
    const response = await fetch(`${protocol}//${ip}/server/tra/list.cgi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder: folder }),
    });
      fetchnologin(response);
      const data = await response.json();

      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';

      const currentPath = document.getElementById('currentPath');
      fullPath = (data.currentFolder ? data.currentFolder : '') + '/';
      
      pathlen(currentPath, fullPath);
      currentPath.title = fullPath;

      data.folders.forEach(folder => {
          const listItem = document.createElement('li');
          listItem.className = 'files';
          const folderLink = document.createElement('span');
          folderLink.textContent = folder;
          folderLink.classList.add('folderLink', 'filename');

          listItem.addEventListener('click', function() {
              select(listItem, 2);
          });
          folderLink.addEventListener('click', function (event) {
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
          const Src = `${protocol}//${ip}/file/trash/` + (data.currentFolder ? data.currentFolder + '/' + file : file);
          const fileListContainer = document.getElementById('fileListContainer');
          fileLink.textContent = file;
          fileLink.classList.add('fileLink', 'filename');
          fileLink.title = `预览${file}`;
          
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
                  filepath = rootpath + file;
              } else {
                  filepath = rootpath + nowpath + file;
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

      getpath();
  } catch (error) {
      console.error('Error loading folder:', error);
  }
}

// 获取原路径
async function getpath() {
  const response = await fetch(`${protocol}//${ip}/file/data/deleted_metadata.json`, {
    method: 'GET',
    cache: 'no-cache' // 强制不使用缓存
  });
  const data = await response.json();
  const trashfilename = Object.keys(data);
  const filename=document.querySelectorAll('.filename')
  filename.forEach(filename => {
    if (trashfilename.includes(filename.innerText)) {  
      const oripath = document.createElement('span');
      oripath.className = 'oripath';    
      oripath.innerText=data[filename.innerText].replace('../../file/Documents', '') || '/';
      filename.insertAdjacentElement('afterend', oripath);
    } else {
      const oripath = document.createElement('span');
      oripath.className = 'oripath';    
      oripath.innerText='/'+filename.innerText;
      filename.insertAdjacentElement('afterend', oripath);
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
  ifroot()
    fetch(`${protocol}//${ip}/server/tra/recover.cgi`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pathsMap),
    })
    .then(response => {
      if (response.status === 401) {
        throw new Error('未授权访问');
      }
    })
    .then(results => {
      selectedarray.length==0;
      loadFolder(removeslash(nowpath));
      notify("已恢复");
      selectedarray.length = 0;
    })
    .catch((error) => {
      console.error('错误:', error);
    });
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
let pathsMap = {
  recover_list: recover_list
};

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
  fetch(`${protocol}//${ip}/code/trash/del.php`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        console.log(data.message);
        loadFolder(removeslash(nowpath));
        notify("已清空");
    } else {
        console.error(data.message);
    }
})
.catch(error => console.error('Error:', error));

  }
}
