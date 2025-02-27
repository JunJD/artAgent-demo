import { BaseNode } from './base-node'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const models = [
  { value: 'stable_diffusion_xl', label: 'Stable Diffusion XL' },
  { value: 'stable_diffusion_2.1', label: 'Stable Diffusion 2.1' }
]

export function ImageGenNode({ data, selected }) {
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
            <label className="text-sm text-gray-600 mb-1 block">模型</label>
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
            <label className="text-sm text-gray-600 mb-1 block">采样步数</label>
            <Slider
              value={[data.steps]}
              onValueChange={([value]) => data.onChange?.({ steps: value })}
              min={20}
              max={50}
              step={1}
              className="my-2"
            />
            <div className="text-sm text-gray-500 text-right">{data.steps}</div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">CFG Scale</label>
            <Slider
              value={[data.cfg_scale]}
              onValueChange={([value]) => data.onChange?.({ cfg_scale: value })}
              min={1}
              max={20}
              step={0.5}
              className="my-2"
            />
            <div className="text-sm text-gray-500 text-right">{data.cfg_scale}</div>
          </div>

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
        </div>
      </div>
    </BaseNode>
  )
} 