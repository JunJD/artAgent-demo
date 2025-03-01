import { BaseNode } from './base-node'
import Image from 'next/image'
import { useState } from 'react'

export function EndNode({ data, selected }) {
  const [imageError, setImageError] = useState(false)

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
          <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
            <Image
              src={data.image}
              alt="最终结果"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="200px"
              priority
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500">
                图片加载失败
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  )
} 