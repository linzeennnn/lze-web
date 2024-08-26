let darkcolor;
let lightcolor
darkcolor='#1c1f28';
lightcolor='#6b7596';
function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            document.getElementById('top-btn').style.bottom = '15%';
          document.querySelector('.backbtn').style.left = '1%';
          document.querySelector('.backbtn').style.width = '15%';
          document.querySelector('.top-button').style.top = '5px';
          document.querySelector('.top-button').style.backdropFilter = `none`;
          document.querySelector('.top-button').style.webkitBackdropFilter = `none`;
          document.querySelector('.top-button').style.marginLeft = '50px';
          document.getElementById('cover-bar').style.top = '0';
          document.querySelector('.top-button').style.backgroundColor = 'transparent';
          
          
        } else {
            document.getElementById('top-btn').style.bottom = '';
          document.querySelector('.backbtn').style.left = '5%';
          document.querySelector('.top-button').style.top = '80px'
          document.querySelector('.backbtn').style.width = '';
          document.querySelector('.top-button').style.backgroundColor = '';
          document.querySelector('.top-button').style.marginLeft = '';
          document.querySelector('.top-button').style.backdropFilter = ``;
          document.querySelector('.top-button').style.twebkitBackdropFilter = ``;
          document.getElementById('cover-bar').style.top = '';
         
        }
}
window.addEventListener('scroll', handleScroll);

        function comin(){
      document.querySelector('.backbtn').style.left = '5%';
        document.querySelector('.gallery-container').style.right = '0';
       document.getElementById('button1').style.width = '32px';
       document.getElementById('button2').style.width = '32px';
       document.getElementById('button3').style.width = '32px';
       document.getElementById('selectButton').style.width = '32px';
       document.getElementById('buttonA').style.bottom = '0px';
       document.querySelector('.top-button').style.top = '80px';
    };
    window.onload = comin;

    function goBack() {
        document.getElementById('top-btn').style.bottom = '';
        window.removeEventListener('scroll',handleScroll);
        document.getElementById('cover-bar').style.top = `-80px`;
            document.querySelector('.backbtn').style.left = '-80%';
        document.querySelector('.gallery-container').style.right = '-100%';
       document.getElementById('button1').style.width = '0px';
       document.getElementById('button2').style.width = '0px';
       document.getElementById('button3').style.width = '0px';
       document.getElementById('selectButton').style.width = '0px';
       document.getElementById('buttonA').style.bottom = '-1000px';
       document.querySelector('.top-button').style.top = '-80px';
       document.querySelector('body').style.backgroundImage = `url(${wallpath}home_pc.svg)`;
       document.querySelector('.next').style.backgroundImage = `url(${wallpath}home_phone.svg)`;
    document.querySelector('.next').style.opacity ='1';  
            setTimeout(() => {
                window.location.replace(`../../index.html#${ip}`);
}, 1000);
        }
var fileInput = document.getElementById("uploadfile");

