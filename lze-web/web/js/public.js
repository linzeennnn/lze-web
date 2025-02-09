let winstatus=0,curwin;
const protocol = window.location.protocol === 'file:' ? '${protocol}' : window.location.protocol;
let user=localStorage.getItem("user");
let token=localStorage.getItem("token");
let ip=window.location.hostname;
if(!user){
    user='visitor';
}
// notify
function notify(text) {
    const notify = document.createElement('div');
    notify.id = 'notify';
    const notifytext = document.createElement('span');
    notifytext.id = 'notifytext';
    notifytext.innerText = text;
    notify.appendChild(notifytext);
    document.body.appendChild(notify);
    setTimeout(function () {
      notify.style.opacity = '1';
      notify.style.top='5px';
    }, 10);
    setTimeout(function () {
      notify.style.opacity = '';
      setTimeout(function () {
        document.body.removeChild(notify);
      }, 1000);
    }, 1000);
  }
// token验证
async function auth(){
    const auth = {
        name: user,
        token: token
    };
    try {
        const response = await fetch(`${protocol}//${ip}/server/login/auth_status.cgi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(auth)
        });

        if (response.status==401) {
            notify("登陆过期");
            log_out();
            throw new Error(`错误`);
        }
       else if (!response.ok) {
        notify(`${response.status}错误`);
        log_out();
        throw new Error(`HTTP 错误！状态码: ${response.status}`);
        }
        else
        {
            notify("登陆用户"+user)
        }
    } catch (error) {
        console.error("请求失败:", error);
        return null;
    }
}
if(user!="visitor"){
auth();
}
else{
    notify("访客登陆")
}
// 颜色
const metacolor = {
    dark: {
        default: "#242424",
        green: "#18201b",
        blue: "#181c20",
        yellow: "#202018",
        orange: "#201d18",
        pink: "#201820",
        red: "#201818"
    },
    light: {
        default: "#747474",
        green: "#8eb79d",
        blue: "#8e9fb7",
        yellow: "#b7ad8e",
        orange: "#b79f8e",
        pink: "#b78eab",
        red: "#b78e8e"
    }
};
let color = localStorage.getItem('color') || 'default';
let mode = localStorage.getItem('mode') || 'dark';
// tooltip
if (window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);
    document.addEventListener('mousemove', (event) => {
        const tipwidth = tooltip.offsetWidth;
        const tipheight = tooltip.offsetHeight;
        const x = event.clientX;
        const y = event.clientY;
        let newX = x + 20;
        let newY = y - 30;
        if (window.innerWidth - x < 150) {
            newX = x - tipwidth - 20;
        }
        if (y < 60) {
            newY = y + tipheight - 20;
        }
        tooltip.style.left = `${newX}px`;
        tooltip.style.top = `${newY}px`;
        const target = event.target.closest('[title], [tip-title]');
        if (target) {
            if (target.hasAttribute('title') && !target.hasAttribute('tip-title')) {
                const titleValue = target.getAttribute('title');
                target.setAttribute('tip-title', titleValue);
                target.removeAttribute('title');
                tooltip.innerText = titleValue;
            } else if (target.hasAttribute('tip-title')) {
                tooltip.innerText = target.getAttribute('tip-title');
            }
            tooltip.style.display = '';
            setTimeout(function () {
                tooltip.style.opacity = '1';
            }, 500)
        }
    });
    document.addEventListener('mouseout', (event) => {
        const target = event.target.closest('[title], [tip-title]');
        if (target) {
            tooltip.innerText = '';
            tooltip.style.display = 'none';
            tooltip.style.opacity = '';
        }
    });
}
//   创建窗口
function newwindow(window, status) {
    switch (status) {
        case 1:
            winstatus=1;
            window.className = 'window';
            window.addEventListener('mousedown', function() {
                winlevel(window);
            });
            const close = document.createElement('div');
            close.onclick = () => newwindow(window, 0);
            close.className = 'close-win';
            close.title='关闭';
            window.appendChild(close);
            document.body.appendChild(window);
            window.style.top = `100px`;
            let shiftX, shiftY;
            window.onmousedown = function (event) {
                shiftX = event.clientX - window.getBoundingClientRect().left;
                shiftY = event.clientY - window.getBoundingClientRect().top;
                function moveAt(pageX, pageY) {
                    window.style.left = pageX - shiftX + 'px';
                    window.style.top = pageY - shiftY + 'px';
                }
                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }
                document.addEventListener('mousemove', onMouseMove);
                window.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove);
                    window.onmouseup = null;
                };
            };
            window.ondragstart = function () {
                return false;
            };
            window.style.display = 'flex';
            setTimeout(() => {
                window.style.opacity = '1';
            }, 10);
            break;
        case 0:
            document.body.removeChild(window);
            window=null;
            winstatus=0;
            break;
    }
}
// 设置windowzindex
function winlevel(window){
    window.style.zIndex = '16'; 
    if(curwin&&curwin!=window){
    curwin.style.zIndex='';
    }
    curwin=window;
}