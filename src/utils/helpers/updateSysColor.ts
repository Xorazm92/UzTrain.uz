const updateSysColor = (color: string) => {
    if (color === "orangey") {
      document.documentElement.style.setProperty("--sys-color", "rgb(244, 227, 196)");
    } else if (color === "greeny") {
      document.documentElement.style.setProperty("--sys-color", "rgb(193, 247, 193)");
    } else if (color === "bluey") {
      document.documentElement.style.setProperty("--sys-color", "lightblue");
    } else if (color === "pinky") {
      document.documentElement.style.setProperty("--sys-color", "lightpink");
    } else if (color === "whitey") {
      document.documentElement.style.setProperty("--sys-color", "#f5f5f5");
    } else if (color === "greyy") {
      document.documentElement.style.setProperty("--sys-color", "grey");
    } else if (color === "yellowy") {
      document.documentElement.style.setProperty("--sys-color", "rgb(248, 248, 151)");
    }
  };
  
  export default updateSysColor;