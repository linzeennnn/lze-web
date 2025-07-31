import {GetText, list} from '../global'
export default function Load(){
    return(
        <button  className="btn side-btn" 
        title={GetText("refresh")}
        id="load-btn"
        onClick={()=>list()}
        ></button>
    )
}