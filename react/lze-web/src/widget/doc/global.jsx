import React, { createContext, useContext, useState } from 'react';

// 创建 Context
const GlobalContext = createContext();

// 内部变量用来临时存储 setter
let globalSetter = null;
let globalValue = null;

// Provider 组件
export const GlobalProvider = ({ children }) => {
  const [value, setValue] = useState({
    nowPath:'/',
    parentPath:'/',
    fileList:[]
  }); 

  // 存储当前值和setter到外部变量
  globalSetter = setValue;
  globalValue = value;
 
  return (
    <GlobalContext.Provider value={{ value, setValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);


export const getGlobal = () => globalValue;


export const setGlobal = (newValue) => {
  if (globalSetter) {
    globalSetter(newValue);
    globalValue = newValue; // 同步更新 globalValue
  } else {
    console.warn("AppContext 尚未初始化，无法设置");
  }
};
