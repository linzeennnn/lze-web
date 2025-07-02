import * as docFun  from './docFun'
import { useEffect, useState } from 'react';
function DocList(){
    return(
        <>
        <div className='doc-list'>
            <span>{docFun.list(".")}</span>
        </div>
        </>
    )
}
export default DocList