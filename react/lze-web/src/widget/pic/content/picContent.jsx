import { useEffect } from "react";
import Content from  "../../../components/content";
import ImgPage from "./imgPage";
import VidPage from "./vidPage";
import { list,useGlobal } from "../global";
import PageBar from "./pageBar";
export default function PicContent() {
  const imgPage = useGlobal((state) => state.imgPage);
    return (
        <Content>
          <div id="pic-box">
         {imgPage? <ImgPage/>:
          <VidPage/>}
          </div>
            <PageBar/>
        </Content>
    )}