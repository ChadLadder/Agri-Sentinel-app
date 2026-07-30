import React, { useEffect, useRef, useState } from 'react';
import { ASTNode3D } from '../types';
import * as THREE from 'three';
import { FileCode, Play, Pause, ExternalLink } from 'lucide-react';

interface ASTVisualizerProps {
  nodes: ASTNode3D[];
}

export const ASTVisualizer: React.FC<ASTVisualizerProps> = ({ nodes }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<ASTNode3D | null>(nodes[0] || null);

  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = 280;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070a12');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const astGroup = new THREE.Group();
    groupRef.current = astGroup;

    const meshes: THREE.Mesh[] = [];

    nodes.forEach((node) => {
      const isVulnerable = node.status === 'vulnerable';
      const isPatched = node.status === 'patched';

      const geometry = isVulnerable
        ? new THREE.OctahedronGeometry(1.2)
        : isPatched
        ? new THREE.SphereGeometry(1.1, 16, 16)
        : new THREE.BoxGeometry(1.2, 1.2, 1.2);

      const color = isVulnerable ? 0xef4444 : isPatched ? 0x10b981 : 0x06b6d4;

      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.5,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      astGroup.add(mesh);
      meshes.push(mesh);
    });

    // Connect AST nodes with line data flows
    const lineGeo = new THREE.BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i < meshes.length - 1; i++) {
      const p1 = meshes[i].position;
      const p2 = meshes[i + 1].position;
      positions.push(p1.x, p1.y, p1.z);
      positions.push(p2.x, p2.y, p2.z);
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    astGroup.add(lines);

    scene.add(astGroup);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isRotating && groupRef.current) {
        groupRef.current.rotation.y += 0.006;
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
  }, [nodes, isRotating]);

  return (
    <div className="glass-panel p-5 my-6 border-purple-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>3D Abstract Syntax Tree (AST) & Attack Surface Visualizer</span>
              <span className="px-2 py-0.5 text-[10px] badge-purple">Three.js WebGL</span>
            </h3>
            <p className="text-xs text-slate-400">Interactive node graph of input execution paths, function calls, & CVE boundaries</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 3D WebGL Canvas Container */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[280px]" />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-mono-tech text-cyan-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Green = Sanitized • Red Octahedron = Vulnerable CVE Node</span>
          </div>
        </div>

        {/* Node Metadata List */}
        <div className="space-y-2 text-xs">
          <span className="text-slate-400 font-bold block mb-1">AST Data Flow Execution Nodes:</span>
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedNode?.id === node.id
                  ? 'bg-purple-950/40 border-purple-500/50 text-slate-100'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{node.name}</span>
                <span
                  className={`text-[9px] font-mono-tech px-2 py-0.5 rounded ${
                    node.status === 'vulnerable'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {node.status.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono-tech block mt-1">
                Type: {node.type} {node.cve ? `• ${node.cve}` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
