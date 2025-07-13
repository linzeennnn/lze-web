export function WinBg({showBg,children}){

    return(
        <div className={showBg?'bg-enable':'bg-disable'}>{children}</div>
    )
}