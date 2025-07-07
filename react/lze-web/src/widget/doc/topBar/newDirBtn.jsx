import {useGlobal} from '../global';

export default function NewDirBtn({createStatus}) {
  const [creating, setCreating] = createStatus

  return (
    <>
      {!creating ? (
        <button
          id="new-dir-btn"
          className="btn new-dir-btn"
          title="创建新文件夹"
          onClick={() => setCreating(true)}
        ></button>
      ) : (
        <button
          id="new-dir-cancel"
          className="btn new-dir-btn"
          title="取消"
          onClick={() => setCreating(false)}
        ></button>
      )}
    </>
  );
}
