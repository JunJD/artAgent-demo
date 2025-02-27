import { Handle, Position } from 'reactflow'

export function TextNode({ data, isConnectable }) {
  return (
    <div className="w-[280px] shadow-lg rounded-lg bg-white border-2 border-blue-100">
      <div className="flex items-center bg-blue-50 px-4 py-2 rounded-t-lg border-b border-blue-100">
        <div className="text-sm font-medium text-blue-900">✍️ 文本输入</div>
      </div>
      <div className="p-4">
        <textarea
          className="w-full min-h-[100px] p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入创作灵感..."
          value={data.text || ''}
          onChange={(e) => data.onChange?.(e.target.value)}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  )
} 