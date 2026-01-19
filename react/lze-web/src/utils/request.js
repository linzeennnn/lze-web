import { getLangType } from "../store/lang"
import { getUrl,getToken } from "../store/request"
import { confirmWin, loadingPage, notify } from "./common"

export  const Api={
    post:(request)=>{req(request,"POST")},
    get:(request)=>{req(request,"GET")},
    put:(request)=>{req(request,"PUT")},
    delete:(request)=>{req(request,"DELETE")},
    patch:(request)=>{req(request,"PATCH")}
}

export const AsyncApi = {
  post: (request) => reqAsync(request, "POST"),
  get: (request) => reqAsync(request, "GET"),
  put: (request) => reqAsync(request, "PUT"),
  delete: (request) => reqAsync(request, "DELETE"),
  patch: (request) => reqAsync(request, "PATCH")
};

function req(request, method) {
  const {
    api,
    body,
    success,
    fail,
    end,
    notice,
    loading = true   
  } = request

  loading && loadingPage(true)

  const m = method.toUpperCase()

  const options = {
    method: m,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + getToken(),
      "lang": getLangType()
    }
  }

  if (body && m !== "GET") {
    options.body = JSON.stringify(body)
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

  const m = method.toUpperCase()

  const options = {
    method: m,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + getToken(),
      "lang": getLangType()
    }
  }

  if (body && m !== "GET") {
    options.body = JSON.stringify(body)
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
