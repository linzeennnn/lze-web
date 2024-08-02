    document.querySelector('header').addEventListener('mouseenter', function() {
  document.querySelector('.ui-tooltip').style.backgroundColor = '#1e2325d2';
  document.querySelector('body').style.backgroundImage = `url(../../icon/home_pc.svg)`;

})
document.querySelector('header').addEventListener('mouseleave', function() {
  document.querySelector('body').style.backgroundImage = '';
  document.querySelector('.ui-tooltip').style.backgroundColor = '';
})
