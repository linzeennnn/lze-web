function allwidget(type){
fetch(`${protocol}//${ip}/code/home/widget.php`, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain'
    },
    body: `${type}`, 
})
.then(response => {
    return response.json(); 
})
.then(data => {
    console.log(data);
    console.log(data.doc1,data.doc2,data.doc3);
    console.log(data.not1,data.not2,data.not3);
    console.log(data.bok1);
    
})
.catch(error => {
    console.error('发生错误:', error);
});
}