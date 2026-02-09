import { GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useGlobal } from "../global";
import FloatWin from '../../common/floatWin'
export default function FileWin(){
    const fileWin=useGlobal(state=>state.fileWin)
    return (
        <FloatWin
        show={fileWin}
        title={GetText('addFile')}
        setShow={()=>{useGlobal.setState({fileWin: false})}}
        >
            <div className="file-win">
                
            </div>
        </FloatWin>
    )
}