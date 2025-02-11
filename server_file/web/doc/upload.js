function uploadFolder(){ifroot();let n;const s=document.getElementById("uploadfolder"),e=s.files;if(e.length===0)return;loading(1),showupload(0);const r=e.length;let o=0,i=0,a=0,t=!0;for(let t of e){let n;t.size<=100*1024*1024?n=20*1024*1024:t.size>100*1024*1024&&t.size<=500*1024*1024?n=50*1024*1024:t.size>500*1024*1024&&t.size<=1024*1024*1024?n=100*1024*1024:t.size>1024*1024*1024&&t.size<=3*1024*1024*1024?n=200*1024*1024:n=300*1024*1024,o+=Math.ceil(t.size/n)}const c=document.getElementById("percent"),l=()=>{const e=i/o*100;document.getElementById("bar").style.width=e+"%",c.innerHTML=parseInt(e)+"%"},d=(s,o)=>{let c;s.size<=100*1024*1024?c=20*1024*1024:s.size>100*1024*1024&&s.size<=500*1024*1024?c=50*1024*1024:s.size>500*1024*1024&&s.size<=1024*1024*1024?c=100*1024*1024:s.size>1024*1024*1024&&s.size<=3*1024*1024*1024?c=200*1024*1024:c=300*1024*1024;let h=0,d=0;const u=h=>{if(!t)return;const f=Math.min(h+c,s.size),p=s.slice(h,f),g=s.webkitRelativePath;o===0&&h===0&&(n=e[0].webkitRelativePath.split("/")[0]);const m=new FormData;m.append("file",p),m.append("name",s.name),m.append("relativePath",g),m.append("start",h),m.append("chunkIndex",d),m.append("total",s.size),m.append("token",token),m.append("user",user),m.append("last",f>=s.size?1:0),fetch(`${protocol}//${ip}/server/doc/upload_folder.cgi`,{method:"POST",body:m}).then(e=>{if(e.status===401)throw notify("无新建文件夹权限"),loading(0),t=!1,new Error("未授权访问");return e.text()}).then(e=>{if(!t)return;i++,l(),d++,f<s.size?u(f):(a++,a===r&&(loading(0),movefolder(n,nowpath)))}).catch(e=>{console.error("上传失败:",e),t=!1})};u(h)};for(let n=0;n<e.length;n++){if(!t)break;d(e[n],n)}s.value=""}function getChunkSize(e){return e<=100*1024*1024?20*1024*1024:e<=500*1024*1024?50*1024*1024:e<=1024*1024*1024?100*1024*1024:e<=3*1024*1024*1024?200*1024*1024:300*1024*1024}function movefolder(e,t){fetch(`${protocol}//${ip}/server/doc/move_folder.cgi`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,path:t})}).then(e=>e.text()).then(e=>{notify("上传完成"),loadFolder(removeslash(t))}).catch(e=>{notify(e)})}function selfile(){ifroot();var t,n,s,o,e=fileInput.files;if(e.length===0){notify("请先选择文件");return}showupload(0),s=20*1024*1024,t=e.length,o=Array(t).fill(0),n=Array(t).fill(0);for(let n=0;n<t;n++){if(e[n].size===0){notify(`${e[n].name} 是空文件，上传失败`);return}o[n]=Math.ceil(e[n].size/s)}loading(1);function i(a){if(a>=t){loading(0),document.getElementsByTagName("input")[0].value="";return}var c=e[a],l=n[a]*s,d=Math.min(l+s,c.size),u=c.slice(l,d),r=new FormData;r.append("file",u),r.append("fileName",c.name),r.append("totalChunks",o[a]),r.append("currentChunk",n[a]),r.append("nowpath",nowpath),r.append("token",token),r.append("user",user),fetch(`${protocol}//${ip}/server/doc/upload_file.cgi`,{method:"POST",body:r}).then(e=>{if(e.status===200)n[a]++,n[a]<o[a]?i(a):(notify(`文件 ${c.name} 上传成功`),loadFolder(removeslash(nowpath)),i(a+1));else throw e.status===401?(notify("没有上传文件权限"),loading(0),new Error("未授权访问")):(notify(`${e.status}错误`),loading(0),new Error(`HTTP 错误 ${e.status}`))}).catch(e=>{console.error("上传发生错误:",e),loading(0)})}i(0)}const folderinput=document.getElementById("uploadfolder"),fileInput=document.getElementById("uploadfile"),uploadarea=document.getElementById("upload-area"),filelist=document.getElementById("fileListContainer");document.addEventListener("dragover",handleDragOver),document.addEventListener("dragleave",handleDragLeave),document.addEventListener("drop",handleDrop),filelist.addEventListener("dragover",handleDragOver),filelist.addEventListener("dragleave",handleDragLeave),filelist.addEventListener("drop",handleDrop);function handleDragOver(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity="1"}function handleDragLeave(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity=""}function handleDrop(e){e.stopPropagation(),e.preventDefault(),uploadarea.style.opacity="";const t=e.dataTransfer,s=t.files,n=t.items;for(let e=0;e<n.length;e++){const t=n[e];if(t.kind==="file"&&t.webkitGetAsEntry().isFile){{const e=t.getAsFile();if(e){const t=new DataTransfer;t.items.add(e),fileInput.files=t.files,selfile()}}}else notify("文件夹自己去手动上传")}}