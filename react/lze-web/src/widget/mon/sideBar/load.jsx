import {list } from "../global";
import { GetText } from '../../../utils/common';
export default function Load(){
    return(
        <button className="btn side-btn" id="load"
        title={GetText("refresh")}
        onClick={()=>{list()}}></button>
    )
}