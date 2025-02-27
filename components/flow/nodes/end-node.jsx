import { BaseNode } from './base-node'
import Image from 'next/image'

export function EndNode({ data, selected }) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      type="end"
      inputs={['image']}
      className="w-[200px]"
    >
      <div className="p-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">⭕</span>
          <span className="font-medium">完成</span>
        </div>
        {data.image && (
          <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={data.image}
              alt="最终结果"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </BaseNode>
  )
} 