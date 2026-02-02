
import { GetText } from '../../../utils/common';
import { Icon } from '../../../utils/icon';

export default function NewDirBtn({createStatus}) {
  const [creating, setCreating] = createStatus

  return (
    <>
      {!creating ? (
        <button
          id="new-dir-btn"
          className="btn new-dir-btn"
          title={GetText("create_folder")}
          onClick={() => setCreating(true)}
        >{Icon("addFolder")}</button>
      ) : (
        <button
          className="btn new-dir-btn"
          title={GetText("cancel")}
          onClick={() => setCreating(false)}
        >{Icon("no")}</button>
      )}
    </>
  );
}
