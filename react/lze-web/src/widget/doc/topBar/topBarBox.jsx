import ShowPath from './showPath';
import NewDirInput from './newDirInput';
import {useGlobal,list} from '../global';
import { notify } from '../../public/notify';
export default function TopBarBox({ createStatus }) {
  const [creating, setCreating] = createStatus
    const upload=useGlobal((state) => state.upload); 
    const nowPath=useGlobal((state) => state.nowPath);
  return (
    <div id="top-bar-box">
     
      {!creating && !upload.status&& (<button id='home-icon' className='btn'
      title='回到主目录' onClick={()=>{
        if(nowPath==''){
          notify('已在主目录')
          return
        }
        list('')}}
      ></button>)}
      {!creating && !upload.status&&<ShowPath />}
        {}
      {
        upload.status && (
    <>
      <div id='progress' style={{ width: upload.percent }}></div>
      <span id='progress-text'>{upload.percent}</span>
    </>
  )
      }
      {creating && !upload.status&&<NewDirInput setCreate={setCreating}/>}
    </div>
  );
}
