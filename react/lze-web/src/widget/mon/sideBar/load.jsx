import { list } from "../global";
export default function Load(){
    return(
        <button className="btn" id="load"
        title="刷新"
        onClick={()=>{list()}}></button>
    )
}