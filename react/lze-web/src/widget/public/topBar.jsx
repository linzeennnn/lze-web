import { ScrollContext } from "./scrollTop"
import React, { useContext } from 'react';
function TopBar(){
    let isScroll=useContext(ScrollContext); 
return(
    <div id="top-bar" className={isScroll?"scroll-top-bar":""}>
    </div>
    )
}
export  default TopBar