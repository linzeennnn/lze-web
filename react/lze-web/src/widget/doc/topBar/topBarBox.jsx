import ShowPath from './showPath';
import Progress from './progress';
import NewDirInput from './newDirInput';
import {useGlobal,list} from '../global';

export default function TopBarBox({ createStatus }) {
  const [creating, setCreating] = createStatus
  const uploading = useGlobal((state) => state.uploading);

  return (
    <div id="top-bar-box">
      <button id='home-icon' className='btn'
      title='回到主目录' onClick={()=>{list('')}}
      ></button>
      {!creating && <ShowPath />}
      {uploading && <Progress />}
      {creating && <NewDirInput setCreate={setCreating}/>}
    </div>
  );
}
