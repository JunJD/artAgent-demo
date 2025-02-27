import { BaseNode } from './base-node'

export function StartNode({ data, selected }) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      type="start"
      outputs={['flow']}
      className="w-[120px]"
    >
      <div className="p-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">▶️</span>
          <span className="font-medium">开始</span>
        </div>
      </div>
    </BaseNode>
  )
} 