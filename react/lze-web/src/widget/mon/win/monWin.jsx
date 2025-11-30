import LoadWin from "./loadWin";
import CmdWin from "./cmdWin";
import LogoutWin from "./logoutWin";
export default function MonWin(){
    return(
        <>
        <CmdWin/>
        <LogoutWin/>
        <LoadWin/>
        </>
    )
}