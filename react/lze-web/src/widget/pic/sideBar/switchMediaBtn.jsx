import { useGlobal } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function SwitchMediaBtn() {
  const setGlobal = useGlobal.setState;
  const pageNum = useGlobal((state) => state.pageNum);
  const imgPage = useGlobal((state) => state.imgPage);

  const changePage = (type) => {
    switch (type) {
      case "img":
        setGlobal({ imgPage: true, pageNum: imgPage ? pageNum : 1 });
        break;
      case "vid":
        setGlobal({ imgPage: false, pageNum: imgPage ? 1 : pageNum });
        break;
    }
  };

  // 注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      img: {
        disable: imgPage,
        name: GetText("image"),
        fun: () => changePage("img"),
      },
      vid: {
        disable: !imgPage,
        name: GetText("video"),
        fun: () => changePage("vid"),
      }
    });
  }, [imgPage]);

  return (
    <>
      <button
        className={"btn side-btn " + (imgPage ? "media-selected" : "")}
        title={GetText("image")}
        onClick={() => changePage("img")}
      >{Icon("photo")}</button>

      <button
        className={"btn side-btn " + (!imgPage ? "media-selected" : "")}
        title={GetText("video")}
        onClick={() => changePage("vid")}
      >{Icon("video")}</button>
    </>
  );
}
