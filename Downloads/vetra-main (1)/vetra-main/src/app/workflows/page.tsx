"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Save, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import "@/app/workflows/workflow-styles.css";

// Dynamic import pour éviter les erreurs SSR
const ReactFlow = dynamic(
  () => import("@xyflow/react").then((mod) => mod.ReactFlow),
  { ssr: false }
);

const ReactFlowProvider = dynamic(
  () => import("@xyflow/react").then((mod) => ({ default: mod.ReactFlowProvider })),
  { ssr: false }
);

const Background = dynamic(
  () => import("@xyflow/react").then((mod) => mod.Background),
  { ssr: false }
);

const Controls = dynamic(
  () => import("@xyflow/react").then((mod) => mod.Controls),
  { ssr: false }
);

const MiniMap = dynamic(
  () => import("@xyflow/react").then((mod) => mod.MiniMap),
  { ssr: false }
);

function WorkflowBuilderInner() {
  const router = useRouter();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingNode, setConnectingNode] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Animation spring pour la progression
  const progressSpring = useSpring(executionProgress, {
    stiffness: 100,
    damping: 30,
  });
  
  const progressWidth = useTransform(progressSpring, (value) => `${value}%`);

  // Animation variants pour les nodes
  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { scale: 0, opacity: 0 },
  };

  // Animation pour les edges
  const edgeVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    },
  };

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      // Appliquer les changements avec animations
      return nds.map((node) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (change) {
          return {
            ...node,
            ...change,
            style: {
              ...node.style,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          };
        }
        return node;
      });
    });
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      return eds.map((edge) => {
        const change = changes.find((c: any) => c.id === edge.id);
        if (change) {
          return {
            ...edge,
            ...change,
            animated: true,
            style: {
              stroke: "#8b5cf6",
              strokeWidth: 2,
              transition: "all 0.3s ease",
            },
          };
        }
        return edge;
      });
    });
  }, []);

  const onConnect = useCallback((params: any) => {
    const newEdge = {
      ...params,
      id: `edge-${Date.now()}`,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#8b5cf6",
        strokeWidth: 2,
        transition: "all 0.3s ease",
      },
      markerEnd: {
        type: "arrowclosed",
        color: "#8b5cf6",
      },
      className: "edge-new",
    };
    
    setEdges((eds) => [...eds, newEdge]);
    setConnectingNode(null);
  }, []);
  
  const onNodeClick = useCallback((_event: any, node: any) => {
    setSelectedNode(node.id);
  }, []);
  
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  const onNodeDrag = useCallback((_event: any, node: any) => {
    // Animation fluide pendant le drag
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? {
              ...n,
              position: node.position,
              style: {
                ...n.style,
                transition: "none", // Pas de transition pendant le drag
              },
            }
          : n
      )
    );
  }, []);
  
  const onNodeDragStop = useCallback((_event: any, node: any) => {
    // Réactiver les transitions après le drag
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? {
              ...n,
              position: node.position,
              style: {
                ...n.style,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              },
            }
          : n
      )
    );
  }, []);

  const handleExecute = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    setExecutionProgress(0);

    // Animation fluide de progression avec feedback visuel
    const executionOrder = nodes.map((_, i) => i);
    const totalSteps = executionOrder.length;

    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const progress = (i / totalSteps) * 100;
      setExecutionProgress(progress);
      
      // Animer les nodes avec transitions fluides
      setNodes((nds) =>
        nds.map((node, index) => {
          const isExecuting = index === i - 1;
          const isCompleted = index < i - 1;
          
          return {
            ...node,
            data: {
              ...node.data,
              executing: isExecuting,
              completed: isCompleted,
            },
            className: isExecuting
              ? "executing"
              : isCompleted
              ? "completed"
              : "",
            style: {
              ...node.style,
              background: isExecuting
                ? "#10b981"
                : isCompleted
                ? "#3b82f6"
                : "#1f2937",
              border: isExecuting
                ? "2px solid #10b981"
                : isCompleted
                ? "2px solid #3b82f6"
                : "2px solid #8b5cf6",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isExecuting ? "scale(1.05)" : "scale(1)",
            },
          };
        })
      );
      
      // Animer les edges connectés
      if (i > 0) {
        setEdges((eds) =>
          eds.map((edge) => {
            const sourceIndex = nodes.findIndex((n) => n.id === edge.source);
            const targetIndex = nodes.findIndex((n) => n.id === edge.target);
            const isActive = sourceIndex < i && targetIndex === i - 1;
            const isCompleted = sourceIndex < i && targetIndex < i;
            
            return {
              ...edge,
              style: {
                ...edge.style,
                stroke: isActive
                  ? "#10b981"
                  : isCompleted
                  ? "#3b82f6"
                  : "#8b5cf6",
                strokeWidth: isActive ? 3 : 2,
                transition: "all 0.5s ease",
              },
            };
          })
        );
      }
    }

    // Reset après exécution
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, executing: false, completed: false },
          className: "",
          style: {
            ...node.style,
            background: "#1f2937",
            border: "2px solid #8b5cf6",
            transform: "scale(1)",
          },
        }))
      );
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          style: {
            ...edge.style,
            stroke: "#8b5cf6",
            strokeWidth: 2,
          },
        }))
      );
      setIsExecuting(false);
      setExecutionProgress(0);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#05070F] text-white">
      {/* Header avec animations */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-white/10 bg-[#05070F]/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.div>
              <div>
                <h1 className="text-lg font-semibold">Workflow Builder</h1>
                <p className="text-sm text-white/60">Créez des workflows visuels fluides</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExecute}
              disabled={isExecuting || nodes.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? "Exécution..." : "Exécuter"}
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Barre de progression avec animation fluide */}
      <AnimatePresence>
        {isExecuting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 4, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/5 relative overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              style={{ width: progressWidth }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Palette de nodes */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-64 border-r border-white/10 bg-[#05070F]/50 p-4 overflow-y-auto"
        >
          <h2 className="text-sm font-semibold mb-4 text-white/80">Nodes</h2>
          <div className="space-y-2">
            {[
              { type: "start", label: "Start", icon: "▶", color: "#10b981", description: "Point de départ" },
              { type: "agent", label: "Agent IA", icon: "🤖", color: "#8b5cf6", description: "Agent intelligent" },
              { type: "transform", label: "Transform", icon: "⚡", color: "#f59e0b", description: "Transformation de données" },
              { type: "condition", label: "Condition", icon: "🔀", color: "#3b82f6", description: "If/Else logic" },
              { type: "loop", label: "Boucle", icon: "🔄", color: "#ec4899", description: "Répétition" },
              { type: "end", label: "Fin", icon: "⏹", color: "#ef4444", description: "Point de fin" },
            ].map((nodeType) => (
              <motion.div
                key={nodeType.type}
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-move hover:bg-white/10 transition-all group"
              >
                <div
                  draggable
                  onDragStart={(e: React.DragEvent) => {
                    e.dataTransfer.setData("application/reactflow", nodeType.type);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className="w-full"
                >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: `${nodeType.color}20`, color: nodeType.color }}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {nodeType.icon}
                  </motion.div>
                  <div className="flex-1">
                    <span className="text-sm font-medium block">{nodeType.label}</span>
                    <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Canvas principal */}
        <div ref={reactFlowWrapper} className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onDrop={(event: any) => {
              event.preventDefault();
              const type = event.dataTransfer?.getData("application/reactflow");
              if (!type) return;

              const position = {
                x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
                y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
              };

              const newNode = {
                id: `node-${Date.now()}`,
                type: "default",
                position,
                data: { label: type },
                style: {
                  background: "#1f2937",
                  border: "2px solid #8b5cf6",
                  borderRadius: "8px",
                  padding: "10px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                className: "node-drop-animation",
              };

              setNodes((nds) => [...nds, newNode]);
            }}
            onDragOver={(event: any) => {
              event.preventDefault();
              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
              }
            }}
            fitView
            className="bg-[#05070F]"
            nodeTypes={{
              default: ({ data, selected, id }: any) => {
                const isSelected = selectedNode === id;
                const isExecuting = data.executing;
                const isCompleted = data.completed;
                
                return (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={nodeVariants}
                    className={`px-4 py-3 rounded-lg border-2 ${
                      isSelected ? "border-purple-400 node-active-glow" : "border-purple-600"
                    } ${isExecuting ? "executing ring-2 ring-green-400" : ""} ${
                      isCompleted ? "completed opacity-70" : ""
                    }`}
                    style={{
                      background: isExecuting
                        ? "#10b981"
                        : isCompleted
                        ? "#3b82f6"
                        : "#1f2937",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "grab",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      {isExecuting && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                      <div className="text-sm font-medium flex-1">{data.label}</div>
                    </div>
                    {isExecuting && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-xs mt-1 text-white/80 flex items-center gap-1"
                      >
                        <motion.span
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="h-1 bg-white/30 rounded-full"
                        />
                        Exécution...
                      </motion.div>
                    )}
                  </motion.div>
                );
              },
            }}
            defaultEdgeOptions={{
              animated: true,
              type: "smoothstep",
              style: {
                stroke: "#8b5cf6",
                strokeWidth: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              },
              markerEnd: {
                type: "arrowclosed",
                color: "#8b5cf6",
                width: 20,
                height: 20,
              },
            }}
            connectionLineStyle={{
              stroke: "#8b5cf6",
              strokeWidth: 2,
              strokeDasharray: "5 5",
            }}
          >
            <Background color="#374151" gap={16} />
            <Controls className="bg-[#1f2937] border border-white/10 rounded-lg" />
            <MiniMap
              className="bg-[#1f2937] border border-white/10 rounded-lg"
              nodeColor="#8b5cf6"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}

