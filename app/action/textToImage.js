
'use server'

const API_BASE_URL = 'https://openapi.liblibai.cloud'
const API_KEY = process.env.NEXT_PUBLIC_STABILITY_API_KEY

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}
// 文生图
export async function textToImage(formData) {
    try {
      const params = {
        text: formData.get('text'),
        width: parseInt(formData.get('width')),
        height: parseInt(formData.get('height'))
      }
  
      const response = await fetch(`${API_BASE_URL}/api/generate/webui/text2img/ultra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
          generateParams: {
            prompt: params.text,
            aspectRatio: params.width / params.height,
            imageSize: {
              width: params.width,
              height: params.height
            },
            imgCount: 1,
            controlnet: 'line'
          }
        })
      })
  
      if (!response.ok) {
        throw new APIError('图像生成失败', response.status)
      }
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
  