'use server'

const API_BASE_URL = 'https://openapi.liblibai.cloud'
const API_KEY = process.env.NEXT_PUBLIC_STABILITY_API_KEY

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// 获取模板列表
export async function getTemplates() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate/webui/templates`)
    if (!response.ok) {
      throw new APIError('获取模板失败', response.status)
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// 图像变体
export async function imageVariation(formData) {
  try {
    const params = {
      image: formData.get('image'),
      text: formData.get('text'),
      strength: parseFloat(formData.get('strength')),
      cfg_scale: parseFloat(formData.get('cfg_scale')),
      steps: parseInt(formData.get('steps'))
    }

    const response = await fetch(`${API_BASE_URL}/v1/generation/image-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        init_image: params.image,
        text_prompts: [
          {
            text: params.text,
            weight: 1
          }
        ],
        image_strength: params.strength,
        cfg_scale: params.cfg_scale,
        steps: params.steps,
      })
    })

    if (!response.ok) {
      throw new APIError('图像变体生成失败', response.status)
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
} 