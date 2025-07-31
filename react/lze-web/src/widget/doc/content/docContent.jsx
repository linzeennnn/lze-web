import Content from '../../../components/content'
import {notify} from '../../../components/notify'
import {GetText, useGlobal} from '../global'
import FileItem from './fileItem';
export default function DocContent(){
    const doc_click = (name) => {
      let tmp = [...selected];
      if (tmp.includes(name)) {
        tmp.splice(tmp.indexOf(name), 1);
        notify(GetText("cancel"));
      } else {
        tmp.push(name);
        notify(GetText("selected")+tmp.length+GetText("file"))
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
