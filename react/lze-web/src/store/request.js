import { create } from "zustand";

export const useRequestStore = create((set) => ({
  request: {
    url: "",
    token: "",
    username: "guest"
  },

  setRequest: (data) => set({ request: data }),

  setInnerUrl: (url) =>
    set((state) => ({
      request: { ...state.request, url }
    })),

  setInnerToken: (token) =>
    set((state) => ({
      request: { ...state.request, token }
    })),

  setInnerUsername: (username) =>
    set((state) => ({
      request: { ...state.request, username }
    }))
}));

export function InitRequest() {
  // 初始化 URL
  const url = window.location.origin + "/server/";
  useRequestStore.getState().setInnerUrl(url);

  // 初始化 token
  const token = localStorage.getItem("token");
  if (token) {
    useRequestStore.getState().setInnerToken(token);
  }

  // 初始化 username（如果存在）
  const username = localStorage.getItem("username");
  if (username) {
    useRequestStore.getState().setInnerUsername(username);
  }
}

// setters
export function setUrl(url) {
  useRequestStore.getState().setInnerUrl(url);
}

export function setToken(token) {
  useRequestStore.getState().setInnerToken(token);
}

export function setUsername(username) {
  useRequestStore.getState().setInnerUsername(username);
}

// getters
export function getUrl() {
  return useRequestStore.getState().request.url;
}

export function getToken() {
  return useRequestStore.getState().request.token;
}

export function getUsername() {
  return useRequestStore.getState().request.username;
}
