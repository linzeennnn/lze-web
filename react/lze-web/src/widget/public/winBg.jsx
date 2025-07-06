export function WinBg({showBg}){

    return(
        <div className={showBg?'bg-enable':'bg-disable'}></div>
    )
}