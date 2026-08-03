import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Earth() {
  return (
    <>
      <mesh rotation={[0.4, 0.8, 0]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          color="#51B1FE"
          wireframe
          emissive="#51B1FE"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh rotation={[0.4, 0.8, 0]}>
        <sphereGeometry args={[2.35, 64, 64]} />
        <meshBasicMaterial
          color="#51B1FE"
          transparent
          opacity={0.05}
        />
      </mesh>
    </>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2.5}
        />

        <pointLight
          position={[0, 0, 4]}
          intensity={2}
          color="#51B1FE"
        />

        <Earth />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.18}
        />
      </Canvas>
    </div>
  );
}