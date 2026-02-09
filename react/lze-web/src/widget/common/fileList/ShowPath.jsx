import '../../../css/common/fileList.css'
export default function ShowPath({nowPath}) {

  return (
    <div id="show-path" title={nowPath}>
      <span>{nowPath}</span>
    </div>
  );
}
