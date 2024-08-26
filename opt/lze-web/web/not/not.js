let darkcolor;
let lightcolor
darkcolor='#271f25';
lightcolor='#6b9683';
const titbar =document.getElementById('tit-bar');
const wordbar=document.getElementById('word-bar');
let oldtitle;
let editstatus=0;
// scroll
    function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '15%';
          document.getElementById('top-bar').style.top = '10px';
          document.getElementById('top-bar').style.marginLeft = '20%';
          document.getElementById('top-bar').style.width = '65%';
          document.getElementById('top-bar').style.backgroundColor = 'transparent';
          document.getElementById('top-bar').style.boxShadow = 'none';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('cover-bar').style.top = '0';
          document.getElementById('top-bar').style.backdropFilter = `none`;
          document.getElementById('top-bar').style.webkitBackdropFilter = `none`;
          
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
//  load 
     function comin(){
        creatnote();
        document.getElementById('allnote').style.right='0';
        document.getElementById('top-bar').style.top ='100px';
      document.querySelector('.backbtn').style.left = '5%';
    };

    window.onload = comin;
    function goBack() {
        document.getElementById('allnote').style.right='';
        document.getElementById('top-bar').style.top ='';
        document.getElementById('cover-bar').style.top = `-80px`;
      document.querySelector('.backbtn').style.left = '';
      document.getElementById('top-btn').style.bottom = `-5%`;
      document.querySelector('body').style.backgroundImage = `url(${wallpath}home_pc.svg)`;
      document.querySelector('.next').style.backgroundImage = `url(${wallpath}home_phone.svg)`;
    document.querySelector('.next').style.opacity ='1';  
        setTimeout(() => {
            window.location.replace(`../../index.html#${ip}`);
}, 1000); 
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
    const response = await fetch(`http://${ip}/code/Note/get_note.php?timestamp=${timestamp}`, fetchtoken());
    const noteFiles = await response.json();
    fetchnologin(response);
    return noteFiles;
}
    async function creatnote() {
        const notesContainer = document.getElementById('allnote');
        
        try {
            const noteFiles = await getnote();
            for (const file of Object.values(noteFiles)) {
                const title = file.replace(/\.[^/.]+$/, '');
                const filePath = `http://${ip}/file/Note/${file}`;
                const text = await readfile(filePath);
                const note = document.createElement('div');
                note.className = 'note';
                const titleSpan = document.createElement('span');
                titleSpan.className = 'title';
                titleSpan.innerText=title;
                titleSpan.title=title;
                note.appendChild(titleSpan);
                const textSpan = document.createElement('span');
                textSpan.className = 'text';
                textSpan.style.display='none';
                textSpan.innerText=text;
                note.appendChild(textSpan);
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
                copy.addEventListener('click',() =>copytext(note,text));
                note.appendChild(copy);
                const expend = document.createElement('div');
                expend.className = 'expend';
                expend.title='展开';
                expend.addEventListener('click',() => notedisplay(note,1));
                note.appendChild(expend);
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
                    reloadnote()
                    notify("已删除");
                    }}
            }
            );
                note.appendChild(del);
                notesContainer.appendChild(note);
            }
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
        if(action==1){
            edit.style.display = 'block';
            text.style.display = 'block';
            expend.style.display='none';
            close.style.display='block';
        }
        else if(action==0){
            edit.style.display = 'none';
            text.style.display = 'none';
            expend.style.display='block';
            close.style.display='none';
        }
    }
    // copy
    function copytext(note,text) {
        const copy = note.querySelector('.copy');
        navigator.clipboard.writeText(text).then(() => {
           copy.style.backgroundImage='url(../../icon/yes_green.svg)';
           notify("成功复制");
           setTimeout(() => {
            copy.style.backgroundImage='url(../../icon/copy_green.svg)';
        }, 2000); 
        }).catch((err) => {
            console.error('Failed to copy text to clipboard: ', err);
        });
    }
    // delete note
    async function delnote(fileName) {
        
        const formData = new FormData();
       formData.append('fileName', fileName);
       try {
           const response = await fetch(`http://${ip}/code/Note/delnote.php`, {
               method: 'POST',
               headers: {
                   'Authorization': 'Bearer ' + token,
               },
               body: formData
           });

           const result = await response.text();
           console.log(result);
           if (result==="success"){
           }
       } catch (error) {
           console.error('Error deleting note:', error);
       }
   }
    // newnote
    async function addnote(title,text,file) {
        if (title.innerText.includes('%') || title.innerText.includes('#')) {
            notify("标题包含非法字符(#或%)");
            return;
        }
        else if (title.innerText == ''){
            title.innerText="new note";
        }
        const formData = new FormData();
        formData.append('newTitle', title.innerText);
        formData.append('newContent', text.innerText);
        try {
            const response = await fetch(`http://${ip}/code/Note/${file}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData
            });
            const result = await response.text();
            fetchnologin(response);
            if (response.status != 401) {
                reloadnote();
                title.innerText='';
                text.innerText='';
                notify("保存成功");
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
            oldtitle=title.innerText;
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
            if(title.innerText===oldtitle){
            addnote(title,text,'save.php');
            }
            else{
            delnote(file);
            addnote(title,text,'addnote.php');
            }

            editstatus=0;
        }
    }
// reload note
function reloadnote(){
    document.getElementById('allnote').innerHTML = '';
                    creatnote();
}