// 监听文件输入框的change事件
fileInput.addEventListener("change", function () {
            var btn1 = document.getElementById("button1");
            var btn2 = document.getElementById("button2");
            var btn3 = document.getElementById("button3");
            var loadbtn = document.getElementById("load-btn");
            var progress =document.getElementById("progress");
            var selectedFile = fileInput.files[0];
            var filePreviewDisplay = document.getElementById("file-preview-display");
            filePreviewDisplay.innerHTML = "";

            if (selectedFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.maxWidth = "400px";
                    img.style.maxHeight = "400px";
                    img.style.borderRadius = "1em";
                    filePreviewDisplay.appendChild(img);
                };
                reader.readAsDataURL(selectedFile);
                progress.style.display = "block";
                selectButton.style.display = "none";
                btn1.style.display = "none";
                btn2.style.display = "none";
                btn3.style.display = "none";
                loadbtn.style.display = "none";
            } else {
                progress.style.display = "none";
                btn1.style.display = "block";
                btn2.style.display = "block";
                btn3.style.display = "block";
                loadbtn.style.display = "block";
                selectButton.style.display = "block";
            }
        });
        var buttonA = document.getElementById("buttonA");
        var buttonB = document.getElementById("buttonB");
        var buttonC = document.getElementById("buttonC");
        buttonA.style.display = "block";
        buttonB.style.display = "none";
        buttonC.style.display = "none";
    
        document.getElementById("button1").classList.add("selected");
        var button1 = document.getElementById("button1");
        var button2 = document.getElementById("button2");
        var button3 = document.getElementById("button3");
    
        button1.addEventListener("click", function () {
            if (!button1.classList.contains("selected")) {
                button1.classList.add("selected");
                button2.classList.remove("selected");
                button3.classList.remove("selected");
                showImages(); // 切换为显示图片
                buttonA.style.display = "block";
                buttonB.style.display = "none";
                buttonC.style.display = "none";
            }
        });
    
        button2.addEventListener("click", function () {
            if (!button2.classList.contains("selected")) {
                button2.classList.add("selected");
                button1.classList.remove("selected");
                button3.classList.remove("selected");
                showVideos(); // 切换为显示视频
                buttonA.style.display = "none";
                buttonC.style.display = "none";
                buttonB.style.display = "block";
            }
        });
        button3.addEventListener("click", function () {
            if (!button3.classList.contains("selected")) {
                button3.classList.add("selected");
                button1.classList.remove("selected");
                button2.classList.remove("selected");
                showScreenshots(); // 切换为显示视频
                buttonA.style.display = "none";
                buttonB.style.display = "none";
                buttonC.style.display = "block";
            }
        });
    
        buttonA.addEventListener("click", function () {
            loadImages();
        });
    
        var galleryContainer = document.getElementById("gallery-container");
        var loadedImageIndices = []; // 用于记录已加载的图片索引
    
        function appendImages(count) {
    var loadedImageCount = 0;

    for (let i = 0; i < files.length; i++) {
        if (!loadedImageIndices.includes(i)) {
            var filePath = `http://${ip}/file/Pictures/` + files[i]; // 生成绝对路径
            var fileName = filePath.split('/').pop(); // 获取文件名
            var fileExtension = filePath.split('.').pop().toLowerCase();
            var isVideo = ['ts','mp4', 'webm', 'mkv', 'avi', 'mov', 'wmv'].includes(fileExtension);

            if (!isVideo && loadedImageCount < count) {
                var img = document.createElement("a");
                img.href = filePath;
                img.setAttribute("data-fancybox", "gallery");

                var imgElement = document.createElement("img");
                imgElement.src = filePath;
                img.appendChild(imgElement);

                var galleryItem = document.createElement("div");
                galleryItem.className = "gallery-item";
                galleryItem.title = fileName; // 添加title
                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);

                loadedImageIndices.push(i);
                loadedImageCount++;
            }
        }
    }
    if (loadedImageCount < count) {
        buttonA.style.display = "none";
        alert("已加载全部图片");
    }
            $('[data-fancybox="gallery"]').fancybox({
                loop: true,
                protect: true,
                buttons: ["zoom", "share", "slideShow", "fullScreen", "download", "thumbs", "close"],
            });

            showImages();
        }
        function loadImages() {
            // 追加加载三张新图片
            appendImages(3);
        }
    
        var loadedVideoIndices = []; // 用于记录已加载的视频索引
    
        buttonB.addEventListener("click", function () {
            loadVideos();
        });
    
        
