import Content from '../../../components/content'
import { notify } from '../../../utils/common';
import {useGlobal} from '../global'
import { GetText } from '../../../utils/common';
import FileItem from './fileItem';
import { useFileCacheStore } from '../../../store/CacheList';
export default function DocContent(){
    const doc_click = (name) => {
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
  const cache = useFileCacheStore((state) => state.fileCache);
  const fileList = cache.fileList?.[cache.current] ?? [];
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
