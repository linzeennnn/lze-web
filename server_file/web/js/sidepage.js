function creatsidepage(){const e=document.createElement("div");e.id="sidepage";const i=document.createElement("div");i.id="closeside",i.onclick=()=>openside();const r=document.createElement("div");r.id="side-top";const n=document.createElement("div");n.id="side-box";const s=document.createElement("div");s.className="side-btn",s.title="登陆",s.onclick=()=>loginwindow(),s.innerHTML='<div id="login"></div><span class="side-text">登陆</span>';const t=document.createElement("div");t.className="side-btn",t.id="theme-btn",t.title="主题布局",t.onclick=()=>showtheme(1),t.innerHTML='<div id="theme"></div><span class="side-text">主题</span>';const o=document.createElement("div");o.className="side-btn",o.title="系统监视器",o.onclick=()=>getsystem(1),o.innerHTML='<div id="system"></div><span class="side-text">系统</span>',n.appendChild(s),n.appendChild(t),n.appendChild(o),e.appendChild(i),e.appendChild(r),e.appendChild(n),e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div"));const a=document.createElement("div");a.id="blur-page",a.onclick=()=>openside(),document.body.appendChild(e),document.body.appendChild(a)}creatsidepage();const sidepage=document.getElementById("sidepage"),blurpage=document.getElementById("blur-page");function openside(e){e==1?(document.body.style.overflow="hidden",sidepage.style.display="flex",setTimeout(()=>{sidepage.style.left="0",blurpage.style.display="block"},10)):(sidepage.style.left="",blurpage.style.display="",setTimeout(()=>{document.body.style.overflow="",sidepage.style.display=""},1e3))}