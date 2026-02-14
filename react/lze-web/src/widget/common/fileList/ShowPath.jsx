import '../../../css/common/fileList.css'
export default function ShowPath({nameList,localList}) {
  return (
    <div id="show-path">
      <span>
        {
          nameList.map((name,index)=>(
            <span key={index+name}
            onClick={() => {localList(index)}}
            >
              {(name?"/":"")+name}
              </span>
          ))
        }
      </span>
    </div>
  );
}
