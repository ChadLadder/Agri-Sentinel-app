import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Play, Pause, Activity } from 'lucide-react';

interface GlobeVisualizerProps {
  locationName: string;
  latitude: number;
  longitude: number;
}

export const GlobeVisualizer: React.FC<GlobeVisualizerProps> = ({ locationName, latitude, longitude }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 260;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070f');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.6);
    dirLight1.position.set(12, 12, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 1.2);
    dirLight2.position.set(-12, -12, -12);
    scene.add(dirLight2);

    const globeGroup = new THREE.Group();

    // 3D Earth Wireframe / Surface Geometry
    const earthGeo = new THREE.SphereGeometry(5, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      wireframe: true,
      roughness: 0.4,
      metalness: 0.6,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Atmosphere Glow Sphere
    const atmosGeo = new THREE.SphereGeometry(5.25, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Dynamic Hotspot Marker Ring Pin Point
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    const markerRadius = 5.15;
    const x = -(markerRadius * Math.sin(phi) * Math.cos(theta));
    const z = markerRadius * Math.sin(phi) * Math.sin(theta);
    const y = markerRadius * Math.cos(phi);

    const pinGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      roughness: 0.1,
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(x, y, z);
    globeGroup.add(pinMesh);

    scene.add(globeGroup);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating) {
        globeGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [latitude, longitude, isRotating]);

  return (
    <div className="glass-panel p-5 my-6 border-cyan-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <span>3D WebGL Orbital Globe Visualizer</span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-cyan">Three.js Engine</span>
            </h3>
            <p className="text-[11px] text-slate-400">Active Incident Pin: {locationName} ({latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
        >
          {isRotating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isRotating ? 'Pause Spin' : 'Rotate'}</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[260px]" />
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-mono-tech text-red-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Red Sphere = Global Incident Coordinate Vector</span>
        </div>
      </div>
    </div>
  );
};
