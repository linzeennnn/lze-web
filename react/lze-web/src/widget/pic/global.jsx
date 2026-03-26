import { create } from 'zustand';
import { Api, AsyncApi } from '../../utils/request';
import { GetPageSession, SetPageSession } from '../../utils/pageSession';
import { PageInit } from '../../utils/pageInit';
import { AddCacheList } from '../../utils/CacheList';
import { baseName } from '../../utils/path';
import { getFileList, getNowPath } from '../../store/CacheList';
// 全局变量
export const useGlobal = create((set, get) => ({
  imgList: [],
  vidList: [],
  dirList: [],
  uploading: false,
  showBg: false,
  updateList: true,//如果是edit的话要设置成false,不然会出现两张一样的图片
  editWin:{
    status:false,
    url:"",
    index:0,
    newSaveImg:""
  },
  inner:{
    enable:false,
    source:"",  
    media:"",
    url:"",
    name:"",
    path:""
  },
  pageNum:1,
  listSession:{
    name:"",
    media:""
  },
  loading: false,
  dragWin:false,
  imgPage:true,
  mediaWin:{
    status:false,
    img:true,
    path:window.location.origin+"/file/Pictures/",
    index:0
  },
  select:{
    status:false,
    list:[]
  },
  upload:{
    status:false,
    percent:"0%"
  },
  setGlobal: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },
  replaceGlobal: (newState) => {
    set(() => ({ ...newState }));
  },
  getGlobal: () => get(),
}));
// 初始化
export function InitData(){
PageInit("pic")
  const pageSession = GetPageSession();
 const { 
  pic: { 
    inner, 
    list: { path } 
  } 
} = pageSession;
  
  // 同步到 zustand（复制一份，断引用）
  useGlobal.setState({
    listSession: { ...path },
    inner: { ...inner },
    imgPage:(inner.media=="img")
  });
  
  // reset session
  pageSession.pic.inner = {
    enable: false,
    source: "",
    name: "",
    media:"",
    url: "",
    path:""
  };
  pageSession.pic.list.path = {name:"",media:""};
  SetPageSession(pageSession);
  list("",(useGlobal.getState().listSession.media=="vid"))
}
// 扫描目录
export function list(path,showVideo) {
  const inner=useGlobal.getState().inner
  const setGlobal=useGlobal.setState
  if(inner.enable){
    setGlobal({
      imgList:(inner.media=="img"?[[inner.name]]:[]),
      vidList:(inner.media!="img"?[[inner.name]]:[])
    })
  }else{
 Api.post({
  api:"pic/list",
  body:{folder: path},
  success:(data)=>{
    
    AddCacheList({
            nowPath:data.currentFolder,
            fileList:data.filelist,
            name:baseName(data.currentFolder)
          })
        setGlobal({
      select: {
        status:false,
        list: []
    }
});   
SortList(showVideo)
  }
 })
}
}
// 给文件列表分类
export function SortList(showVideo){
        let tmpDir=[]
        let tmpImg=[]
        let tmpVid=[]
        let tmpGroupImg=[]
        let tmpGroupVid=[]
        const fileList=getFileList()
    fileList.forEach((item) => {
            if(item[1]=="dir"||item[1]=="dir_link"){
                tmpDir.push(item[0])
            }
            else{
                    if(item[1]=="img"){
                        if(tmpGroupImg.length<12){
                            tmpGroupImg.push(item[0])
                        }
                        else{
                            tmpImg.push(tmpGroupImg)
                            tmpGroupImg=[]
                            tmpGroupImg.push(item[0])
                        }
                    }
                    if(item[1]=="vid"){
                        if(tmpGroupVid.length<12){
                            tmpGroupVid.push(item[0])
                        }
                        else{
                            tmpVid.push(tmpGroupVid)
                            tmpGroupVid=[]
                            tmpGroupVid.push(item[0])
                        }
                    }
            }
        })
       if(tmpGroupImg.length>0) tmpImg.push(tmpGroupImg)
       if(tmpGroupVid.length>0) tmpVid.push(tmpGroupVid)
        const current=getCurrentShowNum(tmpImg,tmpVid)
      console.log();
      
      useGlobal.setState({
        dirList: tmpDir,
        imgList: tmpImg,
        vidList: tmpVid,
        selected: [],
        imgPage: showVideo ? false : true,
        pageNum:current
      });
}
// 获取当前要刷新的页面的编号
function getCurrentShowNum(newImg,newVid){
  let currnetNum
  const oldLength=
  countMediaNum(useGlobal.getState().imgList)
  +countMediaNum(useGlobal.getState().vidList)
  const newLength=
  countMediaNum(newImg)
  +countMediaNum(newVid)
    
  if(oldLength<newLength){
      currnetNum=1
  }else{
    currnetNum=useGlobal.getState().pageNum
    if(newLength%12==0&&currnetNum!=1)
      currnetNum--
  }
  return currnetNum
}
function countMediaNum(arr){
  return ((arr.length-1)*12+(arr.length==0?0:arr[arr.length-1].length))
}
// 关闭mediawin
export function closeMediaWin(){
 useGlobal.setState({ mediaWin: { status: false } })
}
// 打开mediaWin
export function openMediaWin(url,type,index){
const setGlobal=useGlobal.setState
setGlobal({mediaWin:{
    url:url,
    img:type=="img"?true:false,
    status:true,
    index:index
}})

}
// 打开编辑窗口
export function openEditWin(url,index){
const setGlobal=useGlobal.setState
setGlobal({editWin:{
    url:url,
    status:true,
    index:index
}})
}
// 关闭编辑窗口
export function closeEditWin(){
  const editWin=useGlobal.getState().editWin
  useGlobal.setState({ editWin: {...editWin, status: false } })
}