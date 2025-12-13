
import { notify } from "../../../utils/common";
import { useGlobal, loadPage } from "../global"
import { GetText } from '../../../utils/common';
import LinkWin from "../win/linkWin";
export default function Link({ name }) {
  return (
    <button
      className="btn link-btn"
      title={GetText("get_link")}
      onClick={(e) => {
        e.stopPropagation()
        getLink(name)
      }}
    ></button>
  );
}

// 获取直链并返回 URL
function getLink(name) {
  const global = useGlobal.getState();
  const path = global.nowPath + "/" + name;
  const url = global.docUrl + "link";
  const body = { path };

  loadPage(true);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + global.token,
    },
    body: JSON.stringify(body),
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          notify.err(GetText("no_per"));
        } else {
          notify.err(GetText("error") + ":" + res.status);
        }
        throw new Error("HTTP error " + res.status);
      }
      return res.text();
    })
    .then(text => {
      useGlobal.setState({
        linkWin: {
          link: encodeURI(window.location.origin + "/" + text),
          show: true,
        },
      });
      
    })
    .catch(err => {
      console.error("Fetch failed:", err);
    })
    .finally(() => {
      loadPage(false);
    });
}
