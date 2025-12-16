import { create } from "zustand";
const useApiStore = create((set) => ({
  request: {
    url: "",
    token: ""
  },
  setRequest: (data) => set({ request: data }),
  setUrl: (url) => set((state) => ({ request: { ...state.request, url } })),
  setToken: (token) => set((state) => ({ request: { ...state.request, token } }))
}));
export function InitRequest() {
  // 初始化 URL
  const url = window.location.origin + "/server/";
  useApiStore.getState().setUrl(url);

  // 初始化 token
  const token = localStorage.getItem("token");
  if (token) {
    useApiStore.getState().setToken(token);
  }
}
export function getUrl() {
  return useApiStore.getState().request.url;
}

export function getToken() {
  return useApiStore.getState().request.token;
}