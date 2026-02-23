import { getEnv } from "../store/common"
import { getLangType } from "../store/lang"
import { getUrl,getToken } from "../store/request"
import { confirmWin, loadingPage, notify } from "./common"

export  const Api={
    post:(request)=>{req(request,"POST")},
    get:(request)=>{req(request,"GET")},
    put:(request)=>{req(request,"PUT")},
    delete:(request)=>{req(request,"DELETE")},
    patch:(request)=>{req(request,"PATCH")},
    upload: (request) => uploadReq(request)
}

export const AsyncApi = {
  post: (request) => reqAsync(request, "POST"),
  get: (request) => reqAsync(request, "GET"),
  put: (request) => reqAsync(request, "PUT"),
  delete: (request) => reqAsync(request, "DELETE"),
  patch: (request) => reqAsync(request, "PATCH"),
};

function req(request, method) {
  const {
    api,
    body,
    success,
    fail,
    end,
    notice,
    contentType,
    loading = true   
  } = request
  loading && loadingPage(true)
  const env=getEnv()
  const m = method.toUpperCase()
  let headers = {
    "authorization": "Bearer " + getToken(),
    "lang": getLangType(),
    "source": env.type
  }
  if (!(body instanceof FormData)) {
  headers["Content-Type"] = contentType ? contentType : "application/json"
}

  const options = {
    method: m,
    headers: headers
  }
  if (body && m !== "GET") {
    options.body = isObj(body) ? JSON.stringify(body) : body
  }
  fetch(getUrl() + api, options)
    .then(async res => {
      const data = await res.json()
      return { ok: res.ok, status: res.status, ...data }
    })
    .then(({ ok, code, msg, data }) => {
      if (ok && code === 200) {
        notice && notify.normal(msg)
        success && success(data)
      } else if (code === 400 || code === 500) {
        confirmWin.err(msg)
        fail && fail(code)
      } else {
        notify.err(msg)
        fail && fail(code)
      }
    })
    .catch(err => {
      confirmWin.err(err.message)
      console.error(err)
      fail && fail(-1)
    })
    .finally(() => {
      loading && loadingPage(false)
      end && end()
    })
}



async function reqAsync(request, method) {
  const {
    api,
    body,
    notice,
    loading = true   
  } = request

  loading && loadingPage(true)

  const env=getEnv()
  const m = method.toUpperCase()

  const options = {
    method: m,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + getToken(),
      "lang": getLangType(),
      "source":env.type
    }
  }

  if (body && m !== "GET") {
    options.body = isObj(body) ? JSON.stringify(body) : body
  }

  try {
    const res = await fetch(getUrl() + api, options)

    let json = {}
    try {
      json = await res.json()
    } catch {}

    const { code, msg, data } = json

    if (res.ok && code === 200) {
      notice && notify.normal(msg)
      return data
    }

    if (code === 400 || code === 500) {
      confirmWin.err(msg)
    } else {
      notify.err(msg)
    }

    return null
  } catch (err) {
    confirmWin.err(err.message || "网络异常")
    return null
  } finally {
    loading && loadingPage(false)
  }
}
//判断是不是对象
function isObj(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
//使用xhr获取上传进度
function uploadReq(request) {
  const {
    api,
    body,
    setProgress,
    success,
    fail,
    notice,
    end,
  } = request
  console.log(body);
  
  const env = getEnv();
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          setProgress(event.loaded)
        }
    });
    xhr.open('POST', getUrl() + api, true);
    xhr.setRequestHeader("authorization", "Bearer " + getToken());
    xhr.setRequestHeader("lang", getLangType());
    xhr.setRequestHeader("source", env.type);
    xhr.responseType = 'json';
    xhr.onload = function() {
      const { code, msg, data } = xhr.response || {}
      if (code=== 200) {
        notice && notify.normal(msg)
        success && success(data)
      } else if (code === 400 || code === 500) {
        confirmWin.err(msg)
        fail && fail(code)
      } else {
        notify.err(msg)
        fail && fail(code)
      }
    };
    xhr.onerror = function() {
        confirmWin.err("error")
        fail && fail()
    };
    xhr.send(body);
}