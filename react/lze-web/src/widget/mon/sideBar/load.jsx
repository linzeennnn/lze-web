import { GetText, list } from "../global";
export default function Load(){
    return(
        <button className="btn side-btn" id="load"
        title={GetText("refresh")}
        onClick={()=>{list()}}></button>
    )
}