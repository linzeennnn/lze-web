import React, { createContext, useContext, useState } from 'react';
import { auth } from './fun';
// 创建 Context
const GlobalContext = createContext();

// 内部变量用来临时存储 setter
let globalSetter = null;
let globalValue = null;

// Provider 组件
export const GlobalProvider = ({ children }) => {
  
  
    let userName=window.localStorage.getItem('userName');
    let token=window.localStorage.getItem('token');
    userName=userName?userName:'visitor';
    token=token?token:'';
  const [globalData, setGlobalData] = useState({
    userName:userName,
    token:token
  }); 

  auth(userName,token)
  // 存储当前值和setter到外部变量
  globalSetter = setGlobalData;
  globalValue = globalData;
 
  return (
    <GlobalContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);


export const getGlobal = () => globalValue;

export const setGlobal = (newValue) => {
  if (globalSetter) {
    globalSetter(newValue);
    globalValue = newValue;
  } else {
    console.warn("AppContext 尚未初始化，无法设置");
  }
};
