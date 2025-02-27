import { Handle, Position } from 'reactflow'
import { Loader2 } from 'lucide-react'

export function BaseNode({ 
  data, 
  selected, 
  type,
  inputs = [],
  outputs = [],
  children,
  className = ''
}) {
  const nodeType = type.split('-')[0] // 获取节点类型前缀
  const colors = {
    start: 'border-blue-200 bg-blue-50',
    end: 'border-green-200 bg-green-50',
    textPrompt: 'border-blue-200 bg-blue-50',
    imageGen: 'border-orange-200 bg-orange-50',
    imageVariation: 'border-purple-200 bg-purple-50'
  }

  return (
    <div className={`
      relative rounded-lg border-2 shadow-sm 
      ${selected ? 'border-blue-500' : colors[nodeType]} 
      ${data.error ? '!border-red-500' : ''} 
      ${className}
    `}>
      {/* 加载状态遮罩 */}
      {data.isProcessing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* 错误提示 */}
      {data.error && (
        <div className="absolute -top-8 left-0 right-0 bg-red-50 text-red-600 text-xs p-1 rounded border border-red-200">
          {data.error}
        </div>
      )}

      {/* 输入连接点 */}
      {inputs.map((input, index) => (
        <Handle
          key={input}
          type="target"
          position={Position.Left}
          id={input}
          className={`w-3 h-3 ${data.error ? '!bg-red-400' : '!bg-gray-400'}`}
          style={{ top: `${((index + 1) / (inputs.length + 1)) * 100}%` }}
        />
      ))}
      
      {/* 节点内容 */}
      {children}

      {/* 输出连接点 */}
      {outputs.map((output, index) => (
        <Handle
          key={output}
          type="source"
          position={Position.Right}
          id={output}
          className={`w-3 h-3 ${data.error ? '!bg-red-400' : '!bg-gray-400'}`}
          style={{ top: `${((index + 1) / (outputs.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  )
} 