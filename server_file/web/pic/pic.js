let uploadpath,nowpath="/",fullPath,editmode=0,pagenum,phonum,vidnum,curpage,pagetype;const pagedis=document.getElementById("page-display"),bigpic=document.getElementById("bigpic"),lastpic=document.getElementById("last-btn"),nextpic=document.getElementById("next-btn"),picpage=document.getElementById("bigpic-page");function optionbar(e){const t=document.getElementById("option-bar"),n=document.getElementById("openbar");switch(e){case 0:allmove(e),optionstatus=0,n.style.display="block",t.style.left="",setTimeout(()=>{t.style.display="none"},1e3);break;case 1:allmove(e),optionstatus=1,t.style.display="",setTimeout(()=>{n.style.display="none",t.style.left="0"},10);break}}function allmove(e){const t=document.querySelectorAll(".main");switch(e){case 1:t.forEach(function(e){e&&(e.style.marginLeft="")});break;case 0:t.forEach(function(e){e.style.marginLeft="0"});break}}function handleScroll(){var e=window.scrollY||document.documentElement.scrollTop;e>100?(document.getElementById("top-btn").style.bottom="200px",document.querySelector(".backbtn").style.left="1%",document.getElementById("top-bar").style.boxShadow="none",document.getElementById("top-bar").style.top="10px",document.getElementById("top-bar").style.backgroundColor="transparent",document.getElementById("cover-bar").style.top="0",document.getElementById("top-bar").style.backdropFilter=`none`,document.getElementById("top-bar").style.webkitBackdropFilter=`none`):(document.getElementById("top-btn").style.bottom="",document.querySelector(".backbtn").style.left="5%",document.getElementById("top-bar").style.boxShadow="",document.getElementById("top-bar").style.top="77px",document.getElementById("top-bar").style.backgroundColor="",document.getElementById("cover-bar").style.top="",document.getElementById("top-bar").style.backdropFilter=``,document.getElementById("top-bar").style.webkitBackdropFilter=``)}window.addEventListener("scroll",handleScroll);function comin(){loadFolder(),theme(mode,"blue"),document.querySelector(".backbtn").style.left="5%",document.getElementById("fileListContainer").style.opacity="1",document.getElementById("option-bar").style.left="0",document.getElementById("option-bar").style.opacity="1",document.getElementById("top-bar").style.top=`77px`}window.onload=comin;function goBack(){window.location.replace(`../../index.html#${ip}`)}function loading(e){const a=document.getElementById("uploadfile"),r=document.getElementById("uploadfolder"),t=document.getElementById("loading"),n=document.getElementById("rotate-box"),c=document.getElementById("load-text"),s=document.getElementById("upButton"),o=document.getElementById("currentPath"),i=document.getElementById("progress");switch(e){case 1:if(a.files.length===0&&r.files.length===0){notify("请先选择一个文件进行上传");return}o.style.display="none",s.style.display="none",i.style.display="block",t.style.display="block",n.style.display="block";break;case 0:o.style.display="",s.style.display="",i.style.display="none",t.style.display="none",n.style.display="none";break}}function pathlen(e,t){const i=e.offsetWidth,n=document.createElement("span");n.style.visibility="hidden",n.style.position="absolute",n.style.font=window.getComputedStyle(e).font,n.innerText="字",document.body.appendChild(n);const a=n.offsetWidth;document.body.removeChild(n);const s=Math.floor(i/a);let o=t;t.length>s&&e.id==="currentPath"?o="..."+t.slice(-s):t.length>s&&(o=t.slice(0,s)+"..."),e.innerText=o}async function loadFolder(e=""){pageloading(1),curpage=1;try{const c=await fetch(`${protocol}//${ip}/server/pic/list.cgi`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({folder:e})}),t=await c.json();let s=0,o=0;phonum=1,vidnum=1;const i=document.getElementById("oth-list"),a=document.getElementById("pic-box");a.innerHTML="",i.innerHTML="";const r=document.getElementById("currentPath");fullPath=(t.currentFolder?t.currentFolder:"")+"/",pathlen(r,fullPath),r.title=fullPath;const l=t.file_list[0];for(const[n,r]of Object.entries(l)){if(r==="file"||r==="link_file"){const r=document.createElement("div"),t=document.createElement("div");t.classList.add("pic"),r.classList.add("load-loop");let i;t.addEventListener("click",function(){openpic(1,e+"/"+n)}),isvideo(n)==1?(t.classList.add("video"),i=document.createElement("video"),o%9==0&&o!=0&&vidnum++,t.classList.add(`vid-page${vidnum}`),o++):(t.classList.add("photo"),i=document.createElement("img"),s%9==0&&s!=0&&phonum++,t.classList.add(`pho-page${phonum}`),s++),i.setAttribute("loading","lazy"),i.draggable=!1,t.title="查看"+n,i.src=`${protocol}//${ip}/file/Pictures/${e}/${n}`,t.append(r),t.append(i),a.appendChild(t),i.onload=function(){r.style.display="none"},i.addEventListener("loadeddata",function(){r.style.display="none"})}if(r==="folder"||r==="link_dir"){const e=document.createElement("div");e.classList.add("folder"),e.innerText=n,e.title=n,e.addEventListener("click",function(e){if(e.stopPropagation(),e.target.isContentEditable)return;loadFolder(t.currentFolder?t.currentFolder+"/"+n:n)}),i.appendChild(e)}}pageloading(0);const n=document.getElementById("upButton");t.currentFolder&&t.currentFolder!==""?(n.style.display="block",n.dataset.parentFolder=t.parentFolder,n.style.pointerEvents="auto"):n.style.pointerEvents="none",pagenum=phonum,showpic("pho")}catch(e){console.error("Error loading folder:",e),pageloading(0)}}function goUp(){const e=document.getElementById("upButton"),t=e.dataset.parentFolder;loadFolder(t)}function ifroot(){fullPath=="/"?nowpath="":nowpath=fullPath}function removeslash(e){return e.endsWith("/")?e.slice(0,-1):e}function clickable(e){switch(e){case 0:document.body.style.pointerEvents="none";break;case 1:document.body.style.pointerEvents="auto";break}}function showoth(e){const t=document.getElementById("oth-list");t.style.display=="flex"||e==1?t.style.display="none":t.style.display="flex"}document.getElementById("oth-btn").addEventListener("click",function(e){e.stopPropagation()}),document.addEventListener("click",function(){showoth(1)});function isvideo(e){const t=[".mp4",".avi",".mov",".wmv",".mkv",".ts",".webm",".flv",".m4v",".3gp",".mpeg",".rmvb",".vob"],n=e.slice((e.lastIndexOf(".")-1>>>0)+2).toLowerCase();return t.includes(`.${n}`)?1:0}function displaypage(e,t,n){document.querySelectorAll(`.${n}-page${t}`).forEach(e=>{e.style.display="none"}),document.querySelectorAll(`.${n}-page${e}`).forEach(e=>{e.style.display="flex"}),t==0&&pagenumdis(curpage,pagenum)}function switchpage(e){switch(e){case 1:curpage<pagenum?(displaypage(curpage+1,curpage,pagetype),curpage++):notify("已是尾页");break;case 0:curpage>1?(displaypage(curpage-1,curpage,pagetype),curpage--):notify("已是首页");break}pagenumdis(curpage,pagenum)}function showpic(e){const t=document.querySelectorAll(`.photo`),n=document.querySelectorAll(`.video`);switch(e){case"pho":pagenum=phonum,document.querySelectorAll(`.video`).forEach(e=>{e.style.display="none"});break;case"vid":pagenum=vidnum,document.querySelectorAll(`.photo`).forEach(e=>{e.style.display="none"});break}curpage=1,pagetype=e,displaypage(curpage,0,e)}function pagenumdis(e,t){pagedis.innerText=e+"页/"+t+"页"}let scale=1;bigpic.addEventListener("wheel",e=>{e.preventDefault(),e.deltaY<0?scale+=.1:scale-=.1,scale=Math.min(Math.max(1,scale),3),bigpic.style.transform=`scale(${scale})`});let initialDistance=null;const handleTouchStart=e=>{e.touches.length===2&&(initialDistance=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY))},handleTouchMove=e=>{if(e.touches.length===2&&initialDistance!==null){const t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),n=t/initialDistance;scale*=n,scale=Math.min(Math.max(1,scale),3),bigpic.style.transform=`scale(${scale})`,initialDistance=t}};bigpic.addEventListener("touchstart",handleTouchStart),bigpic.addEventListener("touchmove",handleTouchMove);const pagebtn=[bigpic,lastpic,nextpic];pagebtn.forEach(e=>{e.addEventListener("click",e=>e.stopPropagation())});let picmap;function openpic(e,t){let n;switch(e){case 1:picpage.style.display="flex",pagetype=="pho"?n=document.createElement("img"):(n=document.createElement("video"),n.controls=!0,n.autoplay=!0),n.id="page-pic",n.draggable=!1,n.src=`${protocol}//${ip}/file/Pictures/${t}`,bigpic.appendChild(n),pagetype=="pho"?picmap=Array.from(document.querySelectorAll("img")).filter(e=>e.offsetWidth>0&&e.offsetHeight>0).map(e=>e.src):picmap=Array.from(document.querySelectorAll("video")).filter(e=>e.offsetWidth>0&&e.offsetHeight>0).map(e=>e.src);break;case 0:bigpic.removeChild(document.getElementById("page-pic")),picpage.style.display="none";break}}function switchpic(e){let t=document.getElementById("page-pic").src;const n=picmap.indexOf(t);switch(e){case 1:n<picmap.length-1?t=picmap[n+1]:t=picmap[0];break;case 0:n>0?t=picmap[n-1]:t=picmap[picmap.length-1];break}document.getElementById("page-pic").src=t}function selfile(){ifroot();var t,n,s,o,e=fileInput.files;if(e.length===0){notify("请先选择文件");return}s=20*1024*1024,t=e.length,o=Array(t).fill(0),n=Array(t).fill(0);for(let n=0;n<t;n++){if(e[n].size===0){notify(`${e[n].name} 是空文件，上传失败`);return}o[n]=Math.ceil(e[n].size/s)}loading(1);function i(a){if(a>=t){loading(0);return}var c=e[a],l=n[a]*s,d=Math.min(l+s,c.size),u=c.slice(l,d),r=new FormData;r.append("file",u),r.append("fileName",c.name),r.append("totalChunks",o[a]),r.append("currentChunk",n[a]),r.append("nowpath",nowpath),r.append("user",user),r.append("token",token),fetch(`${protocol}//${ip}/server/pic/upload.cgi`,{method:"POST",body:r}).then(function(e){if(e.ok)e.text().then(function(){n[a]++,n[a]<o[a]?i(a):(i(a+1),notify(`文件 ${c.name} 上传成功`),loadFolder(removeslash(nowpath)))});else throw e.status===401?(notify(`没有上传相册权限`),loading(0),new Error("未授权访问")):(notify(`${e.status} 错误`),loading(0),new Error(e.status))}).catch(function(e){console.error("上传过程中发生错误:",e),loading(0)})}i(0)}const fileInput=document.getElementById("uploadfile"),uploadarea=document.getElementById("upload-area"),picbox=document.getElementById("pic-box");document.addEventListener("dragover",handleDragOver),document.addEventListener("dragleave",handleDragLeave),document.addEventListener("drop",handleDrop),picbox.addEventListener("dragover",handleDragOver),picbox.addEventListener("dragleave",handleDragLeave),picbox.addEventListener("drop",handleDrop);function handleDragOver(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity="1"}function handleDragLeave(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity=""}function handleDrop(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity="";const t=e.dataTransfer,s=t.files,n=t.items;for(let e=0;e<n.length;e++){const t=n[e];if(t.kind==="file"&&t.webkitGetAsEntry().isFile){{const e=t.getAsFile();if(e){const t=new DataTransfer;t.items.add(e),fileInput.files=t.files,selfile()}}}else notify("文件夹不支持上传")}}