import { GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import '../../../css/common/fileList.css'
export default function GoUp({goUp,isRoot}){
    return (
        <button
          id="go-up"
          className={(isRoot ? 'go-up-disable' : '') + ' btn'}
          disabled={isRoot}
          title={GetText("back")}
          onClick={goUp}
        >{Icon("goUp")}</button>
      );
    }