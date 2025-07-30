import {useGlobal}from '../global'; 
import{WinBg} from '../../../components/winBg'
export default function LoadWin(){
  const showBg = useGlobal((state) => state.showBg);
  const loading = useGlobal((state) => state.loading);
    return(
        <>
    <div className="loading" id="list-loading" 
    style={loading ? { display: "block" } : 
    { display: "none" }}></div>  
      <WinBg showBg={showBg} />
        </>
    )
}