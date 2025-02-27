import { Handle, Position } from 'reactflow'
import Image from 'next/image'
export function ImageNode({ data }) {
  return (
    <div className="w-[320px] shadow-lg rounded-lg bg-white border-2 border-rose-100">
      <div className="flex items-center bg-rose-50 px-4 py-2 rounded-t-lg border-b border-rose-100">
        <div className="text-sm font-medium text-rose-900">🖼️ 图像生成</div>
      </div>
      <div className="p-4">
        <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {data.image ? (
            <Image 
              src={data.image} 
              alt="生成结果" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-sm text-gray-400 flex flex-col items-center">
              <span className="mb-2">等待生成...</span>
              {data.isProcessing && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
              )}
            </div>
          )}
        </div>
      </div>
      <Handle 
        type="target" 
        position={Position.Left}
        className="w-3 h-3 bg-rose-500" 
      />
    </div>
  )
} 