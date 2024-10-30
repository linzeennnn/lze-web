function allwidget(type){
    let doc = [1, 2, 3].map(i => document.getElementById(`doc-li${i}`));
    let not = [1, 2, 3].map(i => document.getElementById(`not-li${i}`));
    let mon = [1, 2, 3].map(i => document.getElementById(`mon-li${i}`));
    let pic=document.getElementById(`pic`);
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
    doc.forEach((el, index) => el.innerText = data[`doc${index + 1}`]);
    not.forEach((el, index) => el.innerText = data[`not${index + 1}`]);
    mon.forEach((el, index) => el.innerText = data[`mon${index + 1}`]);
    pic.style.backgroundImage = `url(../../icon/${data.pic1})`;
    console.log(data);
    console.log(data.doc1,data.doc2,data.doc3);
    console.log(data.not1,data.not2,data.not3);
    console.log(data.bok1);
    
})
.catch(error => {
    console.error('发生错误:', error);
});
}