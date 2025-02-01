let uploadpath;
let nowpath="/";
let fullPath; 
let editmode=0;
let pagenum,phonum,vidnum,curpage;
let pagetype;
const pagedis=document.getElementById('page-display');
const bigpic=document.getElementById('bigpic');
const lastpic=document.getElementById('last-btn');
const nextpic=document.getElementById('next-btn');
const picpage=document.getElementById('bigpic-page');
// 操作导航栏
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
// 整体页面的位置
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
         document.getElementById('top-btn').style.bottom = '200px';
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
 theme(mode,"blue")
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
// 路径长度
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
// 加载文件夹
async function loadFolder(folder = '') {
  pageloading(1);
  curpage = 1;

  try {
    const response = await fetch(`${protocol}//${ip}/server/pic/list.cgi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder: folder }),
    });
    
    fetchnologin(response);
    const data = await response.json();
    let phoindex = 0, vidindex = 0;
    phonum = 1;
    vidnum = 1;
    
    
    const othlist = document.getElementById('oth-list');
    const picbox = document.getElementById('pic-box');
    picbox.innerHTML = '';
    othlist.innerHTML = '';
    
    const currentPath = document.getElementById('currentPath');
    fullPath = (data.currentFolder ? data.currentFolder : '') + '/';
    pathlen(currentPath, fullPath);
    currentPath.title = fullPath;
    const file_array = data.file_list[0];
    for (const [name, type] of Object.entries(file_array)) {
      if(type==="file"||type==="link_file"){
        const load = document.createElement('div');
        const pic = document.createElement('div');
        pic.classList.add('pic');
        load.classList.add('load-loop');
        let picfile;
  
        pic.addEventListener('click', function () {
          openpic(1, folder + "/" + name);
        });
  
        // 视频
        if (isvideo(name) == 1) {
          pic.classList.add('video');
          picfile = document.createElement('video');
          if (vidindex % 9 == 0 && vidindex != 0) {
            vidnum++;
          }
          pic.classList.add(`vid-page${vidnum}`);
          vidindex++;
        } 
        // 图片
        else {
          pic.classList.add('photo');
          picfile = document.createElement('img');
          if (phoindex % 9 == 0 && phoindex != 0) {
            phonum++;
          }
          pic.classList.add(`pho-page${phonum}`);
          phoindex++;
        }
  
        picfile.setAttribute('loading', 'lazy');
        picfile.draggable = false;
        pic.title = "查看" + name;
        picfile.src = `${protocol}//${ip}/file/Pictures/${folder}/${name}`;
        pic.append(load);
        pic.append(picfile);
        picbox.appendChild(pic);
        
        picfile.onload = function() {
          load.style.display = 'none';
        };
        picfile.addEventListener('loadeddata', function() {
          load.style.display = 'none';
      });
      }
      if(type==="folder"||type==="link_dir"){
        const dir = document.createElement('div');
        dir.classList.add('folder');
        dir.innerText = name;
        dir.title = name;
        dir.addEventListener('click', function (event) {
          event.stopPropagation();
          if (event.target.isContentEditable) {
            return;
          }
          loadFolder(data.currentFolder ? data.currentFolder + '/' + name : name);
        });
        othlist.appendChild(dir);
      }
    }


    pageloading(0);

    const upButton = document.getElementById('upButton');
    if (data.currentFolder && data.currentFolder !== '') {
      upButton.style.display = 'block';
      upButton.dataset.parentFolder = data.parentFolder;
      upButton.style.pointerEvents = 'auto';
    } else {
      upButton.style.pointerEvents = 'none';
    }

    pagenum = phonum;
    showpic("pho");
  } catch (error) {
    console.error("Error loading folder:", error);
    pageloading(0);
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
// 去除最后斜杠
function removeslash(path){
 return path.endsWith('/') ? path.slice(0, -1) : path;
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
function showoth(place){
    const dirbar=document.getElementById('oth-list');
    if(dirbar.style.display=='flex'||place==1){
        dirbar.style.display='none';
    }
    else{
        dirbar.style.display='flex';
    }
}
document.getElementById('oth-btn').addEventListener('click',function(event){
  event.stopPropagation();
})
document.addEventListener('click',function(event){
  showoth(1);
})
// 视频后缀名检查
function isvideo(name){
  const ext = ['.mp4', '.avi', '.mov', '.wmv', '.mkv','.ts','.webm', '.flv','.m4v','.3gp','.mpeg','.rmvb','.vob'];
  const nameext=name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
  if (ext.includes(`.${nameext}`)) {
    return 1;
} else {
    return 0;
}
}
// 多页面
function displaypage(num,cunum,type){
  document.querySelectorAll(`.${type}-page${cunum}`).forEach(page => {
    page.style.display = 'none';
});
document.querySelectorAll(`.${type}-page${num}`).forEach(page => {
  page.style.display = 'flex';
});
if(cunum==0){
  pagenumdis(curpage,pagenum);
}
}
// 跳转页面
function switchpage(status){
  switch(status){
    case 1:
      if(curpage<pagenum){
        displaypage(curpage+1,curpage,pagetype);
        curpage++;
        }
        else{
          notify("已是尾页")
        }
      break;
    case 0:
      if(curpage>1){
      displaypage(curpage-1,curpage,pagetype);
      curpage--;
      }
      else{
        notify("已是首页")
      }
      break;
  }
  pagenumdis(curpage,pagenum);
}
// 展示图片视频
function showpic(type){
  const pho= document.querySelectorAll(`.photo`);
  const vid= document.querySelectorAll(`.video`);
switch(type){
  case "pho":
    pagenum=phonum;
    document.querySelectorAll(`.video`).forEach(page => {
      page.style.display = 'none';
    });
    break;
  case "vid":
    pagenum=vidnum;
    document.querySelectorAll(`.photo`).forEach(page => {
      page.style.display = 'none';
    });
    break;
}
curpage=1;
pagetype=type;
displaypage(curpage,0,type)
}
// 显示页数
function pagenumdis(cu,tol){
pagedis.innerText=cu+"页/"+tol+"页";
}
// 图片缩放
let scale = 1;
bigpic.addEventListener('wheel', (event) => {
    event.preventDefault(); 
    if (event.deltaY < 0) {
        scale += 0.1; 
    } else {
        scale -= 0.1; 
    }
    scale = Math.min(Math.max(1, scale), 3); 
    bigpic.style.transform = `scale(${scale})`;
});
// 触控缩放
let initialDistance = null;
const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
        initialDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
    }
};
const handleTouchMove = (event) => {
    if (event.touches.length === 2 && initialDistance !== null) {
        const currentDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
        const scaleChange = currentDistance / initialDistance;
        scale *= scaleChange;
        scale = Math.min(Math.max(1, scale), 3);
        bigpic.style.transform = `scale(${scale})`;
        initialDistance = currentDistance; 
    }
};
bigpic.addEventListener('touchstart', handleTouchStart);
bigpic.addEventListener('touchmove', handleTouchMove);
// 防止大图片点击影响
const pagebtn = [bigpic, lastpic, nextpic];
pagebtn.forEach(pagebtn => {
  pagebtn.addEventListener('click', event => event.stopPropagation());
});

