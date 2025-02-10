const titbar =document.getElementById('tit-bar');
const wordbar=document.getElementById('word-bar');
let oldtitle;
let editstatus=0;
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
// scroll
    function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '15%';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.querySelector('.backbtn').style.left = '1%';
          document.getElementById('cover-bar').style.top = '0';
          document.getElementById('top-bar').style.backdropFilter = `none`;
          document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
          
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
//  load 
     function comin(){
        creatnote();
        theme(mode,"pink")
        document.getElementById('allnote').style.right='0';
        document.getElementById('top-bar').style.top ='100px';
        document.getElementById('option-bar').style.left='0';
        document.getElementById('option-bar').style.opacity='1';
      document.querySelector('.backbtn').style.left = '5%';
    };

    window.onload = comin;
    function goBack() {
            window.location.replace(`../../index.html#${ip}`);
    }
    function reloadPage() {
  location.reload();
}
// get note
async function readfile(file) {
    const response = await fetch(file, {
        cache: 'no-store'
    });
    const text = await response.text();
    return text;
}
async function getnote() {
    const timestamp = new Date().getTime(); // 获取当前时间戳
    const response = await fetch(`${protocol}//${ip}/server/not/list.cgi`);
    const noteFiles = await response.json();
    return noteFiles;
}
    async function creatnote() {
        pageloading(1);
        const notesContainer = document.getElementById('allnote');
        
        try {
            const noteFiles = await getnote();
            for (const file of Object.values(noteFiles)) {
                const title = file.replace(/\.[^/.]+$/, '');
                const note = document.createElement('div');
                note.className = 'note';
                const notetitle = document.createElement('input');
                notetitle.className = 'title';
                notetitle.value=title;
                notetitle.title=title;
                notetitle.disabled = true;
                note.appendChild(notetitle);
                const textcode = document.createElement('code');
                textcode.className = 'text';
                textcode.style.display='none';
                note.appendChild(textcode);
                const edit = document.createElement('div');
                edit.className = 'edit';
                edit.title='编辑';
                edit.style.display='none';
                edit.addEventListener('click',() => editnote(note,1));
                note.appendChild(edit);
                const save = document.createElement('div');
                save.className = 'save';
                save.addEventListener('click',() => editnote(note,0,`${file}`));
                save.style.display='none';
                note.appendChild(save);
                const copy = document.createElement('div');
                copy.className = 'copy';
                copy.title='复制';
                copy.style.display='none'
                note.appendChild(copy);
                const expend = document.createElement('div');
                expend.className = 'expend';
                expend.title='展开';
                expend.addEventListener('click',() => loadtext(note,file));
                note.appendChild(expend);
                const load =document.createElement('div');
                load.className = 'loading';
                note.appendChild(load);
                load.style.display='none';
                const close = document.createElement('div');
                close.className = 'close';
                close.title='合上';
                close.style.display='none';
                close.addEventListener('click', () => notedisplay(note, 0));
                note.a
                note.appendChild(close);
                const del = document.createElement('div');
                del.className = 'del';
                del.addEventListener('click',function(){
                    if(editstatus!=0){
                        notify("请先保存正在编辑的内容");
                        return;
                    }
                    else {
                    if (confirm('确定要删除这个便签吗？')) {
                        
                    delnote(`${file}`);
                    }}
            }
            );
                note.appendChild(del);
                notesContainer.appendChild(note);
            }

            pageloading(0);
        } catch (error) {
            console.error('Error reading files:', error);
        }
    }
    // note expend and close
    function notedisplay(note,action){
        const text = note.querySelector('.text');
        const expend =note.querySelector('.expend');
        const close =note.querySelector('.close');
        const edit =note.querySelector('.edit');
        const copy =note.querySelector('.copy');
        if(action==1){
            edit.style.display = 'block';
            text.style.display = 'block';
            expend.style.display='none';
            close.style.display='block';
            copy.style.display='block'
        }
        else if(action==0){
            edit.style.display = 'none';
            text.style.display = 'none';
            expend.style.display='block';
            close.style.display='none';
            copy.style.display='none'
        }
    }
    // copy
    function replaceNbspWithSpace(text) {
        return text.replace(/\u00A0/g, ' ');
    }
    
    function copytext(note, text) {
        const copy = note.querySelector('.copy');
    
        // 替换不间断空格
        const cleanedText = replaceNbspWithSpace(text);
    
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cleanedText).then(() => {
                copy.style.backgroundImage = 'url(../../icon/yes_pink.svg)';
                notify("成功复制");
                setTimeout(() => {
                    copy.style.backgroundImage = 'url(../../icon/copy_pink.svg)';
                }, 2000);
            }).catch((err) => {
                console.error('Failed to copy text to clipboard: ', err);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = cleanedText;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copy.style.backgroundImage = 'url(../../icon/yes_pink.svg)';
                notify("成功复制");
                setTimeout(() => {
                    copy.style.backgroundImage = 'url(../../icon/copy_pink.svg)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text to clipboard: ', err);
            }
            document.body.removeChild(textArea);
        }
    }
    // delete note
    function delnote(fileName, load) {
        pageloading(1);
        fetch(`${protocol}//${ip}/server/not/del.cgi`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName: fileName ,user,token})
        })
        .then(response => {
            if (response.status === 401) {
              notify("无删除权限")
              pageloading(0)
              throw new Error('未授权访问');
            }
            else if(!response.ok){
                notify(response.status+"错误")
                pageloading(0)
                throw new Error('未授权访问');
            }
            return response.text();  
          })
          .then(data => {
            reloadnote();
            notify("已删除");
          })
            .catch(error => {
                console.error(`Error deleting note: ${error.message}`);
            });
    }
    
    
    
    // newnote
    async function addnote(title, text, file) {
        if (title.value.includes('%') || title.value.includes('#')) {
            notify("标题包含非法字符(#或%)");
            return;
        }
        else if (title.value == '') {
            title.value = "new_note";
        }
        pageloading(1);
    
        const data = {
            newTitle: title.value,
            newContent: text.innerText,
            user,token
        };
    
        try {
                const response = await fetch(`${protocol}//${ip}/server/not/${file}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                reloadnote();
                title.value = '';
                text.innerText = '';
                notify("保存成功");
            }
            else if(response.status==401){
                title.value = '';
                text.innerText = '';
                notify("没有权限")
                reloadnote();
                throw new Error(response.status);
            }
            else{
                title.value = '';
                text.innerText = '';
                notify(response.status+"错误")
                reloadnote();
                throw new Error(response.status);
            }
        } catch (error) {
            console.error('Error adding new note:', error);
        }
    }
    
// edit note
    function editnote(note,status,file){
        const title=note.querySelector('.title');
        const text=note.querySelector('.text');
        const save=note.querySelector('.save');
        const edit=note.querySelector('.edit');
        if(status==1){
            if(editstatus!=0){
                notify("请先保存正在编辑的内容");
            }
            else{
                editstatus=1;
            oldtitle=title.value;
            title.disabled = false;
        title.contentEditable = 'true';
        text.contentEditable = 'true';
        text.style.borderStyle='none';
        text.style.borderRadius='1em';
        title.style.boxShadow='var(--inshadow)';
        text.style.boxShadow='var(--inshadow)';
        edit.style.display='none';
        save.style.display='block';}
        }
        else if(status==0){
            if(title.value===oldtitle){
            addnote(title,text,'save.cgi');
            }
            else{
            delnote(file,0);
            addnote(title,text,'add.cgi');
            }

            editstatus=0;
        }
    }
//load text from server 
async function loadtext(note, file) {

    const text = note.querySelector('.text');
    const expend = note.querySelector('.expend');
    const loading = note.querySelector('.loading');
    const copy = note.querySelector('.copy');
    // 判断text是否为空
    if (text.innerHTML.trim() !== '') {
        notedisplay(note, 1); // 如果非空，显示内容
    } else {
        expend.style.display = 'none'; // 隐藏展开按钮
        loading.style.display = 'block'; // 显示loading

        const title = note.querySelector('.title').value; // 获取标题
        const filePath = `${protocol}//${ip}/file/Note/${title}.txt`; // 构造文件路径

        try {
            const fileContent = await readfile(filePath); // 读取文件内容
            text.innerHTML = hljs.highlightAuto(fileContent).value.replace(/\n/g, '<br>');
            notedisplay(note, 1); // 显示内容
            copy.addEventListener('click', () => copytext(note, fileContent));
        } catch (error) {
            console.error('Error loading text:', error);
            // 处理错误情况，比如显示错误信息
        } finally {
            loading.style.display = 'none'; // 隐藏loading
        }
    }
}
// reload note
function reloadnote(){
    document.getElementById('allnote').innerHTML = '';
                    creatnote();
}
// upload file
function selfile() {
    var files = document.getElementsByTagName('input')[0].files;
    if (files.length === 0) {
        notify("请先选择文件");
        return;
    }

    document.getElementById('word-bar').style.display = 'none';
    document.getElementById('progress').style.display = 'block';
    var fd = new FormData();

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // 检查文件大小是否超过2MB
        if (file.size >  1024 * 1024) {
            notify("文件不能超过2MB");
            return;
        }

        // 检查后缀名
        if (file.name.slice(-4) !== '.txt') {
            var newFileName = file.name + '.txt';
            var newFile = new Blob([file], { type: file.type });
            newFile = new File([newFile], newFileName, { type: file.type });
            fd.append('new_note', newFile);
        } else {
            fd.append('new_note', file);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${protocol}//${ip}/server/not/upload.cgi`, true);
    xhr.upload.onprogress = function(ev) {
        if (ev.lengthComputable) {
            var percent = 100 * ev.loaded / ev.total;
            var percentElement = document.getElementById('percent');
            document.getElementById('bar').style.width = percent + '%';
            percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
        }
    };

    xhr.onload = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status != 401) {
                notify("添加成功");
                reloadnote();
                document.getElementById('word-bar').style.display = 'block';
                document.getElementById('progress').style.display = 'none';
            }
        }
    };

    xhr.send(fd);
}
// 纯文本粘贴
document.addEventListener('paste', function(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});


