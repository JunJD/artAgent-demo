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
      outputs: ['textPrompt', 'imageGen'],
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
  // textPrompt: {
  //   type: 'textPrompt',
  //   label: '提示词',
  //   icon: '✍️',
  //   color: 'blue',
  //   inputs: ['text'],
  //   outputs: ['text'],
  //   data: {
  //     text: '',
  //     negative_prompt: '',
  //     isProcessing: false,
  //     error: null
  //   },
  //   connections: {
  //     outputs: ['imageGen', 'imageVariation', 'textPrompt'],
  //     inputs: ['start', 'textPrompt']
  //   }
  // },
  
  imageGen: {
    type: 'imageGen',
    label: '文生图',
    icon: '🎨',
    color: 'orange',
    inputs: ['text'],
    outputs: ['image'],
    data: {
      model: '5d7e67009b344550bc1aa6ccbfa1d7f4',
      samples: 1,
      prompt: '帮我生成一个随机风景照片',
      aspectRatio: 'square',
      width: 1024,
      height: 1024,
    },
    connections: {
      outputs: ['end', 'imageVariation'],
      inputs: ['textPrompt', 'start']
    }
  },

  imageVariation: {
    type: 'imageVariation',
    label: '图生图',
    icon: '🖼️',
    color: 'purple',
    inputs: ['image', 'text'],
    outputs: ['image'],
    data: {
      model: '07e00af4fc464c7ab55ff906f8acf1b7',
      prompt: '',
      imgCount: 1
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