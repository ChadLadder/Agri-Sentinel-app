import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radar, Shield, Play, Pause, Activity } from 'lucide-react';

interface ThreatRadarProps {
  threatLevel: string;
  riskScore: number;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ threatLevel, riskScore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 240;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 12, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(riskScore > 50 ? 0xef4444 : 0x10b981, 2, 50);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const radarGroup = new THREE.Group();

    // Concentric Radar Rings
    const ringColors = [0x06b6d4, 0x3b82f6, 0x8b5cf6];
    for (let r = 2; r <= 8; r += 2) {
      const ringGeo = new THREE.RingGeometry(r - 0.05, r, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[(r / 2 - 1) % ringColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      radarGroup.add(ringMesh);
    }

    // Rotating Radar Sweep Beam Line
    const sweepGeo = new THREE.PlaneGeometry(8, 8);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const sweepMesh = new THREE.Mesh(sweepGeo, sweepMat);
    sweepMesh.rotation.x = Math.PI / 2;
    sweepMesh.position.set(4, 0.01, 0);
    radarGroup.add(sweepMesh);

    // Threat Node Spheres
    const nodeCount = 12;
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const isScamNode = i < 4 && riskScore > 50;
      const sphereGeo = new THREE.SphereGeometry(isScamNode ? 0.45 : 0.25, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: isScamNode ? 0xef4444 : 0x10b981,
        emissive: isScamNode ? 0x991b1b : 0x065f46,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const dist = 2.5 + Math.random() * 5;
      mesh.position.set(Math.cos(angle) * dist, 0.2, Math.sin(angle) * dist);
      radarGroup.add(mesh);
      nodes.push(mesh);
    }

    scene.add(radarGroup);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating) {
        radarGroup.rotation.y += 0.012;
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
  }, [riskScore, threatLevel, isRotating]);

  return (
    <div className="glass-panel p-5 my-6 border-cyan-500/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Radar className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-2">
              <span>Gemma 4 Autonomous Threat Radar</span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-cyan">3D WebGL Engine</span>
            </h3>
            <p className="text-[11px] text-slate-400">Real-time threat graph parsing suspicious domain nodes & phone number reputation</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
        >
          {isRotating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isRotating ? 'Pause Radar' : 'Sweep'}</span>
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[240px]" />
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-mono-tech text-cyan-300 flex items-center space-x-2">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Scanning Beam Active • {nodesCount()} Domain Nodes Tracked</span>
        </div>
      </div>
    </div>
  );

  function nodesCount() {
    return 12;
  }
};
