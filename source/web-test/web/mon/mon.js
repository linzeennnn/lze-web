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
        get_data();
        theme(mode,"yellow")
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
// 获取配置
let time=null;
let monuser=user;
async function get_data() {
  if(!monuser)
    monuser='visitor';
  const save=document.getElementById("save");
    const monbox=document.getElementById("mon-box");
    const userbox=document.getElementById("user-box");
    const timebar=document.getElementById("time-bar");
    save.style.display='none';
    timebar.disabled = true;
    pageloading(1);
    userbox.innerHTML='';
    monbox.innerHTML='';
    if (timebar.classList.contains('edit')) {
      timebar.classList.remove('edit'); 
    }
    try {
      const response = await fetch(`${protocol}//${ip}/server/mon/list.cgi`);
      if (!response.ok) {
        throw new Error('网络响应失败');
      }
      pageloading(0);
      const data = await response.json();
      const ctllist=data.control;
      const userlist=data.user;
      for (let key in ctllist) {
          let ctl = document.createElement('div');
          let ctlbox = document.createElement('div');
          let ctltit = document.createElement('span');
          let action=ctllist[key].action;
          ctl.id = key;   
          ctltit.innerText=ctllist[key].name;     
          ctltit.className='ctl-tit';   
          ctlbox.className='ctl-box';
          ctlbox.style.display='none';
          ctl.className = 'ctl'; 
          ctl.appendChild(ctltit);
          ctl.appendChild(ctlbox);
          monbox.appendChild(ctl);
          for(let actkey in action){
            let act=document.createElement('div');
            act.className='act';
            act.innerText=action[actkey].name;
            if (action[actkey].user.length === 0) {
              act.classList.add("disable");
              act.title = '添加' + action[actkey].name + '权限';
          } else{
            action[actkey].user.forEach(permit =>{
                if(monuser==permit){
                    act.classList.add("enable");
                    act.title='解除'+action[actkey].name+'权限';
                    return;
                }
                else if(!act.classList.contains('enable')&&monuser!=permit&&!act.classList.contains('disable')){
                  act.classList.add("disable");
                  act.title='添加'+action[actkey].name+'权限';
                }
            });
          }
            act.onclick = function() {
              change_control(key,actkey,act);
          };
            ctlbox.appendChild(act)
          }
          let setting = document.createElement('div');
          setting.title='设置'+ctllist[key].name+"权限";
          setting.className='setting';
          setting.onclick = function() {
            show_ctl_box(ctlbox);
        };
          ctl.appendChild(setting);
      }
      for (let key in userlist) {
        let username = document.createElement('div');
        if(monuser==key){
          time=userlist[key].tokentime;
        }
        username.id = key;  
        username.innerText=key; 
        username.title='切换为:'+key; 
        username.className = 'username';   
        username.onclick = function() {
          monuser=key;
          get_data();
      };
        userbox.appendChild(username);

      }
      switch_user(monuser,time);
    } catch (error) {
      console.error('请求失败:', error);
    }
  }
  // 切换用户
  function switch_user(name,time){
    const userbar=document.getElementById('user-bar');
    const timebar=document.getElementById('time-bar');
    userbar.title="当前用户:"+name
    if (name!='admin'&&name!='lze') {
      userbar.innerText='访客';
    }
    else
      userbar.innerText=name;
    if(time){
      if(time=='never')
        timebar.value="永不过期";
      else
        timebar.value=time;
  }
    else
      timebar.value="无";
  }
  // 列出用户表
  function show_user() {
    const userlist = document.getElementById("user-box");
    switch (userlist.style.display) {
        case "none":
            userlist.style.display = "flex";
            document.addEventListener("click", page_hide_user);
            break;
        case "flex":
            userlist.style.display = "none";
            document.removeEventListener("click", page_hide_user);
            break;
        default:
            userlist.style.display = "flex";
            document.addEventListener("click", page_hide_user);
            break;
    }
}
function page_hide_user(event) {
    const userlist = document.getElementById("user-box");
    const userIcon = document.getElementById("user-icon");
    if (!userlist.contains(event.target) && event.target !== userIcon) {
        userlist.style.display = "none";
        document.removeEventListener("click", page_hide_user);
    }
}
// 显示配置选项
function show_ctl_box(ctlbox){
  switch(ctlbox.style.display){
    case "none":
      ctlbox.style.display='flex';
      break;
    case "flex":
      ctlbox.style.display='none';
      break;
  }
}
//修改登陆时间
function edit_time(){
  const save=document.getElementById("save");
  const timebar=document.getElementById("time-bar");
  timebar.classList.add('edit');
  timebar.disabled = false;
  timebar.value='';
  save.style.display='block';

}
function change_time(){
  if (confirm('确定更新期限吗?')){
  const timebar=document.getElementById("time-bar");
  if(!check_format(timebar.value)&&timebar.value!='never'){
    alert('格式错误\n正确格式\n小时:数字+h\n天:数字+d\n月:数字+m\n年:数字+y\n永不过期:never')
    return;
  }
  if(monuser=='visitor'){
    notify('无登陆');
    return;
  }
  pageloading(1);
  const data = {
    name: monuser,
    time: timebar.value,
    token,
    user
  };
  fetch(`${protocol}//${ip}/server/mon/date.cgi`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      notify("已更新登陆期限");
      get_data();
    }else if (response.status === 401) {
      notify("无权限修改")
      pageloading(0)
      throw new Error('未授权访问');
    }
    else  {
      pageloading(0)
        notify(response.status+"错误")
        throw new Error('未授权访问');
      }
  })
  .catch((error) => {
    console.error('请求失败:', error);
  });
}
}
function check_format(time){
  const regex = /^\d+(h|d|m|y)$/;
  return regex.test(time);
}
//修改控制权限
function change_control(control,action,actel){
  if(confirm("确定更新权限吗?")){
    pageloading(1);
  let change;
  if(actel.classList.contains('enable'))
    change="remove";
  else
    change="add";
const data = {
  name: monuser,
  token,
  user,
  change: change,
  control: control,
  action: action
};
fetch(`${protocol}//${ip}/server/mon/update_act.cgi`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => {
  if (response.ok) {
    notify("已更新权限");
    get_data();
  } 
  else if (response.status === 401) {
      notify("无权限修改")
      pageloading(0)
      throw new Error('未授权访问');
    }
    else  {
      pageloading(0)
        notify(response.status+"错误")
        throw new Error('未授权访问');
      }
})
.catch((error) => {
  console.error('请求失败:', error);
});
  }
}