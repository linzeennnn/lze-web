async function widget(type) {
    let doc = [1, 2, 3].map(i => document.getElementById(`doc-li${i}`));
    let not = [1, 2, 3].map(i => document.getElementById(`not-li${i}`));
    let mon = [1, 2, 3].map(i => document.getElementById(`mon-li${i}`));
    let pic = document.getElementById(`pic`);
    let img = document.getElementById(`img`);
    let tra = document.getElementById(`tra-li`);
    let bok = document.getElementById(`bok-li`);
    let disktext = document.getElementById(`disk-li`);
    let diskbar = document.getElementById(`disk-bar`);
    try {
        let response = await fetch(`${protocol}//${ip}/code/home/widget.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${type}`,
        });
        let data = await response.json();
        if (type == 'all' || type == 'doc') {
            doc.forEach((el, index) => {
                el.innerText = data[`doc${index + 1}`];
                el.title = "下载:"+data[`doc${index + 1}`];
                el.style.display = '';
            });
        }
        if (type == 'all' || type == 'pic') {
            img.src = `${protocol}//${ip}/file/Pictures/${data.pic1}`;
            pic.title="预览:"+data.pic1;
            pic.style.display='';
        }
        if (type == 'all' || type == 'not') {
            not.forEach((el, index) => {
            el.innerText = removeext(data[`not${index + 1}`]); 
            el.title = removeext(data[`not${index + 1}`]); 
            el.style.display = '';
        });            
        }
        if (type == 'all' || type == 'bok') {
            bok.innerText = removeext(data.bok1); 
            bok.title = removeext(data.bok1);
            bok.style.display='';
        }
        if (type == 'all' || type == 'tra') {
            tra.innerText = data.tra1;
            tra.style.display='';
        }
        if (type == 'all' || type == 'mon') {
            mon.forEach((el, index) => {
                el.innerText = data[`mon${index + 1}`];
                el.title="进程"+data[`mon${index + 1}`];
        });
            mon.forEach((el, index) => el.style.display = '');
        }
        if (type == 'all') {
            let used = data.used;
            let tol = data.total;
            disktext.innerText = (used / Math.pow(10, 6)).toFixed(2) + "G /" + (tol / Math.pow(10, 6)).toFixed(2) + "G";
            diskbar.style.width = (used / tol * 100) + '%';
        }
    } catch (error) {
        console.error('发生错误:', error);
    }
}
// 去除后缀名
function removeext(name){
    return name.substring(0,name.lastIndexOf('.'));
}
// 宽度
const app = document.querySelectorAll('.app');
const widgetwid = new ResizeObserver(entries => {
    entries.forEach(entry => {
        // 检查每个 'app' 元素的宽度
        if (entry.contentRect.width < 400) {
            const panel = entry.target.querySelectorAll('.panel');
            panel.forEach(panel => {
                panel.style.display = 'none';
            });
        } else {
            const panel = entry.target.querySelectorAll('.panel');
            panel.forEach(panel => {
                panel.style.display = '';
            });
        }
    });
});
app.forEach(app => {
    widgetwid.observe(app);
});
// panel 点击
const panel = document.querySelectorAll('.panel');
panel.forEach(panel => {
    panel.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
// widget page
function widpage(status,object){
    switch(status){
        case 1:
        const page = document.createElement('div');
        page.classList.add('widget-page');
        page.classList.add('option-page');
        page.setAttribute('onclick', "widpage(0)");
        object.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        page.appendChild(object);
        document.body.appendChild(page);
        break;
        case 0:
            document.body.removeChild(document.querySelector('.widget-page'));
        break;
    }
}
// pic
function pic(){
        const prepic= document.createElement('img');
        prepic.id='pre-pic';
        prepic.src=document.getElementById('img').src;
        widpage(1,prepic);
}
// not
function not(note){
        const file=note.innerText+".txt";
        const prenot= document.createElement('div');
        const loading = document.createElement('div');
        const text = document.createElement('span');
        loading.classList.add('loading');
        prenot.id='pre-note';
        prenot.appendChild(text);
        prenot.appendChild(loading);
        widpage(1,prenot);
        fetch(`${protocol}//${ip}/file/Note/${file}`)
  .then(response => {
    return response.text(); 
  })
  .then(data => {
    text.innerText=data;
    loading.style.display='none';
  })
  .catch(error => {
    notify(error);
  });
}
// bok
function bok(book){
    const file=book.innerText+".bok";
    const prebok= document.createElement('div');
    const loading = document.createElement('div');
    loading.classList.add('loading');
    prebok.id='pre-bok';
    prebok.appendChild(loading);
    widpage(1,prebok);
    fetch(`${protocol}//${ip}/file/Bookmark/${file}`)
.then(response => {
return response.text(); 
})
.then(data => {
loading.style.display='none';
window.location.href = data;
})
.catch(error => {
notify(error);
});
}
// doc
function doc(docu){
    let file=docu.innerText;
    if (file.endsWith('/')) {
        const predoc= document.createElement('div');
        const loading = document.createElement('div');
        loading.classList.add('loading');
        predoc.id='pre-doc';
        predoc.appendChild(loading);
        widpage(1,predoc);
        file = file.slice(0, -1);
        downfolder(file,file)
    } 
    else {
        window.location.href = `${protocol}//${ip}/code/Documents/doc_download.php?file=${file}&folder=`;
    }
}