import { Icon } from "../utils/icon";
import { ScrollContext } from "./scrollTop"
import React, { useContext } from 'react';
function GoTopBtn({innerMode}){
    let isScroll=useContext(ScrollContext); 
    return(
        <div id="go-top-btn" 
        onClick={()=>{window.scrollTo({
  top: 0,
  behavior: 'smooth' 
})}}
        className={(isScroll?"scroll-go-top-btn ":"")+
            (innerMode?"inner-top-btn":"")
        }>{Icon("toUp")}
        </div>
    )
}
export default GoTopBtn