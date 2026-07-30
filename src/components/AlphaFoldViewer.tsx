import React, { useEffect, useRef } from 'react';
import { AlphaFoldProtein } from '../types';
import * as THREE from 'three';
import { Dna, Activity, ExternalLink, Box } from 'lucide-react';

interface AlphaFoldViewerProps {
  protein: AlphaFoldProtein;
}

export const AlphaFoldViewer: React.FC<AlphaFoldViewerProps> = ({ protein }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Set up 3D Canvas Scene for Molecular Protein Structure
    const width = mountRef.current.clientWidth;
    const height = 240;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x10b981, 1.5);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    // Create Procedural AlphaFold Protein Molecular Cluster
    const proteinGroup = new THREE.Group();

    // Secondary Alpha-Helix & Beta-Sheet Backbone Spheres
    const atomCount = 45;
    const atoms: THREE.Mesh[] = [];

    const helixColors = [0x10b981, 0x06b6d4, 0x8b5cf6, 0x38bdf8];

    for (let i = 0; i < atomCount; i++) {
      const radius = 0.5 + Math.random() * 0.4;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);

      // Highlight active binding site residues in Gold/Amber
      const isBindingSite = i % 7 === 0;
      const material = new THREE.MeshStandardMaterial({
        color: isBindingSite ? 0xf59e0b : helixColors[i % helixColors.length],
        roughness: 0.3,
        metalness: 0.4,
        wireframe: i % 9 === 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const angle = i * 0.35;
      const r = 4 + Math.sin(i * 0.5) * 2;
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
    const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.6 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    proteinGroup.add(lines);

    scene.add(proteinGroup);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      proteinGroup.rotation.y += 0.008;
      proteinGroup.rotation.x += 0.004;
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
  }, [protein]);

  return (
    <div className="glass-panel p-5 my-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Dna className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>AlphaFold 3D Pathogen Protein Target Visualizer</span>
              <span className="px-2 py-0.5 text-[10px] badge-purple">UniProt PDB</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pathogen Protein Structure: {protein.proteinName} ({protein.organism})
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
        {/* 3D WebGL Canvas Rendering Container */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[240px]" />
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
            <div className="flex flex-wrap gap-1">
              {protein.bindingSiteResidues.map((res) => (
                <span
                  key={res}
                  className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono-tech text-[10px]"
                >
                  {res}
                </span>
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
