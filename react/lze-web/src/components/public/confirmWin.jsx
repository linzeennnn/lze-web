import { useEffect } from "react";
import { GetText } from "../../utils/common";
import { WinBg } from "../winBg";
import { useConfirmStore } from "../../store/confirm";

export default function ConfirmWin() {
  const { msg, type, show, close } = useConfirmStore();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
     close(true)
     
    }
    if (e.key === "Escape" ) {
      e.preventDefault();
      close(false)
    }
  };

  useEffect(() => {
    if (!show) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, type, close]);

  if (!show) return null;
  const run=(isRun)=>{
    close(isRun)
  }
  return (
    <WinBg showBg={show} className={"confirm-" + type}>
      <div id="confirm-win">
        <span id="confirm-title">{GetText("warning") + ":"}</span>
        <span id="confirm-content">{msg}</span>
        <div id="confirm-btn-bar">
          <button className="confirm-btn btn" onClick={() => run(true)}>
            {GetText("confirm")}
          </button>
          {type === "err" ?null: (
            <button className="confirm-btn btn" onClick={() => run(false)}>
              {GetText("cancel")}
            </button>
          ) }
        </div>
      </div>
    </WinBg>
  );
}
