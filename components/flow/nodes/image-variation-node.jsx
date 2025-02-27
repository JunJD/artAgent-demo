import { BaseNode } from './base-node'
import { Slider } from '@/components/ui/slider'

export function ImageVariationNode({ data, selected }) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      type="imageVariation"
      inputs={['image', 'text']}
      outputs={['image']}
      className="w-[300px]"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🖼️</span>
          <span className="font-medium">图像变体</span>
        </div>

        <div className="space-y-4">
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
        </div>
      </div>
    </BaseNode>
  )
} 