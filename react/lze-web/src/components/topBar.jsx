import { ScrollContext } from "./scrollTop"
import React, { Children, useContext } from 'react';
function TopBar({ children }){
    let isScroll=useContext(ScrollContext); 
return(
    <div id="top-bar" className={isScroll?"scroll-top-bar":""}>
        {children}
    </div>
    )
}
export  default TopBar