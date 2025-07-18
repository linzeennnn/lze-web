import {list} from '../global'
export default function Load(){
    return(
        <button  className="btn side-btn" 
        title="刷新"
        id="load-btn"
        onClick={()=>list()}
        ></button>
    )
}