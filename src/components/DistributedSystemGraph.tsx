import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, Play, Pause, RefreshCw, Zap } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  borderColor: string;
  protocol: string;
  rps: number;
  latencyMs: number;
  status: 'nominal' | 'surge' | 'syncing';
}

interface Edge {
  from: string;
  to: string;
  protocol: string;
  color: string;
}

interface Packet {
  edgeIndex: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  size: number;
}

export const DistributedSystemGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [activeTrafficSpike, setActiveTrafficSpike] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Simulation state stored in refs for 60fps canvas loop
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const packetsRef = useRef<Packet[]>([]);
  const draggingNodeRef = useRef<Node | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSpikeRef = useRef(false);

  // Initialize node layout relative to canvas dimensions
  const initTopology = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;

    const baseNodes: Node[] = [
      {
        id: 'client',
        name: 'Client Edge',
        role: 'Worldwide Inbound Traffic',
        x: width * 0.12,
        y: cy,
        targetX: width * 0.12,
        targetY: cy,
        radius: 20,
        color: '#0e7490',
        borderColor: '#22d3ee',
        protocol: 'HTTP/3 Quic',
        rps: 1240,
        latencyMs: 14,
        status: 'nominal',
      },
      {
        id: 'gateway',
        name: 'API Gateway',
        role: 'Envoy / Rate Limiter',
        x: width * 0.32,
        y: cy - height * 0.15,
        targetX: width * 0.32,
        targetY: cy - height * 0.15,
        radius: 24,
        color: '#1d4ed8',
        borderColor: '#60a5fa',
        protocol: 'gRPC / TLS 1.3',
        rps: 1240,
        latencyMs: 2.1,
        status: 'nominal',
      },
      {
        id: 'auth',
        name: 'Auth & RBAC',
        role: 'Least-Privilege Shield',
        x: width * 0.32,
        y: cy + height * 0.22,
        targetX: width * 0.32,
        targetY: cy + height * 0.22,
        radius: 18,
        color: '#b45309',
        borderColor: '#fbbf24',
        protocol: 'mTLS JWT',
        rps: 940,
        latencyMs: 1.4,
        status: 'nominal',
      },
      {
        id: 'dispatcher',
        name: 'LLM Dispatcher',
        role: 'Agentic Task Graph',
        x: width * 0.54,
        y: cy - height * 0.1,
        targetX: width * 0.54,
        targetY: cy - height * 0.1,
        radius: 26,
        color: '#7e22ce',
        borderColor: '#c084fc',
        protocol: 'JSON-Schema gRPC',
        rps: 620,
        latencyMs: 18.4,
        status: 'nominal',
      },
      {
        id: 'workers',
        name: 'GPU Inference Fleet',
        role: 'QLoRA Quantized Pods',
        x: width * 0.76,
        y: cy - height * 0.22,
        targetX: width * 0.76,
        targetY: cy - height * 0.22,
        radius: 22,
        color: '#047857',
        borderColor: '#34d399',
        protocol: 'CUDA IPC',
        rps: 480,
        latencyMs: 34.2,
        status: 'nominal',
      },
      {
        id: 'redis',
        name: 'Redis Cache',
        role: 'Cluster Pub/Sub & States',
        x: width * 0.54,
        y: cy + height * 0.25,
        targetX: width * 0.54,
        targetY: cy + height * 0.25,
        radius: 20,
        color: '#dc2626',
        borderColor: '#f87171',
        protocol: 'RESP3 TCP',
        rps: 2100,
        latencyMs: 0.8,
        status: 'nominal',
      },
      {
        id: 'postgres',
        name: 'PostgreSQL Primary',
        role: 'ACID Persistent Cluster',
        x: width * 0.78,
        y: cy + height * 0.08,
        targetX: width * 0.78,
        targetY: cy + height * 0.08,
        radius: 22,
        color: '#1e40af',
        borderColor: '#93c5fd',
        protocol: 'SQL pg_pool',
        rps: 820,
        latencyMs: 4.6,
        status: 'nominal',
      },
      {
        id: 'vector',
        name: 'Vector Database',
        role: 'Cosine Similarity Index',
        x: width * 0.90,
        y: cy - height * 0.02,
        targetX: width * 0.90,
        targetY: cy - height * 0.02,
        radius: 19,
        color: '#4338ca',
        borderColor: '#818cf8',
        protocol: 'HNSW / gRPC',
        rps: 310,
        latencyMs: 12.0,
        status: 'nominal',
      },
    ];

    const baseEdges: Edge[] = [
      { from: 'client', to: 'gateway', protocol: 'HTTP/3', color: '#06b6d4' },
      { from: 'gateway', to: 'auth', protocol: 'mTLS', color: '#f59e0b' },
      { from: 'gateway', to: 'dispatcher', protocol: 'gRPC', color: '#a855f7' },
      { from: 'dispatcher', to: 'workers', protocol: 'Task Stream', color: '#10b981' },
      { from: 'dispatcher', to: 'redis', protocol: 'Pub/Sub', color: '#ef4444' },
      { from: 'workers', to: 'postgres', protocol: 'SQL TCP', color: '#3b82f6' },
      { from: 'workers', to: 'vector', protocol: 'Cosine KNN', color: '#6366f1' },
      { from: 'redis', to: 'postgres', protocol: 'Sync Pool', color: '#f97316' },
    ];

    nodesRef.current = baseNodes;
    edgesRef.current = baseEdges;
    packetsRef.current = [];
  }, []);

  // Spawn packets along edges
  const spawnPacket = useCallback(() => {
    if (edgesRef.current.length === 0) return;
    const edgeIndex = Math.floor(Math.random() * edgesRef.current.length);
    const edge = edgesRef.current[edgeIndex];
    const speed = (isSpikeRef.current ? 0.016 : 0.007) + Math.random() * 0.004;

    packetsRef.current.push({
      edgeIndex,
      progress: 0,
      speed,
      color: edge.color,
      size: isSpikeRef.current ? 3.5 : 2.5,
    });
  }, []);

  // Handle traffic surge toggle
  const triggerTrafficSpike = () => {
    setActiveTrafficSpike(true);
    isSpikeRef.current = true;
    setTimeout(() => {
      setActiveTrafficSpike(false);
      isSpikeRef.current = false;
    }, 4000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastPacketTime = 0;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      initTopology(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Clear with dark obsidian trail
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const gridSize = 28;
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map<string, Node>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      // Draw edges
      edges.forEach((edge) => {
        const source = nodeMap.get(edge.from);
        const target = nodeMap.get(edge.to);
        if (!source || !target) return;

        // Line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Edge protocol tag in center
        const mx = (source.x + target.x) / 2;
        const my = (source.y + target.y) / 2;
        ctx.fillStyle = 'rgba(161, 161, 170, 0.5)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(edge.protocol, mx, my - 6);
      });

      // Update & render packets
      if (isRunning) {
        const interval = isSpikeRef.current ? 40 : 180;
        if (time - lastPacketTime > interval) {
          spawnPacket();
          if (isSpikeRef.current) spawnPacket();
          lastPacketTime = time;
        }

        packetsRef.current = packetsRef.current.filter((packet) => {
          packet.progress += packet.speed;
          if (packet.progress >= 1) return false;

          const edge = edges[packet.edgeIndex];
          if (!edge) return false;
          const source = nodeMap.get(edge.from);
          const target = nodeMap.get(edge.to);
          if (!source || !target) return false;

          const px = source.x + (target.x - source.x) * packet.progress;
          const py = source.y + (target.y - source.y) * packet.progress;

          // Packet glow
          ctx.beginPath();
          ctx.arc(px, py, packet.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `${packet.color}33`;
          ctx.fill();

          // Packet core
          ctx.beginPath();
          ctx.arc(px, py, packet.size, 0, Math.PI * 2);
          ctx.fillStyle = packet.color;
          ctx.fill();

          return true;
        });
      }

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Outer glow on hover or surge
        if (isHovered || isSelected || isSpikeRef.current) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${node.borderColor}22`;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
        ctx.strokeStyle = node.borderColor;
        ctx.stroke();

        // Node Title label
        ctx.fillStyle = '#FAFAFA';
        ctx.font = '500 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 14);

        // Protocol / Role subtitle
        ctx.fillStyle = '#71717A';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(node.protocol, node.x, node.y + node.radius + 25);
      });

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initTopology, spawnPacket, isRunning, hoveredNode, selectedNode]);

  // Pointer interactions for dragging and inspection
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = nodesRef.current.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
    });

    if (hit) {
      draggingNodeRef.current = hit;
      setSelectedNode(hit);
      canvas.setPointerCapture(e.pointerId);
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    if (draggingNodeRef.current) {
      draggingNodeRef.current.x = Math.max(30, Math.min(canvas.clientWidth - 30, x));
      draggingNodeRef.current.y = Math.max(30, Math.min(canvas.clientHeight - 30, y));
    } else {
      const hit = nodesRef.current.find((n) => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
      });
      setHoveredNode(hit || null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (draggingNodeRef.current && canvas) {
      draggingNodeRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const resetTopology = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    initTopology(rect.width, rect.height);
    setSelectedNode(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] md:h-[460px] lg:h-[500px] rounded-2xl glass-panel overflow-hidden border border-white/10 group"
    >
      {/* Top Header Bar inside Node Canvas */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-300 tracking-wider">
            DISTRIBUTED_TOPOLOGY // LIVE TELEMETRY
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
            {activeTrafficSpike ? 'SURGE: 10,000 RPS' : 'NOMINAL: 1,240 RPS'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={triggerTrafficSpike}
            disabled={activeTrafficSpike}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
              activeTrafficSpike
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            }`}
            title="Inject simulated load spike across all microservices"
          >
            <Zap className={`w-3.5 h-3.5 ${activeTrafficSpike ? 'text-amber-400 animate-bounce' : 'text-amber-400'}`} />
            <span>Spike</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={resetTopology}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            title="Reset Service Node Coordinates"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Active Node Telemetry Overlay Card */}
      {(selectedNode || hoveredNode) && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 p-3 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/15 text-xs font-mono z-20 pointer-events-auto shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 mb-2">
            <span className="font-semibold text-white tracking-wide">
              {(selectedNode || hoveredNode)?.name}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
              {(selectedNode || hoveredNode)?.protocol}
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] mb-2 leading-relaxed">
            {(selectedNode || hoveredNode)?.role}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-900">
            <div className="bg-zinc-900/60 p-1.5 rounded">
              <span className="block text-[10px] text-zinc-500">THROUGHPUT</span>
              <span className="font-semibold text-zinc-200 tabular-nums">
                {activeTrafficSpike
                  ? Math.round(((selectedNode || hoveredNode)?.rps || 1000) * 3.5)
                  : (selectedNode || hoveredNode)?.rps}{' '}
                rps
              </span>
            </div>
            <div className="bg-zinc-900/60 p-1.5 rounded">
              <span className="block text-[10px] text-zinc-500">LATENCY</span>
              <span className="font-semibold text-emerald-300 tabular-nums">
                {(selectedNode || hoveredNode)?.latencyMs} ms
              </span>
            </div>
            <div className="bg-zinc-900/60 p-1.5 rounded">
              <span className="block text-[10px] text-zinc-500">RESILIENCE</span>
              <span className="font-semibold text-blue-300">99.9%</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 text-center">
            Click & drag node to test dynamic network routing
          </div>
        </div>
      )}

      {/* Helper hint when no node selected */}
      {!selectedNode && !hoveredNode && (
        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-zinc-500 pointer-events-none">
          Click any service node to inspect microservice telemetry
        </div>
      )}
    </div>
  );
};
