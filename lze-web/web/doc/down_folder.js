// 下载文件夹
function downfolder(folder,homename) { 
    if (confirm('确定要下载文件夹吗')) {
        const formData = new FormData();
        if (typeof ishome !== 'undefined' && ishome){
            formData.append('folderPath', '/');
            formData.append('foldername', homename);
            }
        else{
            pageloading(1);
            const name = folder.querySelector('.folderLink').innerText;
            let path;
            if (currentPath.innerText == "/") {
            path = currentPath.innerText;
            } else {
            path = "/" + currentPath.innerText;
            }
            console.log(path);
            formData.append('folderPath', path);
            formData.append('foldername', name);
        }
      // 使用 fetch 进行请求
      fetch(`${protocol}//${ip}/code/Documents/zip_folder.php`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json();
        }
      })
      .then(data => {
        if(!data.error){
            if (typeof ishome !== 'undefined' && ishome){
            document.querySelector('.loading').style.display='none';
            }
            else{
                pageloading(0);
            }
          notify("开始下载");
        const a = document.createElement('a');
        a.href = data.url; 
        a.download = name + ".zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        }
        else{
          notify(data.error);
        }
      })
    }
    else{
      if (typeof ishome !== 'undefined' && ishome){
      document.body.removeChild(document.querySelector('.widget-page'));
      }
    }
  }