import ShowPath from './showPath';
import Progress from './progress';
import NewDirInput from './newDirInput';
import {useGlobal} from '../global';

export default function TopBarBox({ children }) {
  const creating = useGlobal((state) => state.creating);
  const uploading = useGlobal((state) => state.uploading);

  return (
    <div id="top-bar-box">
      {!creating && <ShowPath />}
      {uploading && <Progress />}
      {creating && <NewDirInput />}
    </div>
  );
}
