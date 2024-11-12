// 上传文件夹
function uploadFolder() {
    ifroot();
    let foldername;
    const input = document.getElementById('uploadfolder');
    const files = input.files;
    // 检查是否选中任何文件
    if (files.length === 0) {
        return; // 取消上传
    }
    loading(1);
    showupload(0);
    const chunkSize = 1024 * 1024; // 1MB
    const totalFiles = files.length;
    let totalChunks = 0;
    let uploadedChunks = 0;
    let completedFiles = 0; // 记录已完成上传的文件数
    // 计算所有文件的总块数
    for (let file of files) {
        totalChunks += Math.ceil(file.size / chunkSize);
    }
    const percentElement = document.getElementById('percent'); // 进度文本元素
    const updateProgress = () => {
        const percent = (uploadedChunks / totalChunks) * 100;
        document.getElementById('bar').style.width = percent + '%';
        percentElement.innerHTML = parseInt(percent) + '%';
    };
    const uploadFile = (file, index) => {
        let start = 0;
        const uploadChunk = (start) => {
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            const relativePath = file.webkitRelativePath;
            if (index === 0 && start === 0) {
                foldername=files[0].webkitRelativePath.split('/')[0];
            }
            const chunkFormData = new FormData();
            chunkFormData.append('file', chunk, file.name);
            chunkFormData.append('relativePath', relativePath);
            chunkFormData.append('start', start);
            chunkFormData.append('total', file.size);
            if (index === 0 && start === 0) {
                chunkFormData.append('1st', true);
            }
            fetch(`${protocol}//${ip}/code/Documents/upload_folder.php`, {
                method: 'POST',
                body: chunkFormData
            })
            .then(response => response.text())
            .then(data => {
                uploadedChunks++;
                updateProgress(); // 更新进度
                if (end < file.size) {
                    uploadChunk(end);
                } else {
                    completedFiles++; // 增加已完成文件计数
                    if (completedFiles === totalFiles) {
                        movefolder(foldername,nowpath);
                        loading(0);
                    }
                }
            })
            .catch(error => {
                console.error('上传失败:', error);
            });
        };
        uploadChunk(start);
    };
    for (let i = 0; i < files.length; i++) {
        uploadFile(files[i], i);
    }
    input.value = ''; // 重置输入框的值
}
// 从temp移动文件夹
function movefolder(foldername,folderpath){
    fetch(`${protocol}//${ip}/code/Documents/move_folder.php`, {
        method: 'POST',
        body: new URLSearchParams({
            name: foldername,
            path: folderpath
        })
    })
    .then(response => response.text())
    .then(data => {
       notify(data);
       loadFolder(removeslash(folderpath));
    })
    .catch(error => {
        notify(error);
    });
}
// 上传文件
function selfile() {
    ifroot();
    var files = fileInput.files; // 直接使用 fileInput 的文件
    if (files.length === 0) {
        notify("请先选择文件");
        return;
    }
    showupload(0);
    var chunkSize = 1024 * 1024; // 每个块的大小（1MB）
    var totalFiles = files.length;
    var totalChunks = Array(totalFiles).fill(0); // 存储每个文件的总块数
    var currentChunks = Array(totalFiles).fill(0); // 存储每个文件的当前块数
    // 计算每个文件的总块数
    for (let i = 0; i < totalFiles; i++) {
      if (files[i].size === 0) {
          notify(`${files[i].name} 是空文件，上传失败`);
          return;
      }
      totalChunks[i] = Math.ceil(files[i].size / chunkSize);
  }
  loading(1);
    function uploadChunk(fileIndex) {
        if (fileIndex >= totalFiles) {
            loading(0);
            return;
        }
        var file = files[fileIndex];
        var start = currentChunks[fileIndex] * chunkSize;
        var end = Math.min(start + chunkSize, file.size);
        var chunk = file.slice(start, end);
        var fd = new FormData();
        fd.append('file', chunk);
        fd.append('fileName', file.name);
        fd.append('totalChunks', totalChunks[fileIndex]);
        fd.append('currentChunk', currentChunks[fileIndex]);
        fd.append('nowpath', nowpath); // 传递 nowpath 变量
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${protocol}//${ip}/code/Documents/upload_file.php`, true);
        xmltoken(xhr);
        xhr.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
                var percent = ((currentChunks[fileIndex] + ev.loaded / ev.total) / totalChunks[fileIndex]) * 100;
                var percentElement = document.getElementById('percent');
                document.getElementById('bar').style.width = percent + '%';
                percentElement.innerHTML = parseInt(percent) + '%'; // 更新百分比显示
            }
        };
        xhr.onload = function () {
            xmlnologin(xhr);
            if (xhr.status === 200) {
                currentChunks[fileIndex]++;
                if (currentChunks[fileIndex] < totalChunks[fileIndex]) {
                    uploadChunk(fileIndex); // 上传下一个块
                } else {
                    // 上传下一个文件
                    uploadChunk(fileIndex + 1);
                    notify(`文件 ${file.name} 上传成功`);
                    uploadpath = xhr.responseText;
                    loadFolder(removeslash(nowpath));
                    desktopnot('新文件', `新上传文件: ${file.name}`, uploadpath);
                }
            }
        };
        xhr.send(fd);
    }
    uploadChunk(0); // 开始上传第一个文件
  }
  //拖拽上传
const folderinput = document.getElementById('uploadfolder');
const fileInput = document.getElementById('uploadfile');
const uploadarea = document.getElementById('upload-area');
const filelist = document.getElementById('fileListContainer');
document.addEventListener('dragover', handleDragOver);
document.addEventListener('dragleave', handleDragLeave);
document.addEventListener('drop', handleDrop);
filelist.addEventListener('dragover', handleDragOver);
filelist.addEventListener('dragleave', handleDragLeave);
filelist.addEventListener('drop', handleDrop);
function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '1';
}
function handleDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '';
}
function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    uploadarea.style.opacity = '';
    const dt = e.dataTransfer;
    const files = dt.files;
    const items = dt.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // 检查拖拽的项目类型
        if (item.kind === 'file'&& item.webkitGetAsEntry().isFile) {
            const file = item.getAsFile();
            if (file) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                selfile();
            }
        } else {
           notify("文件夹自己去手动上传");
        }
    }
}