// 打开大图片
let picmap;
function openpic(status,path){
  let pic;
  switch(status){
    case 1:
      picpage.style.display='flex';
      if(pagetype=="pho"){
        pic=document.createElement('img');
      }
      else{
        pic=document.createElement('video');
        pic.controls = true; 
        pic.autoplay = true;
      }
      pic.id='page-pic';
      pic.draggable = false;
      pic.src=`${protocol}//${ip}/file/Pictures/${path}`;
      bigpic.appendChild(pic);
      if(pagetype=="pho"){
      picmap = Array.from(document.querySelectorAll('img'))
  .filter(img => img.offsetWidth > 0 && img.offsetHeight > 0)
  .map(img => img.src);
      }
      else{
        picmap = Array.from(document.querySelectorAll('video'))
    .filter(video => video.offsetWidth > 0 && video.offsetHeight > 0)
    .map(video => video.src);
      }
      break;
    case 0:
      bigpic.removeChild(document.getElementById('page-pic'));
      picpage.style.display='none';
      break;
  }
}
// 切换大图片
function switchpic(status){
  let link=document.getElementById('page-pic').src;
  const index = picmap.indexOf(link);
  switch(status){
    case 1:
      if (index < picmap.length - 1) {
        link = picmap[index + 1];
    } else {
      link = picmap[0];
    }
      break;
    case 0:
      if (index > 0) {
        link = picmap[index - 1];
    } else {
      link = picmap[picmap.length - 1];
    }
      break;
  }
  document.getElementById('page-pic').src=link;
}
// 上传文件
function selfile() {
  ifroot();
  var files = fileInput.files; // 直接使用 fileInput 的文件
  if (files.length === 0) {
      notify("请先选择文件");
      return;
  }
  var chunkSize = 20*1024 * 1024; // 每个块的大小（1MB）
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
      var fd = new FormData();
      fd.append('file', chunk);
      fd.append('fileName', file.name);
      fd.append('totalChunks', totalChunks[fileIndex]);
      fd.append('currentChunk', currentChunks[fileIndex]);
      fd.append('nowpath', nowpath); // 传递 nowpath 变量
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${protocol}//${ip}/server/pic/upload.cgi`, true);
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
                  uploadpath = xhr.responseText;
                  loadFolder(removeslash(nowpath));
                  desktopnot('新文件', `新上传文件: ${file.name}`, uploadpath);
              }
          }
      };
      xhr.send(fd);
  }
  uploadChunk(0); // 开始上传第一个文件
}
//拖拽上传
const fileInput = document.getElementById('uploadfile');
const uploadarea = document.getElementById('upload-area');
const picbox = document.getElementById('pic-box');
document.addEventListener('dragover', handleDragOver);
document.addEventListener('dragleave', handleDragLeave);
document.addEventListener('drop', handleDrop);
picbox.addEventListener('dragover', handleDragOver);
picbox.addEventListener('dragleave', handleDragLeave);
picbox.addEventListener('drop', handleDrop);
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
  const items = dt.items;
  for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file'&& item.webkitGetAsEntry().isFile) {
          const file = item.getAsFile();
          if (file) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInput.files = dataTransfer.files;
              selfile();
          }
      } else {
         notify("文件夹不支持上传");
      }
  }
}