import { BaseNode } from './base-node'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// 根据文档中的模型信息更新模型列表
const models = [
  { value: '5d7e67009b344550bc1aa6ccbfa1d7f4', label: '星流Star-3 Alpha文生图' },
]

// 预设的尺寸比例
const aspectRatios = [
  { value: 'square', label: '正方形 (1:1)', width: 1024, height: 1024 },
  { value: 'portrait', label: '人像 (3:4)', width: 768, height: 1024 },
  { value: 'landscape', label: '风景 (16:9)', width: 1280, height: 720 },
  { value: 'custom', label: '自定义' },
]

export function ImageGenNode({ data, selected }) {
  // 处理长宽比变化
  const handleAspectRatioChange = (value) => {
    if (value !== 'custom') {
      const preset = aspectRatios.find(ratio => ratio.value === value);
      data.onChange?.({ 
        aspectRatio: value, 
        width: preset.width, 
        height: preset.height 
      });
    } else {
      data.onChange?.({ aspectRatio: value });
    }
  };

  // 初始化aspectRatio（如果尚未设置）
  if (!data.aspectRatio) {
    data.onChange?.({ aspectRatio: 'square', width: 1024, height: 1024 });
  }

  return (
    <BaseNode
      data={data}
      selected={selected}
      type="imageGen"
      inputs={['text']}
      outputs={['image']}
      className="w-[320px]"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎨</span>
          <span className="font-medium">图像生成</span>
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
            <label className="text-sm text-gray-600 mb-1 block">图像尺寸</label>
            <Select
              value={data.aspectRatio}
              onValueChange={handleAspectRatioChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择尺寸比例" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.aspectRatio === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">宽度</label>
                <Input
                  type="number"
                  value={data.width}
                  onChange={(e) => data.onChange?.({ width: parseInt(e.target.value) })}
                  min={512}
                  max={1024}
                  step={64}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">高度</label>
                <Input
                  type="number"
                  value={data.height}
                  onChange={(e) => data.onChange?.({ height: parseInt(e.target.value) })}
                  min={512}
                  max={1024}
                  step={64}
                />
              </div>
            </div>
          )}

          {data.aspectRatio !== 'custom' && (
            <div className="text-sm text-gray-500">
              当前尺寸: {data.width} × {data.height}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  )
} 