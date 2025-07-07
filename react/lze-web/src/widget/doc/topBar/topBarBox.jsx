import ShowPath from './showPath';
import Progress from './progress';
import NewDirInput from './newDirInput';
import {useGlobal} from '../global';

export default function TopBarBox({ createStatus }) {
  const [creating, setCreating] = createStatus
  const uploading = useGlobal((state) => state.uploading);

  return (
    <div id="top-bar-box">
      {!creating && <ShowPath />}
      {uploading && <Progress />}
      {creating && <NewDirInput setCreate={setCreating}/>}
    </div>
  );
}
