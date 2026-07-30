import React, { useEffect, useRef, useState } from 'react';
import { AlphaFoldProtein } from '../types';
import * as THREE from 'three';
import { Dna, ExternalLink, Play, Pause, Eye } from 'lucide-react';

interface AlphaFoldViewerProps {
  protein: AlphaFoldProtein;
}

export const AlphaFoldViewer: React.FC<AlphaFoldViewerProps> = ({ protein }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [selectedResidue, setSelectedResidue] = useState<string | null>(null);

  const groupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 260;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.4);
    dirLight1.position.set(12, 12, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.2);
    dirLight2.position.set(-12, -12, -12);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf59e0b, 1.8);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create Procedural AlphaFold Molecular Cluster Group
    const proteinGroup = new THREE.Group();
    groupRef.current = proteinGroup;
    materialsRef.current = [];

    const atomCount = 50;
    const atoms: THREE.Mesh[] = [];

    const helixColors = [0x10b981, 0x06b6d4, 0x8b5cf6, 0x38bdf8];

    for (let i = 0; i < atomCount; i++) {
      const radius = 0.55 + Math.random() * 0.35;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);

      const isBindingSite = i % 6 === 0;
      const material = new THREE.MeshStandardMaterial({
        color: isBindingSite ? 0xf59e0b : helixColors[i % helixColors.length],
        roughness: 0.25,
        metalness: 0.45,
        wireframe: wireframeMode,
      });

      materialsRef.current.push(material);

      const mesh = new THREE.Mesh(geometry, material);
      const angle = i * 0.38;
      const r = 4.5 + Math.sin(i * 0.55) * 2.2;
      mesh.position.set(
        Math.cos(angle) * r,
        (i - atomCount / 2) * 0.35,
        Math.sin(angle) * r
      );

      proteinGroup.add(mesh);
      atoms.push(mesh);
    }

    // Connect atoms with bond cylinders
    const lineGeo = new THREE.BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i < atoms.length - 1; i++) {
      const p1 = atoms[i].position;
      const p2 = atoms[i + 1].position;
      positions.push(p1.x, p1.y, p1.z);
      positions.push(p2.x, p2.y, p2.z);
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.7 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    proteinGroup.add(lines);

    scene.add(proteinGroup);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating && groupRef.current) {
        groupRef.current.rotation.y += 0.007;
        groupRef.current.rotation.x += 0.003;
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
  }, [protein, isRotating, wireframeMode]);

  return (
    <div className="glass-panel p-5 my-6 border-purple-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>AlphaFold 3D Pathogen Protein Target Visualizer</span>
              <span className="px-2 py-0.5 text-[10px] badge-purple">UniProt PDB</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pathogen Target Enzyme: {protein.proteinName} ({protein.organism})
            </p>
          </div>
        </div>

        <a
          href={`https://alphafold.ebi.ac.uk/entry/${protein.pdbId}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1 font-mono-tech"
        >
          <span>EBI AlphaFold DB</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 3D WebGL Canvas Rendering Container & Controls */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[260px]" />

          {/* Interactive 3D Control Buttons */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className="p-1.5 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
              title="Toggle Auto Rotation"
            >
              {isRotating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700 transition-all text-[11px] font-mono-tech ${
                wireframeMode ? 'text-amber-400 border-amber-500/50' : 'text-slate-400'
              }`}
            >
              Wireframe
            </button>
          </div>

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-mono-tech text-amber-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Gold Spheres = Active Binding Sites</span>
          </div>
        </div>

        {/* Protein Target Specs & Residues */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-medium">PDB Identifier:</span>
            <div className="font-mono-tech font-bold text-cyan-400 text-sm mt-0.5">{protein.pdbId}</div>
            <span className="text-[11px] text-slate-500">Molecular Mass: {protein.molecularWeight}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-medium block mb-1">Target Active Binding Residues:</span>
            <div className="flex flex-wrap gap-1.5">
              {protein.bindingSiteResidues.map((res) => (
                <button
                  key={res}
                  onClick={() => setSelectedResidue(res)}
                  className={`px-2 py-0.5 rounded transition-all font-mono-tech text-[10px] ${
                    selectedResidue === res
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/80'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-medium block mb-1">Inhibition Mechanism:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">{protein.mechanismExplanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
