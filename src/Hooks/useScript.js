import { useState, useEffect } from "react";

const addScript = ({ src, id, onLoad }) => {
  const existing = document.getElementById(id);
  if (existing) {
    return existing;
  } else {
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = true;
    script.onload = () => {
      if (onLoad) {
        onLoad();
      }
    };
    document.body.appendChild(script);
    return script;
  }
};

function useScript() {
  const [isLoaded, setIsLoaded] = useState(null);

  useEffect(() => {
    addScript({
      src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyCetaEjfgUB4q-IoCrPA9F_00uPSNydVY0&callback=onLoad`,
      id: "gmaps-script",
      onLoad: () => {
        console.log("Script loaded!");
        setIsLoaded(true);
      },
    });
  });

  return isLoaded;
}

export default useScript;
