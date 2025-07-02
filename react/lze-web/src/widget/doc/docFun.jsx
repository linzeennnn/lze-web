export function list(path){
    const sendData={
        folder:path
    }
    fetch('http://127.0.0.1/server/doc/list',{
        method:'POST',
        body:JSON.stringify(sendData),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json()) 
    .then(data=>{
        console.log(JSON.stringify(data));
        
        return JSON.stringify(data)
    })
}