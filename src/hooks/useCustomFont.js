import { useState, useEffect } from "react";
import * as Font from "expo-font";

const useCustomFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Satisfy: require("../../assets/fonts/Satisfy-Regular.ttf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  return fontLoaded;
};

export default useCustomFont;
