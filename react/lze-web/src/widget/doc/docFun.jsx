import { createContext, useContext, useEffect, useRef, useState } from "react";

// 初始化
export const GlobalContext=createContext();
export const GlobalProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);
useEffect(() => {
    const data={
      nowPath:"/",
      parentPath:"/",
      doclist:[]
    }
    setGlobalData(data);
  }, []);
  return (
    <GlobalContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalContext.Provider>
  );
}
// 扫描目录
export function list(path) {
    const {globalData,setGlobalData}=useContext(GlobalContext)
    let tmpData=globalData;
  const sendData = { folder: path };
   fetch('http://127.0.0.1/server/doc/list', {
    method: 'POST',
    body: JSON.stringify(sendData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => 
    tmpData.doclist=
  );
}
