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
    let shouldContinue = true; // 用于控制是否继续上传

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
            if (!shouldContinue) return; // 如果遇到错误，则直接退出

            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            const relativePath = file.webkitRelativePath;

            if (index === 0 && start === 0) {
                foldername = files[0].webkitRelativePath.split('/')[0];
            }

            const chunkFormData = new FormData();
            chunkFormData.append('start', start);
            chunkFormData.append('total', file.size);
            chunkFormData.append('file', chunk);
            chunkFormData.append('name', file.name);
            chunkFormData.append('relativePath', relativePath);
            chunkFormData.append('token', token);
            chunkFormData.append('chunkIndex', chunkIndex);
            chunkFormData.append('user', user);
            chunkFormData.append('last', end >= file.size ? 1 : 0);
            fetch(`${protocol}//${ip}/server/doc/upload_folder`, {
                method: 'POST',
                body: chunkFormData
            })
            .then(response => {
                if (response.status === 401) {
                  notify("无新建文件夹权限");
                  loading(0);
                  shouldContinue = false; // 发生错误，停止上传
                  throw new Error('未授权访问');
                }
                return response.text();  
              })
            .then(data => {
                if (!shouldContinue) return; // 如果发生错误，直接停止上传
                uploadedChunks++;
                updateProgress(); // 更新进度
                chunkIndex++;
                if (end < file.size) {
                    uploadChunk(end);
                } else {
                    completedFiles++; // 增加已完成文件计数
                    if (completedFiles === totalFiles) {
                        loading(0);
                        movefolder(foldername, nowpath);
                    }
                }
            })
            .catch(error => {
                console.error('上传失败:', error);
                shouldContinue = false; // 发生错误，停止上传
            });
        };
        uploadChunk(start);
    };

    for (let i = 0; i < files.length; i++) {
        if (!shouldContinue) break; // 如果发生错误，停止上传后续文件
        uploadFile(files[i], i);
    }

    input.value = ''; // 重置输入框的值
}


// 获取块大小的函数
function getChunkSize(fileSize) {
    if (fileSize <= 100 * 1024 * 1024) {
        return 20 * 1024 * 1024;
    } else if (fileSize <= 500 * 1024 * 1024) {
        return 50 * 1024 * 1024;
    } else if (fileSize <= 1024 * 1024 * 1024) {
        return 100 * 1024 * 1024;
    } else if (fileSize <= 3 * 1024 * 1024 * 1024) {
        return 200 * 1024 * 1024;
    } else {
        return 300 * 1024 * 1024;
    }
}


// 从temp移动文件夹
function movefolder(foldername, folderpath) {
    fetch(`${protocol}//${ip}/server/doc/move_folder`, {
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
    var files = fileInput.files; 
    if (files.length === 0) {
        notify("请先选择文件");
        return;
    }

    showupload(0);
    var chunkSize = 20 * 1024 * 1024; 
    var totalFiles = files.length;
    var totalChunks = Array(totalFiles).fill(0); 
    var currentChunks = Array(totalFiles).fill(0); 

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
            document.getElementsByTagName('input')[0].value = '';
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
        fd.append('nowpath', nowpath);
        fd.append('token', token);
        fd.append('user', user);

        fetch(`${protocol}//${ip}/server/doc/upload_file`, {
            method: 'POST',
            body: fd
        })
        .then(response => {
            if (response.status === 200) {
                currentChunks[fileIndex]++;
                if (currentChunks[fileIndex] < totalChunks[fileIndex]) {
                    uploadChunk(fileIndex); 
                } else {
                    notify(`文件 ${file.name} 上传成功`);
                    loadFolder(removeslash(nowpath));
                    uploadChunk(fileIndex + 1); 
                }
            } else if (response.status === 401) {
                notify("没有上传文件权限");
                loading(0);
                throw new Error('未授权访问');
            } else {
                notify(`${response.status}错误`);
                loading(0);
                throw new Error(`HTTP 错误 ${response.status}`);
            }
        })
        .catch(error => {
            console.error('上传发生错误:', error);
            loading(0);
        });
    }

    uploadChunk(0); 
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