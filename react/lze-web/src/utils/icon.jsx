import { getIconPath} from "../store/icon"

export function  Icon(name,color="text"){
  return(
      <svg aria-hidden="true"
      stroke={`var(--${color})`}  
      fill="none"
       strokeWidth="2" 
       strokeLinecap="round" 
       strokeLinejoin="round"
      viewBox="0 0 24 24">
        {getIconPath(vaildName(name))}
      </svg>
    )
}
export function FillIcon(name,color="text"){
  return(
      <svg aria-hidden="true"
      fill={`var(--${color})`} 
      viewBox="0 0 24 24">
        {getIconPath(vaildName(name))}
      </svg>
    )
}
function vaildName(name){
  switch (name) {
    case "dir":
    case "dir_link":
      return "doc"
    case "img":
      return "pic"
    default:
      return name
  }
}