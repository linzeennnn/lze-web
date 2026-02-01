
import Content from  "../../../components/content";
import ImgPage from "./imgPage";
import VidPage from "./vidPage";
import { list,useGlobal } from "../global";
import PageBar from "./pageBar";
export default function PicContent() {
  const imgPage = useGlobal((state) => state.imgPage);
  const inner=useGlobal((state) => state.inner);
    return (
        <Content  innerMode={inner.enable}>
          <div id="pic-box">
         {imgPage? <ImgPage inner={inner}/>:
          <VidPage inner={inner}/>}
          </div>
          {inner.enable?null:<PageBar/>}
        </Content>
    )}