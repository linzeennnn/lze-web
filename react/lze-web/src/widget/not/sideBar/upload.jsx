import { GetText, AddMouseMenu } from "../../../utils/common";
import { useGlobal, Upload, UploadPermit } from "../global";
import { useEffect, useRef } from "react";

export default function UploadBtn() {
  const setGlobal = useGlobal.setState;
  const upload = useGlobal((state) => state.upload);

  const inputRef = useRef(null); // ref 保留

  // 上传逻辑
  const uploadChange = async (files) => {
    setGlobal({
      upload: {
        ...upload,
        status: true,
      },
    });

    const fileArr = Array.from(files);
    let uploadData = {
      totalSize: 0,
      sendSize: 0,
    };

    fileArr.forEach((file) => {
      uploadData.totalSize += file.size;
    });

    const permitted = await UploadPermit();
    if (!permitted) return;

    fileArr.forEach((file) => {
      Upload(file, uploadData);
    });
  };

  // 右键菜单触发上传
  const uploadMenu = () => {
    inputRef.current?.click();
  };

  // 注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      upload: {
        name: GetText("upload"),
        fun: uploadMenu,
      },
    });
  }, []);

  return (
    <>
      <input
        id="upFile"           // 保留 id
        ref={inputRef}         // 使用 ref
        style={{ display: "none" }}
        type="file"
        multiple
        onChange={(e) => {
          uploadChange(e.target.files);
          e.target.value = null; // 清空文件选择
        }}
      />
      <label
        className="btn side-btn"
        id="upload-btn"
        title={GetText("upload")}
        htmlFor="upFile"
        onClick={() => inputRef.current?.click()} // 按钮点击
      ></label>
    </>
  );
}
