import {list} from '../global'
import { GetText } from '../../../utils/common'
export default function Load(){
    return(
        <button  className="btn side-btn" 
        title={GetText("refresh")}
        id="load-btn"
        onClick={()=>list()}
        ></button>
    )
}