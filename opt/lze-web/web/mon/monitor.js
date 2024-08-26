let darkcolor;
let lightcolor
darkcolor='#28281c';
lightcolor='#96966a';
let volumeValue;
let brightnessValue;
    let windowid = '';
    const toolbar =document.getElementById('tool-bar');
    const mediabar =document.getElementById('media-bar');
    const allwindow =document.getElementById('allwindow');
    const topbar =document.getElementById('top-bar');
    const btnbar =document.getElementById('btn-bar');
function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '10%';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.getElementById('cover-bar').style.top = '0';
          topbar.style.top='0';
          topbar.style.flexDirection='row';
          mediabar.style.backgroundColor='transparent';
          mediabar.style.margin='0';
          mediabar.style.top='-30px';
          mediabar.style.boxShadow='none';
          mediabar.style.backdropFilter = `none`;
          mediabar.style.webkitBackdropFilter = `none`;
          toolbar.style.padding='0';
          toolbar.style.backgroundColor='transparent';
          toolbar.style.margin='0';
          toolbar.style.boxShadow='none';
          toolbar.style.backdropFilter = `none`;
          toolbar.style.webkitBackdropFilter = `none`;
          btnbar.style.display='none';
        } else {
            document.getElementById('top-btn').style.bottom = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.querySelector('.backbtn').style.width = '';
          document.getElementById('cover-bar').style.top = '';
          topbar.style.flexDirection='';
          mediabar.style.margin='';
          mediabar.style.backgroundColor='';
          mediabar.style.top='';
          mediabar.style.boxShadow='';
          mediabar.style.backdropFilter = ``;
          mediabar.style.twebkitBackdropFilter = ``;
          topbar.style.top='80px';
          toolbar.style.backgroundColor='';
          toolbar.style.padding='';
          toolbar.style.margin='';
          toolbar.style.boxShadow='';
          toolbar.style.backdropFilter = ``;
          toolbar.style.webkitBackdropFilter = ``;
          btnbar.style.display='';
        }
}
window.addEventListener('scroll', handleScroll);


function comin(){
    cleanall();
    getwin();
    mediastatus();
    getvalue();
    topbar.style.top="80px";
    allwindow.style.right='0';
      document.querySelector('.backbtn').style.left = '5%';
        
    };
    window.onload = comin;
function goBack() {
    document.getElementById('top-btn').style.bottom = '';
    window.removeEventListener('scroll',handleScroll);
    document.getElementById('cover-bar').style.top = `-80px`;
    document.querySelector('.backbtn').style.left = '';
    document.querySelector('body').style.backgroundImage = `url(${wallpath}home_pc.svg)`;
    document.querySelector('.next').style.backgroundImage = `url(${wallpath}home_phone.svg)`;
      allwindow.style.opacity='';
      topbar.style.top='';
    allwindow.style.right='';
    document.querySelector('.next').style.opacity ='1';  
    setTimeout(() => {
        window.location.replace(`../../index.html#${ip}`);
}, 1000);
    }
