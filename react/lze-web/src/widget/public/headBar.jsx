import '../../css/public/page.css'
import { ScrollContext } from "./scrollTop"
import React, { useContext } from 'react';
function HeadBar(){
    let isScroll=useContext(ScrollContext); 
return(
    <div id="head-bar"  className={isScroll?"scroll-head-bar":""}>
        
    </div>)
}
export default HeadBar;