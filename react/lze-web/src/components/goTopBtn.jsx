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
        }>
        </div>
    )
}
export default GoTopBtn