import  {useGlobal} from'./global'
export default function ShowPath(){
    const {value: data}=useGlobal()
    return(
        <div id='show-path' title={data.nowPath}>
        <span >{data.nowPath}</span>
        </div>
    )
}