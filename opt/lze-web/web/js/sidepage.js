const sidepage=document.getElementById('sidepage');
const blurpage=document.getElementById('blur-page');
function openside(status){
    if (status==1){
    document.body.style.overflow = 'hidden';
    sidepage.style.display='flex';
    setTimeout(() => {
        sidepage.style.left='0';
        blurpage.style.display='block';
    }, 10); 
}
else {
    sidepage.style.left='';
    blurpage.style.display='';
    setTimeout(() => {
        document.body.style.overflow = '';
        sidepage.style.display='';
    }, 1000); 
}
}