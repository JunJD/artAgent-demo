export const nodeTypes = {
  // 基础节点
  start: {
    type: 'start',
    label: '开始',
    icon: '▶️',
    color: 'blue',
    outputs: ['flow'],
    data: {
      type: 'start',
      isProcessing: false,
      error: null
    },
    connections: {
      outputs: ['textPrompt'],
      inputs: []
    }
  },
  end: {
    type: 'end',
    label: '完成',
    icon: '⭕',
    color: 'green',
    inputs: ['image'],
    data: {
      type: 'end',
      image: null
    },
    connections: {
      outputs: [],
      inputs: ['imageGen', 'imageVariation']
    }
  },

  // 核心节点
  textPrompt: {
    type: 'textPrompt',
    label: '提示词',
    icon: '✍️',
    color: 'blue',
    inputs: ['text'],
    outputs: ['text'],
    data: {
      text: '',
      negative_prompt: '',
      isProcessing: false,
      error: null
    },
    connections: {
      outputs: ['imageGen', 'imageVariation', 'textPrompt'],
      inputs: ['start', 'textPrompt']
    }
  },
  
  imageGen: {
    type: 'imageGen',
    label: '图像生成',
    icon: '🎨',
    color: 'orange',
    inputs: ['text'],
    outputs: ['image'],
    data: {
      model: 'stable_diffusion_xl',
      samples: 1,
      steps: 30,
      cfg_scale: 7,
      width: 1024,
      height: 1024
    },
    connections: {
      outputs: ['end', 'imageVariation'],
      inputs: ['textPrompt']
    }
  },

  imageVariation: {
    type: 'imageVariation',
    label: '图像变体',
    icon: '🖼️',
    color: 'purple',
    inputs: ['image', 'text'],
    outputs: ['image'],
    data: {
      strength: 0.7,
      steps: 30,
      cfg_scale: 7
    },
    connections: {
      outputs: ['end', 'imageVariation'],
      inputs: ['imageGen', 'imageVariation', 'textPrompt']
    }
  }
}

export const getNodeDefaults = (type) => {
  return {
    ...nodeTypes[type],
    id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
    position: { x: 0, y: 0 },
    data: {
      ...nodeTypes[type].data
    }
  }
} 