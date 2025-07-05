import ShowPath from './showPath'
import Progress from './progress'
import NewDirInput from './newDirInput'
import {useGlobal} from './global'
export default function TopBarBox({children}){
    const{ value, setValue}=useGlobal()
    return(
        <div id="top-bar-box">
            
            {(!value.creating?(<ShowPath/>):null)}
            {(value.uploading?(<Progress/>):null)}
            {(value.creating?(<NewDirInput/>):null)}
            
        </div>
    )
}