import { Children } from "react"
import { createContext, useState} from "react"
export const WinBgContext = createContext({
  showBg: false,
  setBg: () => {}
})
export function WinBg({children}){
    const [showBg, setBg] = useState(false)
    return(
        <WinBgContext.Provider value={{ showBg, setBg }}>
        <div className={showBg?'bg-enable':'bg-disable'}></div>
        {children}
        </WinBgContext.Provider>
    )
}