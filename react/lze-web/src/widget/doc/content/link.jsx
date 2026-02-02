
import { notify } from "../../../utils/common";
import { useGlobal, loadPage } from "../global"
import { GetText } from '../../../utils/common';
import LinkWin from "../win/linkWin";
import { Api } from "../../../utils/request";
import { Icon } from "../../../utils/icon";
export default function Link({ name }) {
  return (
    <button
      className="btn link-btn"
      title={GetText("get_link")}
      onClick={(e) => {
        e.stopPropagation()
        getLink(name)
      }}
    >{Icon("link")}</button>
  );
}

// 获取直链并返回 URL
function getLink(name) {
  const global = useGlobal.getState();
  const path = global.nowPath + "/" + name;
Api.post({
  api:"doc/link",
  notice:true,
  body:{path},
  success:(data)=>{
      useGlobal.setState({
        linkWin: {
          link: encodeURI(window.location.origin + "/" + data),
          show: true,
        },
      });
  }
})
}
