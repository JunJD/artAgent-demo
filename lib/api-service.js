'use server'
import axios from 'axios'
import hmacsha1 from 'hmacsha1'
import { randomBytes } from 'crypto'

const API_BASE_URL = 'https://openapi.liblibai.cloud'
const ACCESS_KEY = process.env.NEXT_PUBLIC_STABILITY_API_KEY
const SECRET_KEY = process.env.STABILITY_SECRET_KEY

// 生成签名
function generateSignature(url) {
  const timestamp = Date.now()
  const signatureNonce = randomBytes(8).toString('hex') // 生成16位随机字符串
  const str = `${url}&${timestamp}&${signatureNonce}`
  const hash = hmacsha1(SECRET_KEY, str)
  
  // 生成安全的 base64 URL 字符串
  const signature = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  return {
    signature,
    timestamp,
    signatureNonce
  }
}

// 添加签名参数到 URL
function getSignedUrl(url) {
  const { signature, timestamp, signatureNonce } = generateSignature(url)
  console.log('signature', signature)
  console.log('timestamp', timestamp)
  console.log('signatureNonce', signatureNonce)
  console.log('ACCESS_KEY', ACCESS_KEY)
  return `${url}?AccessKey=${ACCESS_KEY}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`
}

// 创建一个 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器添加签名
axiosInstance.interceptors.request.use(config => {
  const signedUrl = getSignedUrl(config.url)
  config.url = signedUrl
  return config
})

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// 服务端动作
export async function generateImage(text, width, height) {
  'use server'
  try {
    const generateParams = {
      prompt: text,
      aspectRatio: 'portrait',
      imageSize: {
        width,
        height
      },
      imgCount: 1,
      // controlnet: 'line'
    }
    console.log('generateParams', generateParams)
    const { data } = await axiosInstance.post('/api/generate/webui/text2img/ultra', {
      templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
      generateParams
    })
    console.log('data', data)
    if(data.code === 0) {
      return data.data
    } else {
      throw new APIError(data.msg, data.code)
    }
  } catch (error) {
    console.error('API Error:', error)
    throw new APIError('图像生成失败', error.response?.status)
  }
}

export async function checkImageStatus(generateUuid) {
  'use server'
  try {
    const { data } = await axiosInstance.post('/api/generate/comfy/status', {
      generateUuid
    })
    console.log('status response:', data)
    
    if (data.code === 0) {
      const statusData = data.data
      // 检查生成状态
      switch (statusData.generateStatus) {
        case 5: // 成功
          if (!statusData.images?.length) {
            throw new APIError('没有生成的图片', 'NO_IMAGES')
          }
          return {
            status: 'success',
            images: statusData.images.map(img => ({
              imageUrl: img.imageUrl,
              auditStatus: img.auditStatus
            })),
            percentCompleted: statusData.percentCompleted
          }
        case 6: // 失败
          throw new APIError('图像生成失败', 'GENERATION_FAILED')
        case 7: // 超时
          throw new APIError('图像生成超时', 'GENERATION_TIMEOUT')
        default: // 1,2,3,4 都是进行中的状态
          return {
            status: 'pending',
            images: [],
            percentCompleted: statusData.percentCompleted
          }
      }
    } else {
      throw new APIError(data.msg, data.code)
    }
  } catch (error) {
    console.error('Status check error:', error)
    throw new APIError(
      error.message || '获取图像状态失败', 
      error.status || error.response?.status
    )
  }
}

export async function createImageVariation(image, text, strength, cfg_scale, steps) {
  'use server'
  try {
    const { data } = await axiosInstance.post('/v1/generation/image-to-image', {
      init_image: image,
      text_prompts: [
        {
          text,
          weight: 1
        }
      ],
      image_strength: strength,
      cfg_scale,
      steps,
    })
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw new APIError('图像变体生成失败', error.response?.status)
  }
}