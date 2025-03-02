import { BaseNode } from './base-node'
import Image from 'next/image'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Eye } from 'lucide-react'

// 图生图模型列表
const models = [
  { value: '07e00af4fc464c7ab55ff906f8acf1b7', label: '星流Star-3 Alpha图生图' },
]

export function ImageVariationNode({ data, selected }) {
  const [showPreview, setShowPreview] = useState(false);
  
  // 获取当前节点生成的图像
  const nodeImage = data.image || data.image;

  return (
    <BaseNode
      data={data}
      selected={selected}
      type="imageVariation"
      inputs={['image', 'text']}
      outputs={['image']}
      className="w-[320px]"
    >
      {/* 图片预览按钮 */}
      {nodeImage && (
        <div 
          className="absolute top-2 right-2 z-10 cursor-pointer bg-white/80 dark:bg-gray-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          
          {/* 悬停显示图片预览 */}
          {showPreview && (
            <div className="absolute right-0 top-8 z-50 rounded-md overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <Image 
                src={nodeImage} 
                alt="生成图像" 
                width={300}
                height={300}
                className="max-w-[300px] max-h-[300px] object-contain bg-white dark:bg-gray-800"
              />
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🖼️</span>
          <span className="font-medium">图像变体</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">选择模型</label>
            <Select
              value={data.model}
              onValueChange={(value) => data.onChange?.({ model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">提示词</label>
            <Textarea
              placeholder="输入图像生成提示词..."
              value={data.prompt || ''}
              onChange={(e) => data.onChange?.({ prompt: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">变化强度</label>
            <Slider
              value={[data.strength]}
              onValueChange={([value]) => data.onChange?.({ strength: value })}
              min={0}
              max={1}
              step={0.05}
              className="my-2"
            />
            <div className="text-sm text-gray-500 text-right">{data.strength}</div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">生成数量</label>
            <Slider
              value={[data.imgCount]}
              onValueChange={([value]) => data.onChange?.({ imgCount: value })}
              min={1}
              max={4}
              step={1}
              className="my-2"
            />
            <div className="text-sm text-gray-500 text-right">{data.imgCount}</div>
          </div>
          
          {/* 显示生成状态 */}
          {data.isProcessing && (
            <div className="text-sm text-blue-500">
              图像生成中...
            </div>
          )}
          
          {/* 显示错误信息 */}
          {data.error && (
            <div className="text-sm text-red-500">
              错误: {data.error}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  )
} 