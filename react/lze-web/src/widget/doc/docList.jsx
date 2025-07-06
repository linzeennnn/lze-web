import * as docFun from './docFun';
import { useEffect, useState } from 'react';
import useGlobal from './global'; // 注意这里引入的是 Zustand 的 store
import { notify } from '../public/notify';

function DocList() {
  // 通过 selector 精确订阅需要的字段（避免无谓重渲）
  const fileList = useGlobal((state) => state.fileList);
  const loading = useGlobal((state) => state.loading);
  const selected = useGlobal((state) => state.selected);
  const nowPath = useGlobal((state) => state.nowPath);
  const setGlobal = useGlobal((state) => state.setGlobal);

  const open_file = (path) => {
    window.location.href = window.location.origin + "/file/Documents" + path;
  };

  useEffect(() => {
    docFun.list("/");
  }, []);

  const doc_click = (name) => {
    let tmp = [...selected];
    if (tmp.includes(name)) {
      tmp.splice(tmp.indexOf(name), 1);
      notify("取消选中[" + name + "]");
    } else {
      tmp.push(name);
      notify("选中[" + name + "]");
    }
    setGlobal({ selected: tmp }); // 更新 selected
  };

  return (
    <>
      <div className="loading" id="list-loading" style={loading ? { display: "block" } : { display: "none" }}></div>
      {fileList.map((item) => (
        <DocItem
          key={"doclist" + item.name}
          item={item}
          selected={selected}
          docClick={doc_click}
          nowPath={nowPath}
        />
      ))}
    </>
  );
}
function DocItem({ item, selected, docClick, nowPath }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      className={`doc-list ${selected.includes(item.name) ? "doc-list-selected" : ""}`}
      onClick={() => docClick(item.name)}
      key={"doclist" + item.name}
    >
      {!editMode ? (
        <>
          <span
            className={(item.type === "dir" || item.type === "dir_link" ? "dir-text" : "file-text") + " file-list-text"}
            title={"查看" + item.name}
            onClick={(e) => {
              e.stopPropagation();

              if (item.type === "dir" || item.type === "dir_link") {
                const dir_path = nowPath === "/" ? nowPath + item.name : nowPath + "/" + item.name;
                docFun.list(dir_path);
              }

              if (item.type === "file" || item.type === "file_link") {
                const file_path = nowPath === "/" ? nowPath + item.name : nowPath + "/" + item.name;
                open_file(file_path);
              }
            }}
          >
            {item.name}
          </span>
          <button className="edit-name file-edit-btn btn" title="重命名" onClick={(e) => {e.stopPropagation();setEditMode(true)}}></button>
        </>
      ) : (
        <>
          <input value={item.name} className="file-list-text file-list-input" onChange={(e) => setNameInput(e.target.value)}/>
          <button className="save-name file-edit-btn btn" title="保存" onClick={(e) => {e.stopPropagation();setEditMode(false)}}></button>
        </>
      )}
    </div>
  );
}
function open_file (path) {
    window.location.href = window.location.origin + "/file/Documents" + path;
  };
export default DocList;