function appendVideos(count) {
    var loadedVideoCount = 0;

    for (let i = 0; i < files.length; i++) {
        if (!loadedVideoIndices.includes(i)) {
            var filePath = `http://${ip}/file/Pictures/` + files[i]; // 生成绝对路径
            var fileName = filePath.split('/').pop(); // 获取文件名
            var fileExtension = filePath.split('.').pop().toLowerCase();
            var isVideo = ['ts','mp4', 'webm', 'mkv', 'avi', 'mov', 'wmv'].includes(fileExtension);

            if (isVideo && loadedVideoCount < count) {
                var video = document.createElement("video");
                video.src = filePath;
                video.controls = true;

                var videoItem = document.createElement("div");
                videoItem.className = "gallery-item video-item";
                videoItem.title = fileName; // 添加title
                videoItem.appendChild(video);
                galleryContainer.appendChild(videoItem);

                loadedVideoIndices.push(i);
                loadedVideoCount++;

                captureFrame(filePath).then(frame => {
                    video.poster = frame.url;
                });
            }
        }
    }
    if (loadedVideoCount < count) {
        buttonB.style.display = "none";
        alert("已加载全部视频");
    }

            showVideos();
        }
    
        function loadVideos() {
            // 追加加载一个新视频
            appendVideos(1);
        }


        
       
        var loadedScreenshotsIndices = []; // 用于记录已加载的视频索引
        
        buttonC.addEventListener("click", function () {
            loadScreenshots();
        });
    
        function appendScreenshots(count) {
    var loadedScreenshotsCount = 0;

    for (let i = 0; i < screenshotFiles.length; i++) {
        if (!loadedScreenshotsIndices.includes(i)) {
            var filePath = `http://${ip}/file/Pictures/` + screenshotFiles[i]; // 生成绝对路径
            var fileName = filePath.split('/').pop(); // 获取文件名

            if (loadedScreenshotsCount < count) {
                var img = document.createElement("a");
                img.href = filePath;
                img.setAttribute("data-fancybox", "gallery");

                var imgElement = document.createElement("img");
                imgElement.src = filePath;
                img.appendChild(imgElement);

                var galleryItem = document.createElement("div");
                galleryItem.className = "gallery-item screenshot-item";
                galleryItem.title = fileName; // 添加title
                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);

                loadedScreenshotsIndices.push(i);
                loadedScreenshotsCount++;
            }
        }
    }
    if (loadedScreenshotsCount < count) {
        buttonC.style.display = "none";
        alert("已加载全部截图");
    }

    showScreenshots();
}

    
        function loadScreenshots() {
            // 追加加载一个新视频
            appendScreenshots(3);
        }
        function showImages() {
            var galleryItems = document.querySelectorAll(".gallery-item");
            galleryItems.forEach(function (item) {
                var isVideo = item.classList.contains("video-item");
                var isScreenshot = item.classList.contains("screenshot-item");
                item.style.display = isVideo ? "none" : "block";
                item.style.display = isVideo || isScreenshot ? "none" : "block";
            });
        }
    
        function showVideos() {
    var galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach(function (item) {
        var isVideo = item.classList.contains("video-item");
        item.style.display = isVideo ? "block" : "none";
    });
}
        function showScreenshots() {
    var galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach(function (item) {
        var isScreenshots = item.classList.contains("screenshot-item");
        item.style.display = isScreenshots ? "block" : "none";
    });
}
        var xmlhttpScreenshot = new XMLHttpRequest();
        xmlhttpScreenshot.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                 screenshotFiles = JSON.parse(this.responseText);
                appendScreenshots(0);
            }
        };

        xmlhttpScreenshot.open("GET", `http://${ip}/code/Pictures/pic_sreenshot_list.php`, true);
        xmltoken(xmlhttpScreenshot);
        xmlhttpScreenshot.send();
    
        
    
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200) {
                files = JSON.parse(this.responseText);
    
                // 初始加载时默认显示图片
                appendImages(3);
            }
            xmlnologin(xmlhttp);
        };
    
        xmlhttp.open("GET", `http://${ip}/code/Pictures/pic_list.php`, true);
        xmltoken(xmlhttp);
        xmlhttp.send();
    
        
    
        function drawVideo(vdo) {
            return new Promise(resolve => {
                const cvs = document.createElement('canvas');
                const ctx = cvs.getContext('2d');
                cvs.width = vdo.videoWidth;
                cvs.height = vdo.videoHeight;
                ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height);
                const dataURL = cvs.toDataURL();
                resolve({ url: dataURL, width: cvs.width, height: cvs.height });
            });
        }
    
        function captureFrame(videoSrc) {
            return new Promise(resolve => {
                const video = document.createElement('video');
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.addEventListener('loadeddata', async () => {
                    const frame = await drawVideo(video);
                    video.pause();
                    resolve(frame);
                });
                video.src = videoSrc;
                video.load();
            });
        }
        function selfile() {
  var files = document.getElementById('uploadfile').files;
  if (files.length === 0) {
    alert('请先选择文件。');
    return;
  }

  var chunkSize = 1024 * 1024; // 每个块的大小（1MB）
  var file = files[0];
  var totalChunks = Math.ceil(file.size / chunkSize);
  var currentChunk = 0;

  function uploadChunk() {
    var start = currentChunk * chunkSize;
    var end = Math.min(start + chunkSize, file.size);
    var chunk = file.slice(start, end);

    var fd = new FormData();
    fd.append('file', chunk);
    fd.append('fileName', file.name);
    fd.append('totalChunks', totalChunks);
    fd.append('currentChunk', currentChunk);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', `http://${ip}/code/Pictures/upload.php`, true);
    xmltoken(xhr);
    xhr.upload.onprogress = function(ev) {
      if (ev.lengthComputable) {
        var percent = ((currentChunk + ev.loaded / ev.total) / totalChunks) * 100;
        var percentElement = document.getElementById('percent');
        document.getElementById('bar').style.width = percent + '%';
        percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
      }
    };

    xhr.onload = function() {
        xmlnologin(xhr);
      if (xhr.status === 200) {
        currentChunk++;
        if (currentChunk < totalChunks) {
          uploadChunk(); // 上传下一个块
        } else {
            notify("上传完成");
          reloadPage(); 
        }
      } 
    };

    xhr.send(fd);
  }

  uploadChunk(); // 开始上传第一个块
}
