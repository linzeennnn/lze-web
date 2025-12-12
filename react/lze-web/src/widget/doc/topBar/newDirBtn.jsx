
import { GetText } from '../../../utils/common';

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
        ></button>
      ) : (
        <button
          id="new-dir-cancel"
          className="btn new-dir-btn"
          title={GetText("cancel")}
          onClick={() => setCreating(false)}
        ></button>
      )}
    </>
  );
}
