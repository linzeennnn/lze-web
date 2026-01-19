import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText, notify, confirmWin } from '../../../utils/common';
import { Api } from "../../../utils/request";
import { useEffect } from "react";

export default function Recover() {

  const recover = async () => {
    const global = useGlobal.getState();

    const recover_list = global.selected;
    const source_path = global.source_path;
    const nowPath = global.nowPath;

    if (!await confirmWin.normal(GetText("are_you_sure"))) return;

    Api.post({
      api: "tra/recover",
      body: { recover_list, source_path },
      notice: true,
      end: () => {
        list(nowPath);
      }
    });
  };

  useEffect(() => {
    AddMouseMenu({
      recover: {
        name: GetText("restore"),
        fun: recover,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      id="recover"
      title={GetText("restore")}
      onClick={recover}
    ></button>
  );
}
