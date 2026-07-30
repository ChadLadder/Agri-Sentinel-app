import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Heart, ShieldAlert, Play, Pause } from 'lucide-react';

interface PatientVisualizerProps {
  traumaZone: string;
  category: string;
}

export const PatientVisualizer: React.FC<PatientVisualizerProps> = ({ traumaZone, category }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 260;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xef4444, 1.6);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.2);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const bodyGroup = new THREE.Group();

    // Head
    const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, wireframe: true, roughness: 0.3 });
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.y = 5;
    bodyGroup.add(headMesh);

    // Torso / Chest
    const torsoGeo = new THREE.CylinderGeometry(1.4, 1.1, 4.5, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.y = 1.8;
    bodyGroup.add(torsoMesh);

    // Limbs
    const legGeo = new THREE.CylinderGeometry(0.5, 0.4, 5, 16);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.8, -3, 0);

    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.8, -3, 0);

    bodyGroup.add(leftLeg);
    bodyGroup.add(rightLeg);

    // Highlight Trauma Zone with Glowing Red Sphere
    const traumaGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const traumaMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      roughness: 0.1,
    });
    const traumaMesh = new THREE.Mesh(traumaGeo, traumaMat);

    if (traumaZone === 'Lower Limb') {
      traumaMesh.position.set(0.8, -2.5, 0.4);
    } else if (traumaZone === 'Chest') {
      traumaMesh.position.set(0, 2.2, 0.8);
    } else if (traumaZone === 'Head/Neck') {
      traumaMesh.position.set(0, 5, 0.5);
    } else {
      traumaMesh.position.set(0, 1.5, 0.5);
    }

    bodyGroup.add(traumaMesh);
    scene.add(bodyGroup);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating) {
        bodyGroup.rotation.y += 0.008;
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
  }, [traumaZone, category, isRotating]);

  return (
    <div className="glass-panel p-5 my-6 border-red-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <span>3D WebGL Patient Trauma Zone & Pressure Point Map</span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-red">Three.js Engine</span>
            </h3>
            <p className="text-[11px] text-slate-400">Target Zone: {traumaZone} • Anatomical Pressure Points</p>
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

      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[260px]" />
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-mono-tech text-red-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Red Pulsing Sphere = Active Hemorrhage / Trauma Zone</span>
        </div>
      </div>
    </div>
  );
};
