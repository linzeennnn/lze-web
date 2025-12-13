import {useGlobal } from "../global"
import { GetText } from "../../../utils/common"
export default function Add(){
    const edit=useGlobal((state)=>state.edit)
    return(
        <button className="btn side-btn" 
        id="add-btn"
        title={GetText("add")}
        onClick={()=>{
            useGlobal.setState({
                edit:{
                    type:"add",
                    mode:true
                }
            })
        }}
        ></button>
    )
}