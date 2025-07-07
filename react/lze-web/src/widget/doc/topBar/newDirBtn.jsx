import {useGlobal} from '../global';

export default function NewDirBtn() {
  const creating = useGlobal((state) => state.creating);
  const setGlobal = useGlobal((state) => state.setGlobal);

  return (
    <>
      {!creating ? (
        <button
          id="new-dir-btn"
          className="btn new-dir-btn"
          title="创建新文件夹"
          onClick={() => setGlobal({ creating: true })}
        ></button>
      ) : (
        <button
          id="new-dir-cancel"
          className="btn new-dir-btn"
          title="取消"
          onClick={() => setGlobal({ creating: false })}
        ></button>
      )}
    </>
  );
}
