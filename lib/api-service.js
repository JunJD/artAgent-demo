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

// 百度智能体相关API服务

// 获取百度智能体访问令牌
export async function getBaiduAccessToken() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_BAIDU_CLIENT_ID
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_BAIDU_CLIENT_SECRET
  
  console.log('CLIENT_ID', CLIENT_ID)
  console.log('CLIENT_SECRET', CLIENT_SECRET)
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('缺少百度智能体API凭证')
  }

  try {
    const response = await fetch('https://aip.baidubce.com/oauth/2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    })

    const data = await response.json()
    
    if (!data.access_token) {
      throw new Error('获取访问令牌失败: ' + JSON.stringify(data))
    }
    
    return data.access_token
  } catch (error) {
    console.error('获取百度访问令牌失败:', error)
    throw error
  }
}

// 调用百度智能体获取回复
export async function fetchBaiduResponse(messages) {
  try {
    const accessToken = await getBaiduAccessToken()
    
    // 将消息格式转换为百度智能体需要的格式
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    
    const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/agent/completions?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        // 可以添加其他参数，比如temperature等
      })
    })

    const data = await response.json()
    
    if (data.error_code) {
      throw new Error(`API错误: ${data.error_code} - ${data.error_msg}`)
    }
    
    return data.result || '抱歉，我无法生成回复。'
  } catch (error) {
    console.error('调用百度智能体API失败:', error)
    throw error
  }
}

// 生成建议问题
export async function generateSuggestions(messages) {
  // 如果对话历史为空，使用默认建议
  if (!messages || messages.length <= 1) {
    return [
      "如何优化我的创作流程？",
      "推荐一些艺术风格",
      "解释下印象派的特点",
      "如何提高作品质量？"
    ]
  }
  
  try {
    const accessToken = await getBaiduAccessToken()
    
    // 构建生成建议的提示语
    const prompt = {
      role: "user",
      content: `基于我们之前的对话，请生成4个相关的问题建议，每个不超过15个字。这些建议应该是用户可能想问的问题。格式要求：仅返回问题列表，不要有其他文字。当前对话历史：${JSON.stringify(
        messages.slice(-5).map(m => `${m.role}: ${m.content}`).join("\n")
      )}`
    }
    
    const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/agent/completions?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [prompt],
        temperature: 0.7,
      })
    })

    const data = await response.json()
    
    if (data.error_code) {
      throw new Error(`API错误: ${data.error_code} - ${data.error_msg}`)
    }
    
    // 解析回复，提取建议列表
    const content = data.result || ''
    const suggestions = content
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('建议') && !line.startsWith('问题'))
      .map(line => line.replace(/^[0-9]\.|\*|\-|\*\s|\.\s/, '').trim())
      .slice(0, 4)
    
    return suggestions.length > 0 ? suggestions : [
      "如何优化我的创作流程？",
      "推荐一些艺术风格",
      "解释下印象派的特点",
      "如何提高作品质量？"
    ]
  } catch (error) {
    console.error('生成建议失败:', error)
    // 返回默认建议
    return [
      "如何优化我的创作流程？",
      "推荐一些艺术风格",
      "解释下印象派的特点",
      "如何提高作品质量？"
    ]
  }
}