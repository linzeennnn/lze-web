let darkcolor;
let lightcolor
darkcolor='#281c1c';
lightcolor='#966969';
function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // 当垂直滚动超过100px时改变背景颜色
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
        
        // 当垂直滚动超过100px时改变背景颜色
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '15%';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.marginLeft = '20%';
          document.getElementById('top-bar').style.width = '65%';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.getElementById('top-bar').style.backdropFilter = `none`;
          document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('cover-bar').style.top = '0';
          
        } else {
            document.getElementById('top-btn').style.bottom = '';
          document.getElementById('top-bar').style.top= '100px';
          document.getElementById('top-bar').style.marginLeft = '';
          document.getElementById('top-bar').style.width = '80%';
          document.getElementById('top-bar').style.backgroundColor = '';
          document.getElementById('top-bar').style.boxShadow = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.querySelector('.backbtn').style.width = '';
          document.getElementById('cover-bar').style.top = '';
          document.getElementById('top-bar').style.backdropFilter = ``;
          document.getElementById('top-bar').style.webkitBackdropFilter = ``;
         
        }
}
window.addEventListener('scroll', handleScroll);
     function comin(){
        showNotes();
        document.getElementById('top-bar').style.top ='100px';
      document.querySelector('.backbtn').style.left = '5%';
        document.getElementById(`notes`).style.right='0px';
        loginstatus();
    };

    window.onload = comin;

function totop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth' // 添加平滑滚动效果
    });
  }
function goBack() {
    document.getElementById('cover-bar').style.top = `-80px`;
    document.getElementById('top-bar').style.top ='';
        document.getElementById(`notes`).style.right='';
      document.querySelector('.backbtn').style.left = '';
      document.getElementById('top-btn').style.bottom = `-5%`;
      document.querySelector('body').style.backgroundImage = `url(${wallpath}home.svg)`;
      document.querySelector('.next').style.backgroundImage = `url(${wallpath}home.svg)`;
    document.querySelector('.next').style.opacity ='1';  
        setTimeout(() => {
            window.location.replace(`../../index.html#${ip}`);
}, 1000); 
    }
    function reloadPage() {
  location.reload();
}
    async function readFile(file) {
        const response = await fetch(file);
        const text = await response.text();
        return text;
    }

    async function getNoteFiles() {
        const response = await fetch(`http://${ip}/code/Bookmark/bok_getFiles.php`,fetchtoken());
        const noteFiles = await response.json();
        xmlnologin(response);
        return noteFiles;
    }
    async function showNotes() {
            const notesContainer = document.getElementById('notes');

            try {
                const noteFiles = await getNoteFiles();

                for (const file of Object.values(noteFiles)) {
                    const linkname = file.replace(/\.[^/.]+$/, '');
                    const filePath = `http://${ip}/file/Bookmark/${file}`;
                    const content = await readFile(filePath);
                    const noteElement = document.createElement('div');
                    noteElement.className = 'note-element';
                    noteElement.innerHTML = `
                        <h3>${linkname}</h3>
                        <div class="delete-btn" onclick="deleteNote('${file}')"></div>
                        <div class="open-page-btn" >
                            </div>
                    `;

                    noteElement.addEventListener('click', async function(event) {
                        const target = event.target;
                        let iframeSrc;
                        if (file.endsWith('.bok')) {
                            iframeSrc = content.startsWith('http') ? content : `http://${content}`;
                        }
                       else{
                         iframeSrc = content.startsWith('http') ? content : `${filePath}`;
                       }     
                        if (target.classList.contains('delete-btn') || target.classList.contains('open-page-btn') || target.classList.contains('iframe-delete-btn')) {
                            return;
                        }

                        const iframeContainer = noteElement.querySelector('.iframe-container');
                        if (!iframeContainer) {
                            openPage(iframeSrc);
                            
                            
                        }
                    });

                    noteElement.querySelector('.open-page-btn').addEventListener('click', function() {
                        createIframe(noteElement, content, filePath, file);
                        
                    });
                    noteElement.querySelector('.open-page-btn').addEventListener('click', function() {
                    this.style.display = 'none'; // 隐藏当前书签的打开网页按钮
                });

                    notesContainer.appendChild(noteElement);
                }
            } catch (error) {
                console.error('Error reading files:', error);
            }
        }
        function openPage(url) {
            window.location.href = url;
        }
   

   

        function createIframe(container, content,filePath ,file) {

            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'iframe-container';

            let iframeSrc;
                        if (file.endsWith('.bok')) {
                            iframeSrc = content.startsWith('http') ? content : `http://${content}`;
                        }
                       else{
                         iframeSrc = content.startsWith('http') ? content : `${filePath}`;
                       }    
            iframeContainer.innerHTML = `
                <iframe src="${iframeSrc}" style="width:100%; height:500px;"></iframe>
                <div class="iframe-delete-btn" onclick="closeIframe(this)"></div>
            `;
            

            container.appendChild(iframeContainer);
        }
        function closeIframe(button) {
        const iframeContainer = button.parentElement;
        const noteElement = iframeContainer.parentElement;
        const openPageBtn = noteElement.querySelector('.open-page-btn');
        if (openPageBtn) {
            openPageBtn.style.display = 'inline-block'; // 显示打开网页按钮
        }
        iframeContainer.remove();
    }



