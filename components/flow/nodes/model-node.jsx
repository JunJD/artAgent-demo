import { Handle, Position } from 'reactflow'

const models = [
  { id: 'sd', name: 'Stable Diffusion' },
  { id: 'gpt', name: 'GPT' }
]

export function ModelNode({ data }) {
  return (
    <div className="w-[240px] shadow-lg rounded-lg bg-white border-2 border-purple-100">
      <div className="flex items-center bg-purple-50 px-4 py-2 rounded-t-lg border-b border-purple-100">
        <div className="text-sm font-medium text-purple-900">🤖 AI 模型</div>
      </div>
      <div className="p-4">
        <select 
          className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={data.model || 'sd'}
          onChange={(e) => data.onChange?.(e.target.value)}
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <Handle 
        type="target" 
        position={Position.Left}
        className="w-3 h-3 bg-purple-500" 
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-3 h-3 bg-purple-500" 
      />
    </div>
  )
} 