import { useGlobal, Save_note } from "../global";
import { WinBg } from '../../../components/winBg';
import { useEffect, useState } from "react";
import { GetText, confirmWin, AddMouseMenu } from "../../../utils/common";
import { Icon } from "../../../utils/icon";

export default function EditWin() {
  const edit = useGlobal((state) => state.edit);
  const [title, setTitle] = useState(edit.title);
  const [text, setText] = useState(edit.text);
  const setGlobal = useGlobal.setState;
  const inner=useGlobal((state) => state.inner);
  useEffect(() => {
    setTitle(edit.title || "");
    setText(edit.text || "");
  }, [edit.title, edit.text]);

  // 保存操作
  const save_edit = async () => {
    if (!await confirmWin.normal(GetText("are_you_sure"))) return;
    Save_note(title, text);
  };

  // Ctrl+S / Cmd+S 快捷键保存
  const key_save = (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
      e.preventDefault();  // 阻止浏览器默认保存
      save_edit();
    }
  };

  // Enter 键保存
  const enter_save = (e) => {
    if (e.key === "Enter") {
      save_edit();
    }
  };

  // 添加右键菜单
  useEffect(() => {
    AddMouseMenu({
      save: {
        name: GetText("save")+"(S)",
        fun: save_edit,
        disable: !edit.mode
      }
    },[edit.mode]);

    // 全局监听 Ctrl+S / Cmd+S
    const handleKeyDown = (e) => key_save(e);
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, text]); // 确保拿到最新 title/text

  return (
    <WinBg showBg={edit.mode ? true : false}>
      <div id="edit-back">
        <button
          className="btn"
          id="close-edit"
          title={GetText("close")}
          onClick={() => setGlobal({ edit: { mode: false, type: "", title: "", text: "" } })}
        >{Icon("no")}</button>

        <button
          className="btn save"
          id="save-edit"
          title={GetText("save")}
          onClick={save_edit}
        ></button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={enter_save} // 回车保存
          id="edit-title"
          type="text"
          placeholder={GetText("title")}
          readOnly={inner.enable}
        />

        <textarea
          value={text}
          id="edit-text"
          placeholder={GetText("input_content")}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </WinBg>
  );
}
