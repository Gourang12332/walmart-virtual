"use client";

import dynamic from "next/dynamic";
import InfoBox from "./components/InfoBox";
import Crosshair from "./components/Crosshari";
import Minimap from "./components/Minimap";

const SceneCanvas = dynamic(() => import("./components/SceneCanvas"), {
  ssr: false,
});

export default function HomePage() {
  return (  
    <>
      <InfoBox />
      <Crosshair />
      <Minimap />
      <SceneCanvas />
    </>
  );
}
