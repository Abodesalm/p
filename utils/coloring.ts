const coloring = (num) => {
  if (num === 100) return "green";
  else if (num < 100 && num >= 85) return "cyan";
  else if (num < 85 && num >= 70) return "yellow";
  else if (num < 70 && num >= 60) return "orange";
  else if (num < 60) return "red";
};

export default coloring;
