function Content({ children,innerMode }){
return(
    <div id="content" className={innerMode?"inner-content":""}>
        {children}
    </div>)
}
export default Content;