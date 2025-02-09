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
            document.getElementById('top-btn').style.bottom = '7%';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.marginLeft = '20%';
          document.getElementById('top-bar').style.width = '65%';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('cover-bar').style.top = '0';
          
        } else {
            document.getElementById('top-btn').style.bottom = '';
          document.getElementById('top-bar').style.top= '';
          document.getElementById('top-bar').style.marginLeft = '';
          document.getElementById('top-bar').style.width = '80%';
          document.getElementById('top-bar').style.backgroundColor = '';
          document.getElementById('top-bar').style.boxShadow = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.querySelector('.backbtn').style.width = '';
          document.getElementById('cover-bar').style.top = '';
         
        }
}
window.addEventListener('scroll', handleScroll);
     function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '15%';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.getElementById('top-bar').style.backdropFilter = `none`;
          document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
          document.querySelector('.backbtn').style.left = '1%';
          document.getElementById('cover-bar').style.top = '0';
          
        } else {
            document.getElementById('top-btn').style.bottom = '';
          document.getElementById('top-bar').style.top= '100px';
          document.getElementById('top-bar').style.backgroundColor = '';
          document.getElementById('top-bar').style.boxShadow = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.getElementById('cover-bar').style.top = '';
          document.getElementById('top-bar').style.backdropFilter = ``;
          document.getElementById('top-bar').style.webkitBackdropFilter = ``;
         
        }
}
window.addEventListener('scroll', handleScroll);
     function comin(){
        pageloading(1);
        getbok();
        theme(mode,"red")
        document.getElementById('top-bar').style.top ='100px';
        document.getElementById('option-bar').style.left='0';
        document.getElementById('option-bar').style.opacity='1';
      document.querySelector('.backbtn').style.left = '5%';
        document.getElementById(`notes`).style.right='0px';
    };

    window.onload = comin;

function totop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    });
  }
function goBack() {
            window.location.replace(`../../index.html#${ip}`);
    }
    function reloadPage() {
  location.reload();
}
    async function readFile(file) {
        const response = await fetch(file);
        const text = await response.text();
        return text;
    }
// 获取书签
async function getbok() {
    const bokbox=document.getElementById('bok-box');
    bokbox.innerHTML='';
    try {
        const response = await fetch(`${protocol}//${ip}/server/bok/list.cgi`); 
        if (!response.ok) {
           notify("获取失败");
        }
        const fileData = await response.json();
        const fileListElement = document.getElementById('fileList');
        fileData.forEach(file => {
            const bok = document.createElement('div');
            const tit=document.createElement('span');
            const del = document.createElement('div');
            titname=file.name.split('.').slice(0, -1).join('.') || file.name;
            bok.classList.add('bok');
            tit.classList.add('tit');
            del.classList.add('del');
            del.title="删除"+titname;
            bok.title="打开"+titname;
            tit.innerText=titname;
            del.addEventListener('click', function(event) {
                event.stopPropagation();
            });
            bok.addEventListener('click', function() {
                updatebok(file.name);
                if (!file.content.startsWith('http')) {
                    file.content = 'http://' + file.content;
                }
                window.location.href = file.content;                
            });
            del.addEventListener('click', function() {
                if (confirm(`确定要删除书签吗？`)) {
                delbok(file.name);
                }
            });
            bok.appendChild(tit);
            bok.appendChild(del);
            bokbox.appendChild(bok);
        });
        pageloading(0);
    } catch (error) {
        console.log(error);
        notify(error);
    }
}
// 标记最近访问
async function updatebok(name) {
    try {
        const response = await fetch(`${protocol}//${ip}/server/bok/recent.cgi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename: name }), 
        });
    } catch (error) {
        notify(error);
    }
}
// 删除
function delbok(name){
    pageloading(1);
    fetch(`${protocol}//${ip}/server/bok/del.cgi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(data => {
        notify("已删除")
       getbok();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// 新书签
function newbok() {
    pageloading(1);
    let tit=document.getElementById('tit-bar');
    let link=document.getElementById('word-bar');
    let name=tit.value;
    let text=link.innerText;
    name=tit.value+".bok";
    text=link.innerText;
    if(tit.value==''){
        name="new_bookmark.bok"
    }
    tit.value='';
    link.innerText='';
    fetch(`${protocol}//${ip}/server/bok/add.cgi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, text: text })
    })
    .then(data => {
        notify("添加成功");
       getbok();
    })
    .catch(error => {
        notify(error);
    });
}
