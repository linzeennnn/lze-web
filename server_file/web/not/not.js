const titbar=document.getElementById("tit-bar"),wordbar=document.getElementById("word-bar");let oldtitle,editstatus=0;function optionbar(e){const t=document.getElementById("option-bar"),n=document.getElementById("openbar");switch(e){case 0:allmove(e),optionstatus=0,n.style.display="block",t.style.left="",setTimeout(()=>{t.style.display="none"},1e3);break;case 1:allmove(e),optionstatus=1,t.style.display="",setTimeout(()=>{n.style.display="none",t.style.left="0"},10);break}}function allmove(e){const t=document.querySelectorAll(".main");switch(e){case 1:t.forEach(function(e){e&&(e.style.marginLeft="")});break;case 0:t.forEach(function(e){e.style.marginLeft="0"});break}}function handleScroll(){var e=window.scrollY||document.documentElement.scrollTop;e>100?(document.getElementById("top-btn").style.bottom="15%",document.getElementById("top-bar").style.top="10px",document.getElementById("top-bar").style.backgroundColor="transparent",document.getElementById("top-bar").style.boxShadow="none",document.querySelector(".backbtn").style.left="1%",document.getElementById("cover-bar").style.top="0",document.getElementById("top-bar").style.backdropFilter=`none`,document.getElementById("top-bar").style.webkitBackdropFilter=`none`):(document.getElementById("top-btn").style.bottom="",document.getElementById("top-bar").style.top="100px",document.getElementById("top-bar").style.backgroundColor="",document.getElementById("top-bar").style.boxShadow="",document.querySelector(".backbtn").style.left="5%",document.getElementById("cover-bar").style.top="",document.getElementById("top-bar").style.backdropFilter=``,document.getElementById("top-bar").style.webkitBackdropFilter=``)}window.addEventListener("scroll",handleScroll);function comin(){creatnote(),theme(mode,"pink"),document.getElementById("allnote").style.right="0",document.getElementById("top-bar").style.top="100px",document.getElementById("option-bar").style.left="0",document.getElementById("option-bar").style.opacity="1",document.querySelector(".backbtn").style.left="5%"}window.onload=comin;function goBack(){window.location.replace(`../../index.html#${ip}`)}function reloadPage(){location.reload()}async function readfile(e){const t=await fetch(e,{cache:"no-store"}),n=await t.text();return n}async function getnote(){const n=(new Date).getTime(),e=await fetch(`${protocol}//${ip}/server/not/list.cgi`),t=await e.json();return t}async function creatnote(){pageloading(1);const e=document.getElementById("allnote");try{const t=await getnote();for(const a of Object.values(t)){const m=a.replace(/\.[^/.]+$/,""),n=document.createElement("div");n.className="note";const s=document.createElement("input");s.className="title",s.value=m,s.title=m,s.disabled=!0,n.appendChild(s);const d=document.createElement("code");d.className="text",d.style.display="none",n.appendChild(d);const o=document.createElement("div");o.className="edit",o.title="编辑",o.style.display="none",o.addEventListener("click",()=>editnote(n,1)),n.appendChild(o);const r=document.createElement("div");r.className="save",r.addEventListener("click",()=>editnote(n,0,`${a}`)),r.style.display="none",n.appendChild(r);const c=document.createElement("div");c.className="copy",c.title="复制",c.style.display="none",n.appendChild(c);const l=document.createElement("div");l.className="expend",l.title="展开",l.addEventListener("click",()=>loadtext(n,a)),n.appendChild(l);const u=document.createElement("div");u.className="loading",n.appendChild(u),u.style.display="none";const i=document.createElement("div");i.className="close",i.title="合上",i.style.display="none",i.addEventListener("click",()=>notedisplay(n,0)),n.a,n.appendChild(i);const h=document.createElement("div");h.className="del",h.addEventListener("click",function(){if(editstatus!=0){notify("请先保存正在编辑的内容");return}confirm("确定要删除这个便签吗？")&&delnote(`${a}`)}),n.appendChild(h),e.appendChild(n)}pageloading(0)}catch(e){console.error("Error reading files:",e)}}function notedisplay(e,t){const n=e.querySelector(".text"),s=e.querySelector(".expend"),o=e.querySelector(".close"),i=e.querySelector(".edit"),a=e.querySelector(".copy");t==1?(i.style.display="block",n.style.display="block",s.style.display="none",o.style.display="block",a.style.display="block"):t==0&&(i.style.display="none",n.style.display="none",s.style.display="block",o.style.display="none",a.style.display="none")}function replaceNbspWithSpace(e){return e.replace(/\u00A0/g," ")}function copytext(e,t){const n=e.querySelector(".copy"),s=replaceNbspWithSpace(t);if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(()=>{n.style.backgroundImage="url(../../icon/yes_pink.svg)",notify("成功复制"),setTimeout(()=>{n.style.backgroundImage="url(../../icon/copy_pink.svg)"},2e3)}).catch(e=>{console.error("Failed to copy text to clipboard: ",e)});else{const e=document.createElement("textarea");e.value=s,document.body.appendChild(e),e.select();try{document.execCommand("copy"),n.style.backgroundImage="url(../../icon/yes_pink.svg)",notify("成功复制"),setTimeout(()=>{n.style.backgroundImage="url(../../icon/copy_pink.svg)"},2e3)}catch(e){console.error("Failed to copy text to clipboard: ",e)}document.body.removeChild(e)}}function delnote(e){pageloading(1),fetch(`${protocol}//${ip}/server/not/del.cgi`,{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({fileName:e,user,token})}).then(e=>{if(e.status===401)throw notify("无删除权限"),pageloading(0),new Error("未授权访问");if(!e.ok)throw notify(e.status+"错误"),pageloading(0),new Error("未授权访问");return e.text()}).then(e=>{reloadnote(),notify("已删除")}).catch(e=>{console.error(`Error deleting note: ${e.message}`)})}async function addnote(e,t,n){if(e.value.includes("%")||e.value.includes("#")){notify("标题包含非法字符(#或%)");return}e.value==""&&(e.value="new_note"),pageloading(1);const s={newTitle:e.value,newContent:t.innerText,user,token};try{const o=await fetch(`${protocol}//${ip}/server/not/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(o.ok)reloadnote(),e.value="",t.innerText="",notify("保存成功");else throw o.status==401?(e.value="",t.innerText="",notify("没有权限"),reloadnote(),new Error(o.status)):(e.value="",t.innerText="",notify(o.status+"错误"),reloadnote(),new Error(o.status))}catch(e){console.error("Error adding new note:",e)}}function editnote(e,t,n){const s=e.querySelector(".title"),o=e.querySelector(".text"),i=e.querySelector(".save"),a=e.querySelector(".edit");t==1?editstatus!=0?notify("请先保存正在编辑的内容"):(editstatus=1,oldtitle=s.value,s.disabled=!1,s.contentEditable="true",o.contentEditable="true",o.style.borderStyle="none",o.style.borderRadius="1em",s.style.boxShadow="var(--inshadow)",o.style.boxShadow="var(--inshadow)",a.style.display="none",i.style.display="block"):t==0&&(s.value===oldtitle?addnote(s,o,"save.cgi"):(delnote(n,0),addnote(s,o,"add.cgi")),editstatus=0)}async function loadtext(e){const n=e.querySelector(".text"),o=e.querySelector(".expend"),s=e.querySelector(".loading"),i=e.querySelector(".copy");if(n.innerHTML.trim()!=="")notedisplay(e,1);else{o.style.display="none",s.style.display="block";const t=e.querySelector(".title").value,a=`${protocol}//${ip}/file/Note/${t}.txt`;try{const t=await readfile(a);n.innerHTML=hljs.highlightAuto(t).value.replace(/\n/g,"<br>"),notedisplay(e,1),i.addEventListener("click",()=>copytext(e,t))}catch(e){console.error("Error loading text:",e)}finally{s.style.display="none"}}}function reloadnote(){document.getElementById("allnote").innerHTML="",creatnote()}async function selfile(){var e,t,n,o,i,s=document.getElementsByTagName("input")[0].files;if(s.length===0){notify("请先选择文件");return}document.getElementById("word-bar").style.display="none",document.getElementById("progress").style.display="block",t=new FormData,t.append("user",user),t.append("token",token);for(n=0;n<s.length;n++){if(e=s[n],e.size>1024*1024){notify("文件不能超过2MB");return}e.name.endsWith(".txt")?t.append("new_note",e):(o=e.name+".txt",i=new File([e],o,{type:e.type}),t.append("new_note",i))}try{const e=await fetch(`${protocol}//${ip}/server/not/upload.cgi`,{method:"POST",body:t});if(e.ok)notify("添加成功"),reloadnote();else throw e.status==401?(notify("没有上传权限"),reloadnote(),new Error(e.status)):(notify(e.status+"错误"),reloadnote(),new Error(e.status))}catch(e){console.log(e.message)}finally{document.getElementsByTagName("input")[0].value="",document.getElementById("word-bar").style.display="block",document.getElementById("progress").style.display="none"}}document.addEventListener("paste",function(e){e.preventDefault();const t=e.clipboardData.getData("text/plain");document.execCommand("insertText",!1,t)})