
import { notify } from "../../../utils/common";
import { useGlobal} from "../global"
import { GetText } from '../../../utils/common';
import LinkWin from "../win/linkWin";
import { Api } from "../../../utils/request";
import { Icon } from "../../../utils/icon";
import { getNowPath } from "../../../store/CacheList";
export default function Link({ name }) {
  return (
    <button
      className="btn file-item-btn link-btn"
      title={GetText("get_link")}
      onClick={(e) => {BtnClink(e,name)}}
    >{Icon("link")}</button>
  );
}
function BtnClink(e,name){
        e.stopPropagation()
        getLink(name)
}
// 获取直链并返回 URL
function getLink(name) {
  const path = getNowPath() + "/" + name;
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
