import Content from '../../../components/content'
import {notify} from '../../../components/notify'
import {useGlobal} from '../global'
import FileItem from './fileItem';
export default function DocContent(){
    const doc_click = (name) => {
      let tmp = [...selected];
      if (tmp.includes(name)) {
        tmp.splice(tmp.indexOf(name), 1);
        notify("取消选中");
      } else {
        tmp.push(name);
        notify("已选择"+tmp.length+"个文件")
      }
      setGlobal({ selected: tmp }); // 更新 selected
    };
  const fileList = useGlobal((state) => state.fileList);
  const selected = useGlobal((state) => state.selected);
    const setGlobal = useGlobal((state) => state.setGlobal);
    return(
        <Content>
            {fileList.map((fileMes) => (
        <FileItem
          key={"doclist" + fileMes[0]}
          fileMes={fileMes}
          selected={selected}
          docClick={doc_click}
        />
      ))}
        </Content>
    )
}
