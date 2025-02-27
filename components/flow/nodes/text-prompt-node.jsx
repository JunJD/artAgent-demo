import { BaseNode } from './base-node'
import { Textarea } from '@/components/ui/textarea'

export function TextPromptNode({ data, selected }) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      type="textPrompt"
      inputs={['text']}
      outputs={['text']}
      className="w-[300px]"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✍️</span>
          <span className="font-medium">提示词</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">正向提示词</label>
            <Textarea
              value={data.text || ''}
              onChange={(e) => data.onChange?.({ text: e.target.value })}
              placeholder="输入图像描述..."
              className="min-h-[80px] text-sm"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mb-1 block">负向提示词</label>
            <Textarea
              value={data.negative_prompt || ''}
              onChange={(e) => data.onChange?.({ negative_prompt: e.target.value })}
              placeholder="输入不需要的元素..."
              className="min-h-[60px] text-sm"
            />
          </div>
        </div>
      </div>
    </BaseNode>
  )
} 