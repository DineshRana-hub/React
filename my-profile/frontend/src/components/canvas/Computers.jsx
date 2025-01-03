import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene_compressed.gltf"); // Use the compressed model

  return (
    <mesh>
      <hemisphereLight intensity={0.1} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.15} // Adjust angle for a simpler lighting setup
        penumbra={0.8} // Reduce penumbra
        intensity={isMobile ? 0.8 : 1} // Reduce intensity on mobile
        castShadow
        shadow-mapSize={isMobile ? 512 : 1024} // Smaller shadow map for mobile
      />
      <pointLight intensity={isMobile ? 0.8 : 1} /> {/* Dim lighting for mobile */}
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.5 : 0.75} // Smaller scale for mobile
        position={isMobile ? [0, -2.5, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};


const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;