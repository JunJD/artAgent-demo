import { nodeTypes } from '@/lib/flow-nodes'

export function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  // 过滤掉基础节点（start/end），只显示可拖拽的节点类型
  const draggableNodes = Object.entries(nodeTypes).filter(
    ([type]) => !['start', 'end'].includes(type)
  )

  return (
    <div className="w-[280px] p-4 border-r bg-gray-50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">创作工具</h3>
        <p className="text-sm text-gray-500">拖拽组件到画布中开始创作</p>
      </div>

      <div className="space-y-3">
        {draggableNodes.map(([type, config]) => (
          <div
            key={type}
            className={`p-4 border-2 rounded-lg cursor-move transition-all hover:shadow-md ${
              config.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:border-blue-300' :
              config.color === 'orange' ? 'bg-orange-50 border-orange-200 hover:border-orange-300' :
              config.color === 'purple' ? 'bg-purple-50 border-purple-200 hover:border-purple-300' :
              'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{config.icon}</span>
              <span className="font-medium">{config.label}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mt-1">
              {config.inputs?.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>输入:</span>
                  {config.inputs.map(input => (
                    <span key={input} className="px-1.5 py-0.5 bg-gray-100 rounded">
                      {input}
                    </span>
                  ))}
                </div>
              )}
              {config.outputs?.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  <span>输出:</span>
                  {config.outputs.map(output => (
                    <span key={output} className="px-1.5 py-0.5 bg-gray-100 rounded">
                      {output}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border-t border-gray-200">
        <h4 className="font-medium mb-2 text-gray-700">使用说明</h4>
        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
          <li>拖拽组件到右侧画布</li>
          <li>连接组件的输入输出端口</li>
          <li>设置组件参数</li>
          <li>点击执行开始生成</li>
        </ul>
      </div>
    </div>
  )
} 