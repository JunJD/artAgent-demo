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
export async function generateImage(text, width, height, model, aspectRatio = 'portrait') {
  'use server'
  try {
    // 根据模型选择不同的API端点和参数格式
    let endpoint = '/api/generate/webui/text2img/ultra';
    let params = {};
    
    if (model === 'e10adc3949ba59abbe56e057f20f883e') {
      // 1.5和XL模型使用标准接口
      endpoint = '/api/generate/webui/text2img';
      params = {
        templateUuid: model,
        generateParams: {
          checkPointId: "21df5d84cca74f7a885ba672b5a80d19",
          prompt: text,
          sampler: 15,
          steps: 20,
          cfgScale: 7,
          width: width,
          height: height,
          imgCount: 1
        }
      };
    } else {
      // 星流Star-3 Alpha使用Ultra接口
      params = {
        templateUuid: model,
        generateParams: {
          prompt: text,
          aspectRatio,
          imageSize: {
            width,
            height
          },
          imgCount: 1,
        }
      };
    }
    
    console.log('generateParams', params);
    console.log('model', model);
    console.log('endpoint', endpoint);
    
    const { data } = await axiosInstance.post(endpoint, params);
    console.log('data', data);
    if(data.code === 0) {
      return data.data;
    } else {
      throw new APIError(data.msg, data.code);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new APIError('图像生成失败', error.response?.status);
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

export async function createImageVariation(sourceImage, prompt, model, imgCount = 1) {
  'use server'
  try {
    // 根据模型选择不同的API端点和参数格式
    let endpoint = '/api/generate/webui/img2img/ultra';
    let params = {};
    
    if (model === '9c7d531dc75f476aa833b3d452b8f7ad') {
      // 1.5和XL模型使用标准接口
      endpoint = '/api/generate/webui/img2img';
      params = {
        templateUuid: model,
        generateParams: {
          checkPointId: "21df5d84cca74f7a885ba672b5a80d19",
          prompt: prompt,
          sampler: 15,
          steps: 20,
          cfgScale: 7,
          imgCount: imgCount,
          
          // 图像相关参数
          sourceImage: sourceImage,
          resizedWidth: 768,
          resizedHeight: 1024,
          mode: 0, // 图生图
          denoisingStrength: 0.75
        }
      };
    } else {
      // 星流Star-3 Alpha使用Ultra接口
      params = {
        templateUuid: model,
        generateParams: {
          prompt: prompt,
          sourceImage: sourceImage,
          imgCount: imgCount
        }
      };
    }
    
    console.log('图生图参数', params);
    console.log('使用模型', model);
    console.log('endpoint', endpoint);
    
    const { data } = await axiosInstance.post(endpoint, params);
    
    console.log('图生图响应', data);
    if(data.code === 0) {
      return data.data;
    } else {
      throw new APIError(data.msg, data.code);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new APIError('图像变体生成失败', error.response?.status);
  }
}