//media status 
    function mediastatus(){
    const play = document.getElementById('play');
    const pause = document.getElementById('pause');
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${ip}/code/Monitor/media.php`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmltoken(xhr);
    // 定义请求发送时的处理逻辑
    xhr.send("action=status");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 根据PHP返回的数据执行不同的操作
            const response = xhr.responseText.trim();

            if (response === 'Playing') {
                play.style.display = 'none';
                pause.style.display = 'block';
                mediatitle();
                console.log("play");
            } else if (response === 'Paused') {
                play.style.display = 'block';
                pause.style.display = 'none';
                mediatitle();
                console.log("pause");
            } else {
                play.style.display = 'block';
                pause.style.display = 'none';
                console.log(response);
            }
        }
    };
}


function mediatitle() {
    const xhr = new XMLHttpRequest();
    const title =document.getElementById('media-title');
    xhr.open("POST", `http://${ip}/code/Monitor/media.php`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmltoken(xhr);
    xhr.send("action=title");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 处理响应
            const response = xhr.responseText; // 去除多余的空白字符
            console.log(response);
            title.innerText=response;
            title.style.animation='media-title 7s linear infinite';
        }pause
    };   
}
function mediabutton(button) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${ip}/code/Monitor/media.php`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmltoken(xhr);

    let postData;
    switch(button) {
        case 'play':
            postData = "action=play";
            break;
        case 'pause':
            postData = "action=pause";
            break;
        case 'speed':
            postData = "action=speed";
            break;
        case 'slow':
            postData = "action=slow";
            break;
        default:
            console.error('Unknown buttonId:', button);
            return;
    }

    xhr.send(postData);
    xhr.onreadystatechange = function() {
        xmlnologin(xhr);
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = xhr.responseText;
            setTimeout(() => {
                mediastatus(); 
                switch(button) {
                    case 'play':
                        notify("正在播放");
                        break;
                    case 'pause':
                        notify("已暂停");
                        break;
                    case 'speed':
                        notify("快进>>10s");
                        break;
                    case 'slow':
                        notify("10s<<回退");
                        break;
                    default:
                        console.error('Unknown buttonId:', button);
                        return;
                }
}, 10);
            
        }
    };
   
}

function getwin(){
    // Fetch the JSON data from the PHP script
    fetch(`http://${ip}/code/Monitor/window.php`,fetchtoken())
    .then(response => {
        fetchnologin(response)
        return response.json();
      })
        .then(data => {
            const allwindow = document.getElementById('allwindow');

            data.forEach(item => {
                // Create a new div element
                const window = document.createElement('div');
                
                // Add the 'window' class
                window.className = 'window';
                
                // Set the id
                window.id = item.windowid;

                // Create a span element for the text
                const span = document.createElement('span');
                span.className = 'title';  // Add the 'title' class
                span.innerText = item.text;  // Set the text inside the span
                
                // Append the span to the div
                window.appendChild(span);

                // Create a button element
                const close = document.createElement('div');
                close.className = 'close-win';
                
                // Add click event listener to the button
                close.addEventListener('click', () => {
                    windowid = window.id; // Set windowid variable to the id of the div
                    console.log('windowid set to:', windowid); // Optional: log the value to the console
                    allwindow.innerHTML='';
                    closewindow();
                });
                
                // Append the button to the div
                window.appendChild(close);
                
                // Append the div to the allwindow
                allwindow.appendChild(window);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

            
        
        function closewindow() {
    fetch(`http://${ip}/code/Monitor/close_window.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'windowid': windowid
        })
    })
    .then(response => response.text())
    .then(data => {
        getwin();
        notify("已关闭");
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//toolkit
        let initialVolumeValue ;
        let initialBrightnessValue ;

        function createSlider(sliderSelector, thumbSelector, fillSelector, initialValue, onUpdate) {
            const sliderContainer = document.querySelector(sliderSelector);
            const sliderFill = document.querySelector(fillSelector);
            const sliderThumb = document.querySelector(thumbSelector);

            let isDragging = false;

            function updateSlider(x) {
                const rect = sliderContainer.getBoundingClientRect();
                const offsetX = Math.max(0, Math.min(x - rect.left, rect.width));
                const percentage = offsetX / rect.width;
                const value = Math.round(percentage * 100);
                
                // Update the appropriate value variable
                if (sliderSelector === '.volum-bar') {
                    volumeValue = value;
                } else if (sliderSelector === '.brightness-bar') {
                    brightnessValue = value;
                }

                sliderFill.style.width = `${percentage * 100}%`;
                // sliderThumb.style.left = `${offsetX}px`;

                if (onUpdate) {
                    onUpdate(value);
                }
            }

            function setInitialValue(value) {
                const rect = sliderContainer.getBoundingClientRect();
                const percentage = value / 100;
                const offsetX = percentage * rect.width;
                updateSlider(rect.left + offsetX);
            }

            function onMove(e) {
                e.preventDefault(); // Prevent default scrolling behavior
                const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
                if (x !== undefined) {
                    updateSlider(x);
                }
            }

            sliderContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                onMove(e);
            });

            sliderContainer.addEventListener('touchstart', (e) => {
                isDragging = true;
                onMove(e);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    onMove(e);
                }
            });

            document.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    onMove(e);
                }
            });

            // Initialize with default value
            setInitialValue(initialValue);

            // Return an object with the current value and an update method
            return {
                update: (value) => {
                    const rect = sliderContainer.getBoundingClientRect();
                    const percentage = value / 100;
                    const offsetX = percentage * rect.width;
                    updateSlider(rect.left + offsetX);
                },
                getCurrentValue: () => {
                    if (sliderSelector === '.volum-bar') {
                        return volumeValue;
                    } else if (sliderSelector === '.brightness-bar') {
                        return brightnessValue;
                    }
                }
            };
        }

        function initslider() {
            
            
            const volumeSlider = createSlider('.volum-bar', '#volum-thumb', '.volum-fill', volumeValue, (value) => {
                toolkit("volum",volumeValue);
            });
            
            const brightnessSlider = createSlider('.brightness-bar', '#brightness-thumb', '.brightness-fill', brightnessValue, (value) => {
                toolkit("brightness",brightnessValue);
            });

            let muteActive = false;
            let minBrightnessActive = false;

            document.getElementById('mute-button').addEventListener('click', () => {
                if (muteActive) {
                    volumeValue = initialVolumeValue; 
                    volumeSlider.update(volumeValue); // Update slider to reflect the change
                    toolkit("volum",volumeValue);
                } else {
                    initialVolumeValue=volumeValue;
                    volumeValue = 0; // Set volume to 0
                    volumeSlider.update(volumeValue); // Update slider to reflect the change
                    toolkit("volum",volumeValue);
                }
                muteActive = !muteActive;
            });

            document.getElementById('min-brightness-button').addEventListener('click', () => {
                if (minBrightnessActive) {
                    brightnessValue = initialBrightnessValue; // Restore original value
                    brightnessSlider.update(brightnessValue); // Update slider to reflect the change
                    toolkit("brightness",brightnessValue);
                } else {
                    initialBrightnessValue=brightnessValue;
                    brightnessValue = 0; // Set brightness to 0
                    brightnessSlider.update(brightnessValue); // Update slider to reflect the change
                    toolkit("brightness",brightnessValue);
                }
                minBrightnessActive = !minBrightnessActive;
            });
        }
        function toolkit(button, value) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${ip}/code/Monitor/toolkit.php`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmltoken(xhr);
    let postData;
    switch(button) {
        case 'volum':
        postData = `action=volume&value=${value}`;
            break;
        case 'brightness':
        postData = `action=brightness&value=${value}`;
            break;
        default:
            console.error('Unknown buttonId:', button);
            return;
    }
    xhr.send(postData);
    xhr.onreadystatechange = function() {
        const response = xhr.responseText;
    };
}
function getvalue() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${ip}/code/Monitor/toolkit.php`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmltoken(xhr);
    // 发送键值对的请求体
    xhr.send("action=getvalue");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);  // 解析JSON响应
            volumeValue=response.vo;
            brightnessValue=response.bri;
            initslider();
        }
    };
}
// toscreen
function cleanall(){
    fetch(`http://${ip}/code/Monitor/cleanfile.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    .catch(error => {
        console.error('Error executing PHP script:', error);
    });
}
function toscreen() {
    var files = document.getElementById('uploadfile').files;
    var fd = new FormData();
    var maxSize = 10 * 1024 * 1024; // 10MB in bytes
toolbar.style.animation='toscreen 1s infinite';
    for (var i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
            alert("File " + files[i].name + "超过10MB");
            toolbar.style.animation='none';
            return;
        }
        fd.append('pic[]', files[i]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', `http://${ip}/code/Monitor/toscreen.php`, true);
    xmltoken(xhr);
    xhr.onload = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) { // 请求已完成
            xmlnologin(xhr);
            if (xhr.status === 200) {
                toolbar.style.animation='none';
            } else {
                console.error('Failed to upload files');
            }
        }
    };

    xhr.send(fd);
}

