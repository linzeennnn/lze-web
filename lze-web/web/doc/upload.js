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

    const totalFiles = files.length;
    let totalChunks = 0;
    let uploadedChunks = 0;
    let completedFiles = 0; // 记录已完成上传的文件数

    // 计算所有文件的总块数
    for (let file of files) {
        let chunkSize;
        if (file.size <= 100 * 1024 * 1024) {
            chunkSize = 20 * 1024 * 1024;
        } else if (file.size > 100 * 1024 * 1024 && file.size <= 500 * 1024 * 1024) {
            chunkSize = 50 * 1024 * 1024;
        } else if (file.size > 500 * 1024 * 1024 && file.size <= 1024 * 1024 * 1024) {
            chunkSize = 100 * 1024 * 1024;
        } else if (file.size > 1024 * 1024 * 1024 && file.size <= 3 * 1024 * 1024 * 1024) {
            chunkSize = 200 * 1024 * 1024;
        } else {
            chunkSize = 300 * 1024 * 1024;
        }
        totalChunks += Math.ceil(file.size / chunkSize);
    }

    const percentElement = document.getElementById('percent'); // 进度文本元素
    const updateProgress = () => {
        const percent = (uploadedChunks / totalChunks) * 100;
        document.getElementById('bar').style.width = percent + '%';
        percentElement.innerHTML = parseInt(percent) + '%';
    };

    const uploadFile = (file, index) => {
        let chunkSize;
        if (file.size <= 100 * 1024 * 1024) {
            chunkSize = 20 * 1024 * 1024;
        } else if (file.size > 100 * 1024 * 1024 && file.size <= 500 * 1024 * 1024) {
            chunkSize = 50 * 1024 * 1024;
        } else if (file.size > 500 * 1024 * 1024 && file.size <= 1024 * 1024 * 1024) {
            chunkSize = 100 * 1024 * 1024;
        } else if (file.size > 1024 * 1024 * 1024 && file.size <= 3 * 1024 * 1024 * 1024) {
            chunkSize = 200 * 1024 * 1024;
        } else {
            chunkSize = 300 * 1024 * 1024;
        }

        let start = 0;
        let chunkIndex = 0;

        const uploadChunk = (start) => {
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            const relativePath = file.webkitRelativePath;

            if (index === 0 && start === 0) {
                foldername = files[0].webkitRelativePath.split('/')[0];
            }

            const chunkFormData = new FormData();
            chunkFormData.append('file', chunk);
            chunkFormData.append('name', file.name);
            chunkFormData.append('relativePath', relativePath);
            chunkFormData.append('start', start);
            chunkFormData.append('chunkIndex', chunkIndex);
            chunkFormData.append('total', file.size);
            chunkFormData.append('last', end >= file.size ? 1 : 0);

            fetch(`${protocol}//${ip}/server/doc/upload_folder.cgi`, {
                method: 'POST',
                body: chunkFormData
            })
            .then(response => response.text())
            .then(data => {
                uploadedChunks++;
                updateProgress(); // 更新进度
                chunkIndex++;
                if (end < file.size) {
                    uploadChunk(end);
                } else {
                    completedFiles++; // 增加已完成文件计数
                    if (completedFiles === totalFiles) {
                        loading(0);
                        movefolder(foldername,nowpath);
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
function movefolder(foldername, folderpath) {
    fetch(`${protocol}//${ip}/server/doc/move_folder.cgi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: foldername,
            path: folderpath
        })
    })
    .then(response => response.text())
    .then(data => {
        notify("上传完成");
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
    var chunkSize = 20*1024 * 1024; // 每个块的大小（1MB）
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
        xhr.open('POST', `${protocol}//${ip}/server/doc/upload_file.cgi`, true);
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
                    uploadChunk(fileIndex + 1);
                    notify(`文件 ${file.name} 上传成功`);
                    loadFolder(removeslash(nowpath));
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