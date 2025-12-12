import Content from '../../../components/content'
import { notify } from '../../../utils/common';
import {useGlobal} from '../global'
import { GetText } from '../../../utils/common';
import FileItem from './fileItem';
export default function TraContent(){
    const tra_click = (name) => {
      let tmp = [...selected];
      if (tmp.includes(name)) {
        tmp.splice(tmp.indexOf(name), 1);
        notify.normal(GetText("cancel"));
      } else {
        tmp.push(name);
        notify.normal(GetText("selected")+tmp.length+GetText("file"))
      }
      setGlobal({ selected: tmp }); // 更新 selected
    };
  const fileList = useGlobal((state) => state.fileList);
  const selected = useGlobal((state) => state.selected);
    const setGlobal = useGlobal((state) => state.setGlobal);
    return(
        <Content>
            {fileList.map((fileMes,index) => (
        <FileItem
          key={"tralist" + fileMes[0]+index}
          fileMes={fileMes}
          selected={selected}
          traClick={tra_click}
        />
      ))}
        </Content>
    )
}
