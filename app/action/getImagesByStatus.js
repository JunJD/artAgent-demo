

'use server'

const API_BASE_URL = 'https://openapi.liblibai.cloud'
const API_KEY = process.env.NEXT_PUBLIC_STABILITY_API_KEY

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}
// 获取图片状态
export async function getImagesByStatus(generateUuid) {
    if (!generateUuid) {
      throw new APIError('缺少必要参数', 400)
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate/comfy/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ generateUuid })
      })
      
      if (!response.ok) {
        throw new APIError('图像获取失败', response.status)
      }
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
  