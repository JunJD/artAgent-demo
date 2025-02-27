import { Handle, Position } from 'reactflow'

const styles = [
  { id: 'impressionism', name: '印象派' },
  { id: 'abstract', name: '抽象派' },
  { id: 'realism', name: '写实风格' },
  { id: 'modern', name: '现代艺术' }
]

export function StyleNode({ data }) {
  return (
    <div className="w-[240px] shadow-lg rounded-lg bg-white border-2 border-teal-100">
      <div className="flex items-center bg-teal-50 px-4 py-2 rounded-t-lg border-b border-teal-100">
        <div className="text-sm font-medium text-teal-900">🎨 艺术风格</div>
      </div>
      <div className="p-4">
        <select 
          className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={data.style || 'impressionism'}
          onChange={(e) => data.onChange?.(e.target.value)}
        >
          {styles.map(style => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>
      <Handle 
        type="target" 
        position={Position.Left}
        className="w-3 h-3 bg-teal-500" 
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-3 h-3 bg-teal-500" 
      />
    </div>
  )
} 