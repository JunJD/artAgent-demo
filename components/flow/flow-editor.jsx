"use client"

import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { TextPromptNode } from './nodes/text-prompt-node'
import { ImageGenNode } from './nodes/image-gen-node'
import { ImageVariationNode } from './nodes/image-variation-node'
import { nodeTypes as nodeConfig, getNodeDefaults } from '@/lib/flow-nodes'
import { Button } from '@/components/ui/button'
import { Play, Save, Undo } from 'lucide-react'
import { generateImage, checkImageStatus, createImageVariation } from '@/lib/api-service'
import { toast } from '@/hooks/use-toast'
import { StartNode } from './nodes/start-node'
import { EndNode } from './nodes/end-node'

// 注册节点类型
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  textPrompt: TextPromptNode,
  imageGen: ImageGenNode,
  imageVariation: ImageVariationNode,
}

// 初始节点
const initialNodes = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: nodeConfig.start.data
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 600, y: 100 },
    data: nodeConfig.end.data
  }
]

export default function FlowEditor() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { project } = useReactFlow()

  // 处理节点连接
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  // 处理节点数据更新
  const handleNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
              onChange: (value) => handleNodeDataChange(nodeId, value),
            },
          }
        }
        return node
      })
    )
  }, [setNodes])

  // 处理拖拽
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (!type) return

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        ...getNodeDefaults(type),
        position,
        data: {
          ...nodeConfig[type].data,
          onChange: (value) => handleNodeDataChange(newNode.id, value),
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [project, setNodes, handleNodeDataChange]
  )

  // 构建执行图
  const buildExecutionGraph = useCallback(() => {
    const graph = new Map()
    const visited = new Set()

    // 为每个节点创建邻接表
    edges.forEach(edge => {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, [])
      }
      graph.get(edge.source).push(edge.target)
    })

    // 拓扑排序
    const sorted = []
    const temp = new Set()

    function visit(nodeId) {
      if (temp.has(nodeId)) {
        throw new Error('检测到循环依赖')
      }
      if (visited.has(nodeId)) return

      temp.add(nodeId)
      const neighbors = graph.get(nodeId) || []
      for (const neighbor of neighbors) {
        visit(neighbor)
      }
      temp.delete(nodeId)
      visited.add(nodeId)
      sorted.unshift(nodeId)
    }

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        visit(node.id)
      }
    })

    return sorted
  }, [nodes, edges])

  const pollImageStatus = async (generateUuid, maxAttempts = 60) => {
    let attempts = 0
    
    while (attempts < maxAttempts) {
      const statusResult = await checkImageStatus(generateUuid)
      console.log('Poll attempt', attempts + 1, statusResult)

      if (statusResult.status === 'success') {
        return statusResult.images
      }

      // 如果还在进行中，等待1秒后重试
      if (statusResult.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
        continue
      }

      // 其他情况抛出错误
      throw new Error('图像生成失败')
    }

    throw new Error('等待超时')
  }

  // 执行单个节点
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const executeNode = async (nodeId, inputData) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) throw new Error(`未找到节点: ${nodeId}`)

    // 清除之前的错误
    handleNodeDataChange(nodeId, { 
      isProcessing: true,
      error: null 
    })

    try {
      let result
      switch (node.type) {
        case 'start':
          result = { flow: true }
          break

        case 'end':
          result = { 
            image: inputData.image,
            flow: true 
          }
          break

        case 'textPrompt':
          result = {
            text: node.data.text,
            negative_prompt: node.data.negative_prompt
          }
          break

        case 'imageGen':
          const response = await generateImage(
            inputData.text,
            node.data.width,
            node.data.height
          )
          const generateUuid = response.generateUuid
          console.log('generateUuid', generateUuid)
          
          // 使用轮询函数
          const images = await pollImageStatus(generateUuid)
          console.log('final images', images)
          
          result = {
            image: images[0]?.imageUrl
          }
          break

        case 'imageVariation':
          const varResponse = await createImageVariation(
            inputData.image,
            inputData.text,
            node.data.strength,
            node.data.cfg_scale,
            node.data.steps
          )
          result = {
            image: varResponse.artifacts[0].base64
          }
          break

        default:
          throw new Error(`未知节点类型: ${node.type}`)
      }

      handleNodeDataChange(nodeId, { 
        isProcessing: false,
        error: null,
        ...result
      })

      return result
    } catch (error) {
      const errorMessage = error.message || '执行失败'
      handleNodeDataChange(nodeId, { 
        isProcessing: false,
        error: errorMessage
      })
      throw error
    }
  }

  // 执行流程
  const executeFlow = useCallback(async () => {
    setIsProcessing(true)
    try {
      const executionOrder = buildExecutionGraph()
      const nodeResults = new Map()

      for (const nodeId of executionOrder) {
        // 获取输入数据
        const inputEdges = edges.filter(e => e.target === nodeId)
        const inputData = {}
        
        for (const edge of inputEdges) {
          const sourceResult = nodeResults.get(edge.source)
          if (sourceResult) {
            Object.assign(inputData, sourceResult)
          }
        }

        // 执行节点
        const result = await executeNode(nodeId, inputData)
        nodeResults.set(nodeId, result)
      }

      toast({
        title: "流程执行成功",
        description: "所有节点已完成执行",
      })
    } catch (error) {
      console.error('流程执行失败:', error)
      toast({
        variant: "destructive",
        title: "执行失败",
        description: error.message,
      })
    } finally {
      setIsProcessing(false)
    }
  }, [buildExecutionGraph, edges, executeNode])

  // 保存流程
  const saveFlow = useCallback(() => {
    const flow = {
      nodes: nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onChange: undefined // 移除函数以便序列化
        }
      })),
      edges
    }
    localStorage.setItem('artflow', JSON.stringify(flow))
    toast({
      title: "流程保存成功",
      description: "流程已保存到本地存储",
    })
  }, [nodes, edges])

  // 在 FlowEditor 组件中添加连接验证
  const onConnectStart = useCallback((_, { nodeId, handleType, handleId }) => {
    console.log('连接开始:', { nodeId, handleType, handleId })
  }, [])

  const onConnectEnd = useCallback((event) => {
    console.log('连接结束:', event)
  }, [])

  const isValidConnection = useCallback((connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source)
    const targetNode = nodes.find(n => n.id === connection.target)

    if (!sourceNode || !targetNode) return false

    // 从节点配置中获取连接规则
    const sourceConfig = nodeConfig[sourceNode.type]
    const targetConfig = nodeConfig[targetNode.type]

    // 检查源节点的输出是否可以连接到目标节点
    const validTargets = sourceConfig?.connections?.outputs || []
    const validSources = targetConfig?.connections?.inputs || []

    // 连接必须同时满足源节点和目标节点的规则
    return validTargets.includes(targetNode.type) && validSources.includes(sourceNode.type)
  }, [nodes])

  return (
    <div className="h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onChange: (value) => handleNodeDataChange(node.id, value)
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="flex gap-2">
          <Button 
            variant="secondary"
            size="sm"
            onClick={saveFlow}
          >
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button
            size="sm"
            onClick={executeFlow}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Undo className="h-4 w-4 mr-1 animate-spin" />
                执行中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                执行
              </>
            )}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
} 