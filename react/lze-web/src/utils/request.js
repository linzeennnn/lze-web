import { getLangType } from "../store/lang"
import { getUrl,getToken } from "../store/request"
import { loadingPage, notify } from "./common"

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
  loadingPage(true)
 const {
    api,
    body,
    success,
    fail,
    end,
    notice
  } = request;
  const m = method.toUpperCase();
  const options = {
    method: m,
    headers: {
      "Content-Type": "application/json",
      'authorization':"Bearer " +getToken(),
      'lang':getLangType()
    }
  };
  if (body && m !== "GET") {
    options.body = JSON.stringify(body);
  }

  fetch(getUrl()+api, options)
    .then(res => res.json())
    .then(res => {
      const { code, msg, data } = res;

      if (code === 200) {
        if(notice)
            notify.normal(msg)
       success && success(data);
        loadingPage(false)
      } else {
        notify.err(msg)
      fail && fail();
        loadingPage(false)
      }
      end&&end()
      loadingPage(false)
    })
    .catch(err => {
        notify.err(err)
        loadingPage(false)
    });
}

async function reqAsync(request, method) {
  const { api, body,  notice } = request;
  const m = method.toUpperCase();
  const options = {
    method: m,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + getToken(),
      "lang": getLangType()
    }
  };

  if (body && m !== "GET") {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(getUrl() + api, options);
    const result = await res.json();
    const { code, msg, data } = result;

    if (code === 200) {
      if (notice) notify.normal(msg);
      return data
    } else {
      notify.err(msg);
      return null
    }
  } catch (err) {
    notify.err(err)
  }
}