// JavaScript函数用于显示添加新便签的表单
function showAddNoteForm() {
    const newTitleElement = document.getElementById('tit-bar');
    const newTitle = newTitleElement.innerText;
        if (newTitle.includes('%') || newTitle.includes('#')) {
            alert('标题包含非法字符(#或%)，删除该字符后再输入。');
            return;
          
        }
        else if (newTitle == ''){
            alert('请输入标题');
            return;
        }
 

    // 创建文本区域元素
    const newContentElement = document.getElementById('word-bar');
        
        const newContent = newContentElement.innerText;
        addNewNoteRequest(newTitle, newContent);
        newContentElement.innerText ='';
        newTitleElement.innerText ='';
}





   // 异步函数，用于向服务器发送添加新便签的请求
async function addNewNoteRequest(newTitle, newContent) {
    const formData = new FormData();
    formData.append('newTitle', newTitle);
    formData.append('newContent', newContent);

    try {
        const response = await fetch(`http://${ip}/code/Bookmark/bok_addNote.php`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        const result = await response.text();
        console.log(response.status);
        xmlnologin(response);
        if (response.status != 401) {
            document.getElementById('notes').innerHTML = '';
            notify("添加成功");
            showNotes();
        }
    } catch (error) {
        console.error('Error adding new note:', error);
    }
}

    // JavaScript函数用于删除便签
    function deleteNote(fileName) {
        if (confirm('确定要删除这个书签吗？')) {
            // 发送删除请求
            deleteNoteFile(fileName);
            notify("删除成功");
        }
    }

    // 异步函数，用于删除便签文件
    async function deleteNoteFile(fileName) {
        const formData = new FormData();
        formData.append('fileName', fileName);

        try {
            const response = await fetch(`http://${ip}/code/Bookmark/bok_deleteNote.php`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            const result = await response.text();
            console.log(result);

            // 重新加载便签
            document.getElementById('notes').innerHTML = '';
            showNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

  function selfile() {
  var files = document.getElementsByTagName('input')[0].files;
  if (files.length === 0) {
    notify("请先选择文件");
    return;
  }
  document.getElementById('word-bar').style.display='none';
  document.getElementById('progress').style.display='block';
  var fd = new FormData();
  for (var i = 0; i < files.length; i++) {
    fd.append('pic[]', files[i]);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://${ip}/code/Bookmark/upload.php`, true);
  xmltoken(xhr);
  xhr.upload.onprogress = function(ev) {
    if (ev.lengthComputable) {
      var percent = 100 * ev.loaded / ev.total;
      var percentElement = document.getElementById('percent');
      document.getElementById('bar').style.width = percent + '%';
      percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
    }
  };

  xhr.onload = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) { // 请求已完成
        xmlnologin(xhr);
        if (xhr.status!= 401){
        notify("添加成功");
        document.getElementById('notes').innerHTML='';
        showNotes();
        document.getElementById('word-bar').style.display='block';
  document.getElementById('progress').style.display='none';
        }
  }
  };

  xhr.send(fd);
  
}