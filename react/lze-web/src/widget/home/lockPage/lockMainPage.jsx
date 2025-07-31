import BtnBox from "./btnBox";
import User from "./user";
export default function LockMainPage({prop}){
    return(
        <>
            <User setSwitch={prop.switch}/>
            <BtnBox prop={prop.unlock}/>
        </>
    )
}