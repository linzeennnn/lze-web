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