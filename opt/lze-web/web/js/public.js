// 颜色
const metacolor = {
    dark: {
      default: "#242424",
      green: "#18201b",
      blue: "#181c20",
      yellow: "#202018",
      orange: "#201d18",
      pink: "#201820",
      red: "#201818"
    },
    light: {
      default: "#747474",
      green: "#8eb79d",
      blue: "#8e9fb7",
      yellow: "#b7ad8e",
      orange: "#b79f8e",
      pink: "#b78eab",
      red: "#b78e8e"
    }
  };
  let color = localStorage.getItem('color') || 'default';
  let mode = localStorage.getItem('mode') || 'dark';
  // tooltip
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  document.body.appendChild(tooltip);
  document.addEventListener('mousemove', (event) => {
      const tipwidth = tooltip.offsetWidth;
      const tipheight = tooltip.offsetHeight;  
      const x = event.clientX;
      const y = event.clientY;
      let newX = x+20;
      let newY = y-30;
      if (window.innerWidth - x < 150) {
          newX = x - tipwidth-20; 
      }
      if ( y < 60) {
          newY = y + tipheight-20; 
      }
      tooltip.style.left = `${newX}px`;
      tooltip.style.top = `${newY}px`;
      const target = event.target.closest('[title], [tip-title]');
      if (target) {
          if (target.hasAttribute('title') && !target.hasAttribute('tip-title')) {
              const titleValue = target.getAttribute('title');
              target.setAttribute('tip-title', titleValue);
              target.removeAttribute('title'); 
              tooltip.innerText = titleValue;
          } else if (target.hasAttribute('tip-title')) {
              tooltip.innerText = target.getAttribute('tip-title');
          }
          tooltip.style.display='';
          setTimeout(function(){
          tooltip.style.opacity = '1';
          },500)
      }
  });
  document.addEventListener('mouseout', (event) => {
      const target = event.target.closest('[title], [tip-title]');
      if (target) {
          tooltip.innerText = '';
          tooltip.style.display='none';
          tooltip.style.opacity = '';
      }
  });
  
  