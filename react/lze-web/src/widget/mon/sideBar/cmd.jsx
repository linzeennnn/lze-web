import { useGlobal } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function Cmd() {

  const openCmd = () => {
    useGlobal.setState({ showCmd: true });
  };

  useEffect(() => {
    AddMouseMenu({
      terminal: {
        name: GetText("terminal"),
        fun: openCmd,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      title={GetText("terminal")}
      onClick={openCmd}
    >{Icon("shell")}</button>
  );
}
