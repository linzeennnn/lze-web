import { useGlobal } from "../../global";
import WidgetItem from "./widgetItem";
export default function Widget({tmpLoad}) {
    const locked = useGlobal(state => state.locked);
    const widgetData = useGlobal((state)=>state.widgetData);
    const theme=useGlobal(state=>state.theme)
    const widget = ['doc', 'pic',  'tra', 'mon', 'not','bok'];
    const rows = [];
    for (let i = 0; i < widget.length; i += 2) {
        rows.push(widget.slice(i, i + 2));
    }
    return (
        <div id='widget'
        className={(!locked&&tmpLoad)?"widget-load":""}
        >
            {rows.map((row, index) => (
                <div key={`line${index}`} className="widget-line">
                    {row.map((item) => (
                        <WidgetItem item={item} key={item} theme={theme} to_next={to_next}
                        widgetData={widgetData}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
function to_next(type){
window.location.href=type;
}