LiblibAI-API产品主页和购买下单：https://www.liblib.art/apis
产品简介
欢迎使用LiblibAI x 星流 图像大模型API来进行创作！无论你是进行个人项目还是为其他终端用户提供的服务，我们的API都能满足你的需求。
全新AI图像模型和工作流API，提供极致的图像质量，在输出速度、生图成本和图像卓越性之间实现平衡。
您有任何问题，可随时联系商务：17521599324，电话微信同。
我们提供了工作流产品和2款API模型产品：
- LiblibAI工作流：社区商用工作流和个人本地工作流均可支持调用。工作流挑选和商用查询可至https://www.liblib.art/workflows
- 星流Star-3 Alpha：适合对AI生图参数不太了解或不想复杂控制的用户。搭载自带LoRA推荐算法，对自然语言的精准响应，提供极致的图像质量，能够生成具有照片级真实感的视觉效果，不能自由添加LoRA和ControlNet。生图效果可至星流官网https://xingliu.art/体验。
- LiblibAI自定义模型：适合高度自由、精准控制和特定风格的场景，基于F.1/XL/v3/v1.5等基础算法，支持自定义调用LiblibAI内全量10万+可商用模型和私有模型。最新开源模型和插件第一时间更新。模型挑选和商用查询可至https://www.liblib.art/
API试用计划：登录后可领取500试用积分，限时7天免费测试体验。
如何选择适合您的API模型产品——
[图片]
文档版本更新
日期
说明
2024.11.15
支持F.1风格迁移：参考《F.1风格迁移参数示例》
2024.12.5
- 原【进阶模式】更名为【LiblibAI自定义模型】
- 原【简易模式-经典模型XL】不再维护，不再支持新接入
- 开放LiblibAI全网可商用模型和私有模型调用，查询和调用模型接口详见文档3.1.1
2024.12.18
查询生图结果的返回字段，新增pointsCost（当次任务消耗积分）和accountBalance（账户剩余积分数）
2025.1.2
2.4 增加Comfyui接入星流API
2025.1.17
5 增加调用ComfyUI工作流
2025.2.5
8 增加java的SDK
1. 开始使用
在这一部分，我们将展示如何开通API的权益，以及如何创建你的API密钥。
1.1 访问地址
Liblib开放平台域名：https://openapi.liblibai.cloud（无法直接打开，需配合密钥访问）
1.2 计费规则
非固定消耗，每次生图任务消耗的积分与以下参数有关：
- 选用模型
- 采样步数（steps）
- 采样方法（sampler，SDE系列会产生额外消耗）
- 生成图片宽度
- 生成图片高度
- 生成图片张数
- 重绘幅度（denoisingStrength）
- 高分辨率修复的重绘步数和重绘幅度
- Controlnet数量
1.3 并发数和QPS
- 生图任务并发数默认5（同时可进行的生图任务数）
- 发起生图任务接口QPS限制1秒1次
- 查询生图结果接口QPS无限制
1.4 生成API密钥
在登录Liblib领取API试用计划或购买API积分后，Liblib会生成开放平台访问密钥，用于后续API接口访问，密钥包括：
- AccessKey，API访问凭证，唯一识别访问用户，长度通常在20-30位左右，如：KIQMFXjHaobx7wqo9XvYKA
- SecretKey，API访问密钥，用于加密请求参数，避免请求参数被篡改，长度通常在30位以上，如：KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d
1.4.1 使用密钥
申请API密钥之后，需要在每次请求API接口的查询字符串中固定传递以下参数：
参数
类型
是否必需
说明
AccessKey
String
是
开通开放平台授权的访问AccessKey
Signature
String
是
加密请求参数生成的签名，签名公式见下节“生成签名”
Timestamp
String
是
生成签名时的毫秒时间戳，整数字符串，有效期5分钟
SignatureNonce
String
是
生成签名时的随机字符串
如请求地址：https://test.xxx.com/api/genImg?AccessKey=KIQMFXjHaobx7wqo9XvYKA&Signature=test1232132&Timestamp=1725458584000&SignatureNonce=random1232
1.4.2 生成签名
签名生成公式如下：
# 1. 用"&"拼接参数
# URI地址：以上方请求地址为例，为“/api/genImg”
# 毫秒时间戳：即上节“使用密钥”中要传递的“Timestamp”
# 随机字符串：即上节“使用密钥”中要传递的“SignatureNonce”
原文 = URI地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
# 2. 用SecretKey加密原文，使用hmacsha1算法
密文 = hmacSha1(原文, SecretKey)
# 3. 生成url安全的base64签名
# 注：base64编码时不要补全位数
签名 = encodeBase64URLSafeString(密文)
Java生成签名示例，以访问上方“使用密钥”的请求地址为例：
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;

public class SignUtil {

    /**
     * 生成请求签名
     * 其中相关变量均为示例，请替换为您的实际数据
     */
    public static String makeSign() {

        // API访问密钥
        String secretKey = "KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d";
        
        // 请求API接口的uri地址
        String uri = "/api/generate/webui/text2img";
        // 当前毫秒时间戳
        Long timestamp = System.currentTimeMillis();
        // 随机字符串
        String signatureNonce = RandomStringUtils.randomAlphanumeric(10);
        // 拼接请求数据
        String content = uri + "&" + timestamp + "&" + signatureNonce;
    
        try {
            // 生成签名
            SecretKeySpec secret = new SecretKeySpec(secretKey.getBytes(), "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(secret);
            return Base64.encodeBase64URLSafeString(mac.doFinal(content.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("no such algorithm");
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
Python生成签名示例，以访问上方“使用密钥”的请求地址为例：
import hmac
from hashlib import sha1
import base64
import time
import uuid

def make_sign():
    """
    生成签名
    """

    # API访问密钥
    secret_key = 'KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d'

    # 请求API接口的uri地址
    uri = "/api/genImg"
    # 当前毫秒时间戳
    timestamp = str(int(time.time() * 1000))
    # 随机字符串
    signature_nonce= str(uuid.uuid4())
    # 拼接请求数据
    content = '&'.join((uri, timestamp, signature_nonce))
    
    # 生成签名
    digest = hmac.new(secret_key.encode(), content.encode(), sha1).digest()
    # 移除为了补全base64位数而填充的尾部等号
    sign = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()
    return sign

NodeJs 生成签名示例，以访问上方“使用密钥”的请求地址为例：
const hmacsha1 = require("hmacsha1");
const randomString = require("string-random");
// 生成签名
const urlSignature = (url) => {
  if (!url) return;
  const timestamp = Date.now(); // 当前时间戳
  const signatureNonce = randomString(16); // 随机字符串，你可以任意设置，这个没有要求
  // 原文 = URl地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
  const str = `${url}&${timestamp}&${signatureNonce}`;
  const secretKey = "官网上的 SecretKey "; // 下单后在官网中，找到自己的 SecretKey'
  const hash = hmacsha1(secretKey, str);
  // 最后一步： encodeBase64URLSafeString(密文)
  // 这一步很重要，生成安全字符串。java、Python 以外的语言，可以参考这个 JS 的处理
  let signature = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return {
    signature,
    timestamp,
    signatureNonce,
  };
};
// 例子：原本查询生图进度接口是 https://openapi.liblibai.cloud/api/generate/webui/status
// 加密后，url 就变更为 https://openapi.liblibai.cloud/api/generate/webui/status?AccessKey={YOUR_ACCESS_KEY}&Signature={签名}&Timestamp={时间戳}&SignatureNonce={随机字符串}
const getUrl = () => {
  const url = "/api/generate/webui/status";
  const { signature, timestamp, signatureNonce } = urlSignature(url);
  const accessKey = "替换自己的 AccessKey"; // '下单后在官网中，找到自己的 AccessKey'
  return `${url}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
};

2. 星流Star-3 Alpha 
2.1 星流Star-3 Alpha生图
2.1.1 星流Star-3 Alpha文生图
- 接口：POST /api/generate/webui/text2img/ultra
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
templateUuid
string
是
- 星流Star-3 Alpha文生图：5d7e67009b344550bc1aa6ccbfa1d7f4

generateParams
object
是
生图参数，json结构
参数中的图片字段需提供可访问的完整图片地址
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
- 参数说明
变量名
格式
备注
数值范围
必填
示例
prompt

string
正向提示词，文本
- 不超过2000字符
- 纯英文文本
是
https://liblibai.feishu.cn/sync/AjdCdCiVHsxk2IblvGzcINM1nde

aspectRatio
string
图片宽高比预设
，与imageSize二选一配置即可
1. square：
  - 宽高比：1:1，通用
  - 具体尺寸：1024*1024
2. portrait：
  1. 宽高比：3:4，适合人物肖像
  2. 具体尺寸：768*1024
3. landscape：
  1. 宽高比：16:9，适合影视画幅
  2. 具体尺寸：1280*720
二选一配置


imageSize
Object
图片具体宽高，与aspectRatio二选一配置即可
1. width：int，512~2048
2. height：int，512~2048


imgCount
int
单次生图张数
1 ~ 4
是

controlnet
Object
构图控制
1. controlType：
  1. line：线稿轮廓
  2. depth：空间关系
  3. pose：人物姿态
  4. IPAdapter：风格迁移
2. controlImage：参考图可公网访问的完整URL
否

2.1.2 星流Star-3 Alpha图生图
- 接口：POST /api/generate/webui/img2img/ultra
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
templateUUID
string
是
- 星流Star-3 Alpha图生图：07e00af4fc464c7ab55ff906f8acf1b7

generateParams
object
是
生图参数，json结构
参数中的图片字段需提供可访问的完整图片地址
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
- 参数说明
变量名
格式
备注
数值范围
必填
示例
prompt

string
正向提示词，文本
- 不超过2000字符
- 纯英文文本
是

https://liblibai.feishu.cn/sync/TF7jdgTOOsQCP4bxO2bcib7znsg
sourceImage
string
参考图URL
参考图可公网访问的完整URL
是

imgCount
int
单次生图张数
1 ~ 4
是

controlnet
Object
构图控制
1. controlType：
  1. line：线稿轮廓
  2. depth：空间关系
  3. pose：人物姿态
  4. IPAdapter：风格迁移
2. controlImage：参考图可公网访问的完整URL
否


2.2 查询生图结果
- 接口：POST /api/generate/webui/status
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
备注
generateUuid
string
是
生图任务uuid，发起生图任务时返回该字段
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
generateStatus
int
生图状态见下方3.3.1节
percentCompleted
float
生图进度，0到1之间的浮点数，（暂未实现）
generateMsg
string
生图信息，提供附加信息，如生图失败信息
pointsCost
int
本次生图任务消耗积分数
accountBalance
int
账户剩余积分数
images
[]object
图片列表，只提供审核通过的图片
images.0.imageUrl
string
图片地址，可直接访问，地址有时效性：7天
images.0.seed
int
随机种子值
iamges.0.auditStatus
int
审核状态见下方2.5.2节
  示例：
{
    "code": 0,
    "msg": "",
    "data": {
        "generateUuid": "8dcbfa2997444899b71357ccb7db378b",
        "generateStatus": 5,
        "percentCompleted": 0,
        "generateMsg": "",
        "pointsCost": 10,// 本次任务消耗积分数
        "accountBalance": 1356402,// 账户剩余积分数
        "images": [
            {
                "imageUrl": "https://liblibai-online.liblib.cloud/sd-images/08efe30c1cacc4bb08df8585368db1f9c082b6904dd8150e6e0de5bc526419ee.png",
                "seed": 12345,
                "auditStatus": 3
            }
        ]
    }
}
2.3 参数模版预设
还提供了一些封装后的参数预设，您可以只提供必要的生图参数，极大简化了配置成本，欢迎体验~
2.3.1 模版选择（templateUuid）
模板名称
模板UUID
备注
星流Star-3 Alpha文生图
5d7e67009b344550bc1aa6ccbfa1d7f4
- Checkpoint默认为官方自研模型Star-3 Alpha
- 支持指定的几款Controlnet
星流Star-3 Alpha图生图
07e00af4fc464c7ab55ff906f8acf1b7
- Checkpoint默认为官方自研模型Star-3 Alpha
- 支持指定的几款Controlnet
2.3.2 模版传参示例
以下提供了调用各类模版时的传参示例，方便您理解不同模版的使用方式。
注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。
星流Star-3 Alpha文生图 - 简易版本
https://liblibai.feishu.cn/sync/AjdCdCiVHsxk2IblvGzcINM1nde
星流Star-3 Alpha图生图 - 简易版本
https://liblibai.feishu.cn/sync/TF7jdgTOOsQCP4bxO2bcib7znsg
2.4 ComfyUI接入星流API
- 准备Comfyui环境，到https://github.com/comfyanonymous/ComfyUI下载免安装文件，解压，有显卡点击run_nvidia_gpu.bat启动Comfyui，没有显卡点击run_cpu.bat启动，启动后保留运行后台不关闭，在web进行配置操作。
- 下载星流节点文件https://github.com/lib-teamwork/ComfyUI-liblib，放到./ComfyUl/custom_nodes文件夹下。
- 重启Comfyui打开workflow文件夹，图片生成工作流文件
- 鉴权信息需要API密钥，appkey对应Accesskey，appsecret对应Secretkey
[图片]
- 建议自己再安装一个comfyui manager维护各种新节点: https://github.com/ltdrdata/ComfyUI-Manager

3. LiblibAI自定义模型
- 可自由调用LiblibAI网站内F.1-dev/XL/v3/v1.5全量模型（暂不支持混元和PixArt），适合高度自由和精准控制的场景。
- 调用条件
  - 同账号下的个人主页内所有模型，本地模型可先在LiblibAI官网右上角“发布”上传个人模型，可按需设置“仅个人可见”，即可仅被本账号在API调用，不会被公开查看或调用。
  - LiblibAI官网内，模型详情页右侧，作者授权“可出售生成图片或用于商业目的”的所有模型。

3.1 接口文档
3.1.1 查询模型版本
在LiblibAI网站上挑选作者授权可商用的模型，个人私有模型中“仅个人可见”的模型也可被个人api账号调用，获取模型链接结尾的version_uuid，调接口进行查询。
3.1.1.1 查询模型版本参数示例 
- 接口：POST /api/model/version/get
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
versionUuid
string
是
要查询的模型版本uuid
1. 目前Lib已开放全站的可商用模型供API使用，您可以在Lib站内检索可商用的Checkpoint和LoRA模型
[图片]
2. 选择喜欢的模型版本，从浏览器网址中复制versionUuid
[图片]
3. 粘贴到文生图或图生图的参数模板中使用；
4. 若您忘记了在生图参数中应用的模型是哪一款，您可以调用本接口进行查询。
3.1.1.2 返回值示例
{
    "version_uuid": "21df5d84cca74f7a885ba672b5a80d19",//LiblibAI官网模型链接后缀
    "model_name": "AWPortrait XL"
    "version_name": "1.1"
    "baseAlgo": "基础算法 XL"，
    "show_type": "1"，//公开可用的模型
    "commercial_use": "1"，//可商用为1，不可商用为0
    "model_url": "https://www.liblib.art/modelinfo/f8b990b20cb943e3aa0e96f34099d794?versionUuid=21df5d84cca74f7a885ba672b5a80d19"
    }
}
3.1.1.3 异常情况：
  未匹配到：提示“未找到与{version_uuid}对应的模型，请检查version_uuid是否正确，或所选模型是否为Checkpoint或LoRA”；
  baseAlgo不在给定范围内的，提示“{version_uuid}不在API目前支持的baseAlgo范围内”。
  
3.1.2 提交文生图任务
- 接口：POST /api/generate/webui/text2img
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
templateUuid
string
否
参数模板uuid

generateParams
object
是
生图参数，json结构
参数中的图片字段需提供可访问的完整图片地址
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
3.1.2.1 文生图参数示例
  注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。
{
    "templateUuid": "e10adc3949ba59abbe56e057f20f883e",
    "generateParams": {
        "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", // 底模 modelVersionUUID
        "prompt": "Asian portrait,A young woman wearing a green baseball cap,covering one eye with her hand", // 选填
        "negativePrompt": "ng_deepnegative_v1_75t,(badhandv4:1.2),EasyNegative,(worst quality:2),", //选填
        "sampler": 15, // 采样方法
        "steps": 20, // 采样步数
        "cfgScale": 7, // 提示词引导系数
        "width": 768, // 宽
        "height": 1024, // 高
        "imgCount": 1, // 图片数量    
        "randnSource": 0,  // 随机种子生成器 0 cpu，1 Gpu
        "seed": 2228967414, // 随机种子值，-1表示随机    
        "restoreFaces": 0,  // 面部修复，0关闭，1开启
        
        // Lora添加，最多5个
        "additionalNetwork": [
            {
                "modelId": "31360f2f031b4ff6b589412a52713fcf", //LoRA的模型版本versionuuid
                "weight": 0.3 // LoRA权重
            },
            {
                "modelId": "365e700254dd40bbb90d5e78c152ec7f", //LoRA的模型版本uuid
                "weight": 0.6 // LoRA权重
            }
        ],
    
        // 高分辨率修复
        "hiResFixInfo": {
            "hiresSteps": 20, // 高分辨率修复的重绘步数
            "hiresDenoisingStrength": 0.75, // 高分辨率修复的重绘幅度
            "upscaler": 10, // 放大算法模型枚举
            "resizedWidth": 1024,  // 放大后的宽度
            "resizedHeight": 1536  // 放大后的高度
        }
    }
}
3.1.2.2 返回值示例
{
    "code": 0,
    "msg": "",
    "data": {
        "generateUuid": "8dcbfa2997444899b71357ccb7db378b"
    }
}
3.1.3 提交图生图任务
- 接口：POST /api/generate/webui/img2img
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
templateUUID
string
否
参数模板uuid

generateParams
object
否
生图参数，json结构
参数中的图片字段需提供可访问的完整图片地址
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
3.1.3.1 图生图参数示例
  注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。
{
    "templateUuid": "9c7d531dc75f476aa833b3d452b8f7ad", // 预设参数模板ID
    "generateParams": {
        // 基础参数
        "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", //底模
        "prompt": "1 girl wear sunglasses", //正向提示词
        "negativePrompt": //负向提示词
        "clipSkip": 2, // Clip跳过层
        "sampler": 15, //采样方法
        "steps": 20, // 采样步数
        "cfgScale": 7, // 提示词引导系数    
        "randnSource": 0, // 随机种子来源，0表示CPU，1表示GPU
        "seed": -1, // 随机种子值，-1表示随机
        "imgCount": 1, // 1到4
        "restoreFaces": 0,  // 面部修复，0关闭，1开启
        
        // 图像相关参数
        "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
        "resizeMode": 0, // 缩放模式， 0 拉伸，1 裁剪，2 填充 
        "resizedWidth": 1024, // 图像缩放后的宽度
        "resizedHeight": 1536, // 图像缩放后的高度
        "mode": 4, // 0图生图，4局部重绘
        "denoisingStrength": 0.75, // 重绘幅度
        
        // Lora添加，最多5个
        "additionalNetwork": [
            {
                "modelId": "31360f2f031b4ff6b589412a52713fcf", //LoRA的模型版本uuid
                "weight": 0.3 // LoRA权重
            },
            {
                "modelId": "365e700254dd40bbb90d5e78c152ec7f", //LoRA的模型版本uuid
                "weight": 0.6 // LoRA权重
            }
        ],
        
        // 局部重绘相关参数
        "inpaintParam": { 
            "maskImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/323fc358-618b-4c7d-b431-7d890209e5a5.png", // 蒙版地址
            "maskBlur": 4, // 蒙版模糊度
            "maskPadding": 32, //蒙版边缘预留像素，也称蒙版扩展量 
            "maskMode": 0, // 蒙版模式    
            "inpaintArea": 0, //重绘区域, 0重绘全图，1仅重绘蒙版区域
            "inpaintingFill": 1 //蒙版内容的填充模式
        },
    
        // controlNet，最多4组
        "controlNet": [
            {
                "unitOrder": 1, // 执行顺序
                "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
                "width": 1024, // 参考图宽度
                "height": 1536, // 参考图高度
                "preprocessor": 3, // 预处理器枚举值
                "annotationParameters": { // 预处理器参数， 不同预处理器不同，此处仅为示意
                    "depthLeres": { // 3 预处理器 对应的参数
                        "preprocessorResolution": 1024,
                        "removeNear": 0,
                        "removeBackground": 0
                    }
                },
                "model": "6349e9dae8814084bd9c1585d335c24c", // controlnet的模型
                "controlWeight": 1, // 控制权重
                "startingControlStep": 0, //开始控制步数
                "endingControlStep": 1, // 结束控制步数
                "pixelPerfect": 1, // 完美像素
                "controlMode": 0, // 控制模式 ，0 均衡，1 更注重提示词，2 更注重controlnet，
                "resizeMode": 1, // 缩放模式， 0 拉伸，1 裁剪，2 填充
                "maskImage": "" // 蒙版图
            }
        ]
    }
}
3.1.3.2 返回值示例
{
    "code": 0,
    "msg": "",
    "data": {
        "generateUuid": "8dcbfa2997444899b71357ccb7db378b"
    }
}
  
3.1.4 查询生图结果
- 接口：POST /api/generate/webui/status
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
备注
generateUuid
string
是
生图任务uuid，发起生图任务时返回该字段
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
generateStatus
int
生图状态见下方3.3.1节
percentCompleted
float
生图进度，0到1之间的浮点数，(暂未实现生图进度)
generateMsg
string
生图信息，提供附加信息，如生图失败信息
pointsCost
int
本次生图任务消耗积分数
accountBalance
int
账户剩余积分数
images
[]object
图片列表，只提供审核通过的图片
images.0.imageUrl
string
图片地址，可直接访问，地址有时效性：7天
images.0.seed
int
随机种子值
images.0.auditStatus
int
审核状态见下方2.5.2节
  示例：
{
    "code": 0,
    "msg": "",
    "data": {
        "generateUuid": "8dcbfa2997444899b71357ccb7db378b",
        "generateStatus": 5,
        "percentCompleted": 0,
        "generateMsg": "",
        "pointsCost": 10,// 本次任务消耗积分数
        "accountBalance": 1356402,// 账户剩余积分数
        "images": [
            {
                "imageUrl": "https://liblibai-online.liblib.cloud/sd-images/08efe30c1cacc4bb08df8585368db1f9c082b6904dd8150e6e0de5bc526419ee.png",
                "seed": 12345,
                "auditStatus": 3
            }
        ]
    }
}
3.2 参数说明
3.2.1 文生图基础参数
变量名
格式
备注
数值范围
必填
示例
checkPointId

String
模型uuid

从全网可商用模型和自有模型中选择，详见文档3.1.1
是
{
    "templateUuid": "e10adc3949ba59abbe56e057f20f883e", // 参数模板ID
    "generateParams": {
        // 基础参数
        "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", // 底模 modelVersionUUID
        "vaeId": "",
        "prompt": "Asian portrait,A young woman wearing a green baseball cap,covering one eye with her hand", // 选填
        "negativePrompt": "ng_deepnegative_v1_75t,(badhandv4:1.2),EasyNegative,(worst quality:2),nsfw", //选填
        "clipSkip": 2,  // 1到12，正整数值
        "sampler": 15, // 采样方法
        "steps": 20, // 采样步数
        "cfgScale": 7, // 提示词引导系数
        "width": 768, // 宽
        "height": 1024, // 高
        "imgCount": 1, // 图片数量    
        "randnSource": 0,  // 随机种子生成器 0 cpu，1 Gpu
        "seed": -1, // 随机种子值，-1表示随机    
        "restoreFaces": 0,  // 面部修复，0关闭，1开启
        
        // Lora添加，最多5个
        "additionalNetwork": [],
    
        // 高分辨率修复
        "hiResFixInfo": {},   
       
        // controlNet，最多4组
        "controlNet": []
    }
}


additionalNetwork
list[object]
- LoRA组合及权重设置
- LoRA的基础算法类型需要与checkpoint一致
参考additionalNetwork的参数配置

否

vaeId
String
VAE的模型uuid
- 从提供的VAE列表中选择
- 可为空，空值表示取checkpoint的VAE
否

prompt

string
正向提示词，文本
- 不超过2000字符
- 纯英文文本
是

negativePrompt
string
负向提示词，文本
- 不超过2000字符
- 纯英文文本不超过2000字符
是

clipSkip
int
Clip跳过层
1 ~ 12。默认值2
是

sampler
int
采样器枚举值
从采样方法列表中选择
是

steps
int
采样步数
1 ~ 60
是

cfgScale
double
cfg_scale
1.0 ~ 15.0
是

width
int
初始宽度
- 范围：128 ~ 1536
- 基础算法1.5 建议区间：512~768
- 基础算法XL 建议区间：768~1344
- 基础算法F.1 建议区间：768~2048
是

height
int
初始高度
- 范围：128 ~ 1536
- 基础算法1.5 建议区间：512~768
- 基础算法XL 建议区间：768~1344
- 基础算法F.1 建议区间：768~2048
是

imgCount
int
单次生图张数
1 ~ 4
是

randnSource
int
随机种子生成来源
0: CPU，1: GPU。默认值0
是

seed
Long
随机种子
- 范围：-1 ~ 9999999999
- -1表示随机
是

restoreFaces
int
面部修复
0：关闭，1：开启。默认值0
是

hiResFixInfo
Object
高分辨率修复
参考高分辨率修复的相关参数
否

controlNet

list[Object]
模型加载的ControlNet组合及各自参数
参考controlnet参数配置

否


3.2.2 additionalNetwork
变量名
格式
备注
数值范围
必填
示例
modelId
String
LoRA的模型uuid
从全网可商用模型和自有模型中选择，详见文档3.1.1
否
// Lora添加，最多5个
"additionalNetwork": [
    {
        "modelId": "31360f2f031b4ff6b589412a52713fcf", //LoRA的模型版本uuid
        "weight": 0.3 // LoRA权重
    },
    {
        "modelId": "365e700254dd40bbb90d5e78c152ec7f", //LoRA的模型版本uuid
        "weight": 0.6 // LoRA权重
    }
],
weight
double
LoRA权重
-4.00 ~ +4.00，默认0.8
否

3.2.3 高分辨率修复 hiResFixInfo
变量名
格式
备注
数值范围
必填
示例
hiresSteps
int
高清修复采样步数
1 ~ 30
否
// 高分辨率修复
"hiResFixInfo": {
    "hiresSteps": 20, // 高分辨率修复的重绘步数
    "hiresDenoisingStrength": 0.75, // 高分辨率修复的重绘幅度
    "upscaler": 10, // 放大算法模型枚举
    "resizedWidth": 1024,  // 放大后的宽度
    "resizedHeight": 1536  // 放大后的高度
},
hiresDenoisingStrength
double
高清修复去噪强度

0 ~ 1，精确到百分位

否


upscaler
int
放大算法枚举
从提供的放大算法模型枚举中选择
否

resizedWidth
int
缩放宽度
128 ~ 2048
否

resizedHeight
int
缩放高度
128 ~ 2048
否

3.2.4 图生图基础参数
变量名
格式
备注
数值范围
必填
示例
templateUuid
String
预设模版uuid
从提供的预设参数模版中选择
是
{
    "templateUuid": "9c7d531dc75f476aa833b3d452b8f7ad", // 预设参数模板ID
    "generateParams": {
        // 基础参数
        "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", //底模
        "vaeId": "", //  vae模型，可为空
        "prompt": "1 girl wear glasses", //正向提示词
        "negativePrompt": "ng_deepnegative_v1_75t,(badhandv4:1.2),EasyNegative,(worst quality:2),nsfw", //负向提示词
        "clipSkip": 2, // Clip跳过层
        "sampler": 15, //采样方法
        "steps": 20, // 采样步数
        "cfgScale": 7, // 提示词引导系数    
        "randnSource": 0, // 随机种子来源，0表示CPU，1表示GPU
        "seed": -1, // 随机种子值，-1表示随机
        "imgCount": 1, // 1到4
        "restoreFaces": 0,  // 面部修复，0关闭，1开启
        
        // 图像相关参数
        "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
        "resizeMode": 0, // 缩放模式， 0 拉伸，1 裁剪，2 填充 
        "resizedWidth": 1024, // 图像缩放后的宽度
        "resizedHeight": 1536, // 图像缩放后的高度
        "mode": 0, // 0图生图，4蒙版重绘
        "denoisingStrength": 0.75, // 重绘幅度
        
        // 蒙版重绘相关参数
        "inpaintParam": {},
    
        // Lora添加，最多5个
        "additionalNetwork": [],
        
        // Controlnet，最多4组
        "controlNet": []
    }
}

checkPointId

String
模型uuid
从全网可商用模型和自有模型中选择，详见文档3.1.1

是

additionalNetwork
list[object]
LoRA模型的附加组合及各自参数
参考additionalNetwork的参数配置

否

vaeId
String
VAE的模型uuid
从提供的VAE列表中选择
否

prompt
string
正向提示词，文本
- 不超过2000字符
- 纯英文文本
是

negativePrompt
string
负向提示词，文本
- 不超过2000字符
- 纯英文文本
是

clipSkip
int
Clip跳过层
1 ~ 12
是

sampler
int
采样器枚举值
从采样方法列表中选择
是

steps
int
采样步数
1 ~ 60
是

cfgScale
double
cfg_scale
1.0 ~ 15.0
是

randnSource
int

类型
- 0: CPU 
- 1: GPU
是

seed
int
随机种子
- 范围：-1 ~ 9999999999
- -1表示随机
是

imgCount
int
单次生图张数
1 ~ 4
是

restoreFaces
int
面部修复
0：关闭，1：开启。默认值0
是

sourceImage

string
参考图地址
可公网访问的完整URL

是

resizeMode

int
缩放模式
- 0：just_resize 
- 1：crop_and_resize 
- 2：resize_and_fill
是

resizedWidth
int
调整后的图片宽度
128 ~ 2048
是

resizedHeight
int
调整后的图片高度
128 ~ 2048
是

mode

int
生图模式

- 0：img2img，图生图
- 4：inpaint upload mask，蒙版重绘
是

denoisingStrength

double
去噪强度（图生图重绘幅度）
0 ~ 1。默认值0.75
是

inpaintParam
Object
蒙版重绘相关参数
参考蒙版重绘相关参数配置
mode=4时必填

controlNet

list[Object]
模型加载的ControlNet组合及各自参数
参考controlnet参数配置

否


3.2.5 蒙版重绘相关参数
变量名
格式
备注
数值范围
必填
示例
maskImage

string
蒙版文件地址，只用文件名png
- 蒙版图URL
- 要求：白色蒙版，黑色底色
mode=4时必填

// 蒙版重绘相关参数
"inpaintParam": { 
    "maskImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/323fc358-618b-4c7d-b431-7d890209e5a5.png", // 蒙版地址
    "maskBlur": 4, // 蒙版模糊度
    "maskPadding": 32, //蒙版边缘预留像素，也称蒙版扩展量 
    "maskMode": 0, // 蒙版模式    
    "inpaintArea": 0, //重绘区域, 0重绘全图，1仅重绘蒙版区域
    "inpaintingFill": 1 //蒙版内容的填充模式
},

maskBlur
int
蒙版模糊度
0 ~ 64，默认为4

mode=4时必填

maskPadding

int
蒙版边缘预留像素，也称蒙版扩展量
0 ~ 256，默认32

mode=4时必填

maskMode

int
蒙版模式
- 0：Inpaint_masked，重绘蒙版区域
- 1：Inpaint_not_masked，重绘非蒙版区域
mode=4时必填

inpaintArea
int

重绘区域
- 0：whole_picture，重绘全图
- 1：only_masked，仅重绘蒙版区域
mode=4时必填

inpaintingFill

int

蒙版内容的填充模式

- 0：fill，填充
- 1：original，原图
- 2：latent_noise，潜空间噪声
- 3：latent_nothing，空白潜空间
mode=4时必填


3.2.6 Controlnet相关参数
① Controlnet基础参数
变量名
格式
备注
数值范围
必填
示例
unitOrder
int
Controlnet单元顺序
1 ~ 4
是
// controlNet，最多4组
"controlNet": [
    {
        "unitOrder": 1, // 执行顺序
        "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
        "width": 1024, // 参考图宽度
        "height": 1536, // 参考图高度
        "preprocessor": 3, // 预处理器枚举值
        "annotationParameters": { // 预处理器参数， 不同预处理器不同，此处仅为示意
            "depthLeres": { // 3 预处理器 对应的参数
                "preprocessorResolution": 1024,
                "removeNear": 0,
                "removeBackground": 0
            }
        },
        "model": "6349e9dae8814084bd9c1585d335c24c", // controlnet的模型
        "controlWeight": 1, // 控制权重
        "startingControlStep": 0, //开始控制步数
        "endingControlStep": 1, // 结束控制步数
        "pixelPerfect": 1, // 完美像素
        "controlMode": 0, // 控制模式 ，0 均衡，1 更注重提示词，2 更注重controlnet，
        "resizeMode": 1, // 缩放模式， 0 拉伸，1 裁剪，2 填充
        "maskImage": "" // 蒙版图
    }
]

sourceImage
string
图片地址
可公网访问的完整url
是

width 
int
参考图宽度
不超过4096
是

height
int
参考图高度
不超过4096
是

preprocessor
int
预处理器枚举值
从Controlnet预处理器列表中选择
是

annotationParameters

object

预处理参数
参考预处理器参数配置
是

model
string
Controlnet模型uuid
从提供的controlnet模型列表中选择
是

controlWeight
double
controlnet权重
0 ~ 2，默认值1
是

startingControlStep

double
controlnet生效起始step，输入的值实际是表示占采样步数的百分比
0 ~ 1，默认值0

是

endingControlStep
double
controlnet生效终止step，输入的值实际是表示占采样步数的百分比
0 ~ 1，默认值1
是

pixelPerfect
int
完美像素模式
0是关闭，1是开启。默认值1
是

controlMode
int
控制模式
- 0：balanced，均衡
- 1：prompt_important，更注重提示词
- 2：controlnet_important，更注重controlnet
是

resizeMode

int
缩放模式

- 0：just_resize，直接缩放
- 1：crop_and_resize，裁剪并缩放
- 2：resize_and_fill，缩放并填充
是

maskImage
string
mask图片地址
- 蒙版图url，务必与参考图尺寸一致
- 要求：白色蒙版，黑色底色
否

② ControlNet预处理器
适用方向
Controlnet 类型
预处理器
预处理器名称映射
预处理器枚举值
预处理结果示意
预处理器参数
示例
建议搭配的Controlnet model
线稿类
Canny（硬边缘）

Canny（硬边缘）

canny
1

[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. lowThreshold
  1. 变量名称：低阈值
  2. 数据格式：int
  3. 数值范围：1 ~ 255
  4. 默认值：100
3. highThreshold
  1. 变量名称：高阈值
  2. 数据格式：int
  3. 数值范围：1 ~ 255
  4. 默认值：200
"preprocessor":1,
"annotationParameters": {
    "canny": {
        "preprocessorResolution": 512,
        "lowThreshold": 100,
        "highThreshold": 200
    }
}

- 基础算法 1.5：control_v11p_sd15_canny
- 基础算法 XL：xinsir_controlnet-canny-sdxl_V2
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


SoftEdge（软边缘）
hed
hed
5
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":5,
"annotationParameters": {
    "hed": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：mistoLine_rank256
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro



hed_safe
hedSafe
6
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":6,
"annotationParameters": {
    "hedSafe": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：mistoLine_rank256
- 基础算法 F.1: InstantX-FLUX.1-dev-Controlnet-Union-Pro


pidinet
pidinet
17
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":17,
"annotationParameters": {
    "pidinet": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：mistoLine_rank256
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro



pidinet_safe
pidinetSafe
18
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":18,
"annotationParameters": {
    "pidinetSafe": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：mistoLine_rank256
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


softedge_teed
softedgeTeed
58
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. safeSteps
  1. 变量名称：离散程度
  2. 数据格式：int
  3. 数值范围：0 ~ 64
  4. 默认值：2
"preprocessor":58,
"annotationParameters": {
    "softedgeTeed": {
        "preprocessorResolution": 512,
        "safeSteps": 2
    }
}
- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：controlnet-sd-xl-1.0-softedge-dexined
- 基础算法 F.1：F.1_mistoline_dev_v1



softedge_anyline

softedgeAnyline
65
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. safeSteps
  1. 变量名称：离散程度
  2. 数据格式：int
  3. 数值范围：0 ~ 64
  4. 默认值：2
"preprocessor":65,
"annotationParameters": {
    "softedgeAnyline": {
        "preprocessorResolution": 512,
        "safeSteps": 2
    }
}

- 基础算法 1.5：control_v11p_sd15_softedge
- 基础算法 XL：mistoLine_rank256, controlnet-sd-xl-1.0-softedge-dexined
- 基础算法 F.1：F.1_mistoline_dev_v1

MLSD（直线）
mlsd (M-LSD 直线线条检测)
mlsd

8
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. valueThreshold
  1. 变量名称：值阈值
  2. 数据格式：double
  3. 数值范围：0.01 ~ 2.00
  4. 默认值：0.1
3. distanceThreshold
  1. 变量名称：距离阈值
  2. 数据格式：double
  3. 数值范围：0.01 ~ 20.00
  4. 默认值：0.1
"preprocessor":8,
"annotationParameters": {
    "mlsd": {
        "preprocessorResolution": 512,
        "valueThreshold": 0.1,
        "distanceThreshold": 0.1
    }
}

- 基础算法 1.5：control_v11p_sd15_mlsd
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型

Scribble/Sketch（涂鸦/草图）
scribble_pidinet(涂鸦- 手绘)
scribblePidinet

20
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":20,
"annotationParameters": {
    "scribblePidinet": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_scribble
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


scribble_xdog (涂鸦- 强化边缘)

scribbleXdog 
21
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. XDoGThreshold
  1. 变量名称：二值化阈值
  2. 数据格式：int
  3. 数值范围：1 ~ 64
  4. 默认值：32
"preprocessor":21,
"annotationParameters": {
    "scribbleXdog": {
        "preprocessorResolution": 512,
        "XDoGThreshold": 32
    }
}

- 基础算法 1.5：control_v11p_sd15_scribble
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro



scribble_hed(涂鸦 -合成)

scribbleHed

22
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":22,
"annotationParameters": {
    "scribbleHed": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_scribble
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro

Lineart（线稿）

lineart_realistic (写实线稿提取)

lineartRealistic 
29
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":29,
"annotationParameters": {
    "lineartRealistic": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_lineart
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


lineart standard (标准线稿提取 -白底黑线反色)
lineartStandard
32
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":32,
"annotationParameters": {
    "lineartStandard": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_lineart
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


lineart coarse (粗略线稿提取)
lineartCoarse

30
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":30,
"annotationParameters": {
    "lineartCoarse": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_lineart
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


lineart_anime (动漫线稿提取)

lineartAnime 
31
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":31,
"annotationParameters": {
    "lineartAnime": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15s2_lineart_anime
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


lineart_anime_denoise(动漫线稿提取-去噪)

lineartAnimeDenoise
36
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":36,
"annotationParameters": {
    "lineartAnimeDenoise": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15s2_lineart_anime
- 基础算法 XL：xinsir_anime_painter
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro
空间关系类

Depth（深度图）
depth_midas

depthMidas

2

[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":2,
"annotationParameters": {
    "depthMidas": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11f1p_sd15_depth
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


depth_leres (LeRes 深度图估算)

depthLeres 
3
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. removeNear
  1. 变量名称：删除前景
  2. 数据格式：double
  3. 数值范围：0.0 ~ 100.0
  4. 默认值：0
3. removeBackground
  1. 变量名称：删除背景
  2. 数据格式：double
  3. 数值范围：0.0 ~ 100.0
  4. 默认值：0
"preprocessor":3,
"annotationParameters": {
    "depthLeres": {
        "preprocessorResolution": 512,
        "removeNear": 0,
        "removeBackground": 0
    }
}

- 基础算法 1.5：control_v11f1p_sd15_depth
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro



depth_leres++

depthLeresPlus
4
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. removeNear
  1. 变量名称：删除前景
  2. 数据格式：double
  3. 数值范围：0.0 ~ 100.0
  4. 默认值：0
3. removeBackground
  1. 变量名称：删除背景
  2. 数据格式：double
  3. 数值范围：0.0 ~ 100.0
  4. 默认值：0
"preprocessor":4,
"annotationParameters": {
    "depthLeresPlus": {
        "preprocessorResolution": 512,
        "removeNear": 0,
        "removeBackground": 0
    }
}
- 基础算法 1.5：control_v11f1p_sd15_depth
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro



depth_zoe (ZoE 深度图估算)
depthZoe 
25
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":25,
"annotationParameters": {
    "depthZoe": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11f1p_sd15_depth
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


depth_hand_refiner

depthHandRefiner
57
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":57,
"annotationParameters": {
    "depthHandRefiner": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_sd15_inpaint_depth_hand_fp16
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro


depth_anything
depthAnything
64


1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":64,
"annotationParameters": {
    "depthAnything": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11f1p_sd15_depth
- 基础算法 XL：xinsir_controlnet_depth_sdxl_1.0
- 基础算法 F.1：InstantX-FLUX.1-dev-Controlnet-Union-Pro

Segment（语义分割）
segmentation

segmentation
23
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":23,
"annotationParameters": {
    "segmentation": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_seg
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型



oneformer_coco

oneformerCoco
27
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":27,
"annotationParameters": {
    "oneformerCoco": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_seg
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


oneformer_ade20k

oneformerAde20k
28
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":28,
"annotationParameters": {
    "oneformerAde20k": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_seg
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


anime_face_segment

animeFaceSegment
54
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":54,
"annotationParameters": {
    "animeFaceSegment": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_seg
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型

Normal（正态）
normal_map
normalMap
9
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. backgroundThreshold
  1. 变量名称：背景阈值
  2. 数据格式：double
  3. 数值范围：0 ~ 1.0
  4. 默认值：0.4
"preprocessor":9,
"annotationParameters": {
    "normalMap": {
        "preprocessorResolution": 512,
        "backgroundThreshold": 0.4
    }
}
- 基础算法 1.5：control_v11p_sd15_normalbae
- 基础算法 XL：暂无模型
- 基础算法 F.1：Flux.1-dev-Controlnet-Surface-Normal


normal bae (Bae 法线贴图提取)
normalBae
26
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":26,
"annotationParameters": {
    "normalBae": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_normalbae
- 基础算法 XL：暂无模型
- 基础算法 F.1：Flux.1-dev-Controlnet-Surface-Normal
姿态类

OpenPose（姿态）
mediapipe_face

mediapipeFace
7

[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. maxFaces
  1. 变量名称：最大数量
  2. 数据格式：int
  3. 数值范围：1 ~ 10
  4. 默认值：1
3. minConfidence
  1. 变量名称：最小置信度
  2. 数据格式：double
  3. 数值范围：0.01 ~ 1
  4. 默认值：0.5
"preprocessor":7,
"annotationParameters": {
    "mediapipeFace": {
        "preprocessorResolution": 512,
        "maxFaces": 1,
        "minConfidence": 0.5
    }
}
- 基础算法 1.5：control_v2p_sd15_mediapipe_face
- 基础算法 XL：暂无模型
- 基础算法 F.1：F.1-ControlNet-Pose-V1


openpose (OpenPose 姿态)
openpose
10
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":10,
"annotationParameters": {
    "openpose": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1


openpose hand (OpenPose 姿态及手部)
openposeHand
11
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":11,
"annotationParameters": {
    "openposeHand": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1


openpose face (OpenPose 姿态及脸部)
openposeFace
12
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":12,
"annotationParameters": {
    "openposeFace": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1


openpose_faceonly (OpenPose 仅脸部)
openposeFaceonly 
13
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":13,
"annotationParameters": {
    "openposeFaceonly": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1


openpose_full (OpenPose 姿态、手部及脸部)

openposeFull 
14
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":14,
"annotationParameters": {
    "openposeFull": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1



dw_openpose_full

dwOpenposeFull
45
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":45,
"annotationParameters": {
    "dwOpenposeFull": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_openpose
- 基础算法 XL：xinsir_controlnet-openpose-sdxl-1.0
- 基础算法 F.1：F.1-ControlNet-Pose-V1


animal_openpose
animalOpenpose
53
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":53,
"annotationParameters": {
    "animalOpenpose": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_sd15_animal_openpose_fp16
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


densepose

densepose
55
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":55,
"annotationParameters": {
    "densepose": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_densepose_fp16
- 基础算法 XL：controlnet-densepose-sdxl
- 基础算法 F.1：暂无模型


densepose_parula

denseposeParula
56
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":56,
"annotationParameters": {
    "denseposeParula": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11p_sd15_densepose_fp16
- 基础算法 XL：controlnet-densepose-sdxl
- 基础算法 F.1：暂无模型
画面参考
Tile/Blur（分块/模糊）
tile_resample(分块重采样)

tileResample
34
/
1. downSamplingRate
  1. 变量名称：下采样率
  2. 数据格式：double
  3. 数值范围：1.00 ~ 8.00
  4. 默认值：1
"preprocessor":34,
"annotationParameters": {
    "tileResample": {
        "downSamplingRate": 1
    }
}
- 基础算法 1.5：control_v11f1e_sd15_tile
- 基础算法 XL：xinsir_controlnet_tile_sdxl_1.0
- 基础算法 F.1：Flux.1-dev-Controlnet-Upscaler


tile_colorfix
tileColorfix
43
/
1. variation
  1. 变量名称：变化率
  2. 数据格式：int
  3. 数值范围：3 ~ 32
  4. 默认值：8
"preprocessor":43,
"annotationParameters": {
    "tileColorfix": {
        "variation": 8
    }
}
- 基础算法 1.5：control_v11f1e_sd15_tile
- 基础算法 XL：xinsir_controlnet_tile_sdxl_1.0
- 基础算法 F.1：Flux.1-dev-Controlnet-Upscaler


tile_colorfix+sharp
tileColorfixSharp
44
/
1. variation
  1. 变量名称：变化率
  2. 数据格式：int
  3. 数值范围：3 ~ 32
  4. 默认值：8
2. sharpness
  1. 变量名称：锐度
  2. 数据格式：double
  3. 数值范围：0 ~ 2.00
  4. 默认值：1
"preprocessor":44,
"annotationParameters": {
    "tileColorfixSharp": {
        "variation": 8,
        "sharpness": 1
    }
}
- 基础算法 1.5：control_v11f1e_sd15_tile
- 基础算法 XL：xinsir_controlnet_tile_sdxl_1.0
- 基础算法 F.1：Flux.1-dev-Controlnet-Upscaler


blur_gaussian

blurGaussian
52
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
2. sigma
  1. 变量名称：离散程度
  2. 数据格式：int
  3. 数值范围：0 ~ 64
  4. 默认值：9
"preprocessor":52,
"annotationParameters": {
    "blurGaussian": {
        "preprocessorResolution": 512,
        "sigma": 9
    }
}

- 基础算法 1.5：暂无模型
- 基础算法 XL：kohya_controllllite_xl_blur
- 基础算法 F.1：Flux.1-dev-Controlnet-Upscaler

Reference（参考）
reference_only
referenceOnly
37
/
1. styleFidelity
  1. 变量名称：风格忠实度
  2. 数据格式：double
  3. 数值范围：0 ~ 1.0
  4. 默认值：0.5
"preprocessor":37,
"annotationParameters": {
    "referenceOnly": {
        "styleFidelity": 0.5
    }
}
- 基础算法 1.5：None
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


reference_adain
referenceAdain
38
/
1. styleFidelity
  1. 变量名称：风格忠实度
  2. 数据格式：double
  3. 数值范围：0 ~ 1.0
  4. 默认值：0.5
"preprocessor":38,
"annotationParameters": {
    "referenceAdain": {
        "styleFidelity": 0.5
    }
}
- 基础算法 1.5：None
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


reference_adain+attn

referenceAdainAttn
39
/
1. styleFidelity
  1. 变量名称：风格忠实度
  2. 数据格式：double
  3. 数值范围：0 ~ 1.0
  4. 默认值：0.5
"preprocessor":39,
"annotationParameters": {
    "referenceAdainAttn": {
        "styleFidelity": 0.5
    }
}
- 基础算法 1.5：None
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型
风格迁移
IP-Adapter
ip-adapter_clip_sd15
ipAdapterClipSd15
48
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":48,
"annotationParameters": {
    "ipAdapterClipSd15": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：ip-adapter_sd15
- 基础算法 XL：不可搭配
- 基础算法 F.1：暂无模型


ip-adapter_clip_sdxl

ipAdapterClipSdxl
49
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":49,
"annotationParameters": {
    "ipAdapterClipSdxl": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：不可搭配
- 基础算法 XL：ip-adapter_xl,  ip-adapter_sdxl_vit-h
- 基础算法 F.1：暂无模型


ip-adapter_clip_sdxl_plus_vith
ipAdapterClipSdxlPlusVith
61
/
/
"preprocessor":61,
"annotationParameters": {
    "ipAdapterClipSdxlPlusVith": {}
}
- 基础算法 1.5：不可搭配
- 基础算法 XL：ip-adapter-plus_sdxl_vit-h
- 基础算法 F.1：暂无模型


ip-adapter-siglip
ipAdapterSiglip
66
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":66,
"annotationParameters": {
    "ipAdapterSiglip": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：不可搭配
- 基础算法 XL：不可搭配
- 基础算法 F.1: InstantX-F.1-dev-IP-Adapter

T2I-Adapter
clip_vision
clipVision
15
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":15,
"annotationParameters": {
    "clipVision": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：t2iadapter_style_sd14v1
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


color
color
16
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":16,
"annotationParameters": {
    "color": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：t2iadapter_color_sd14v1
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型


pidinet_sketch
pidinetSketch
19
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":19,
"annotationParameters": {
    "pidinetSketch": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：t2iadapter_sketch_sd15v2
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型

Shuffle (随机洗牌)
shuffle (随机洗牌)
shuffle
33
[图片]
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":33,
"annotationParameters": {
    "shuffle": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：control_v11e_sd15_shuffle
- 基础算法 XL：暂无模型
- 基础算法 F.1：暂无模型
上色
Recolor（重上色）
recolor_luminance
recolorLuminance
50
[图片]
1. gammaCorrection
  1. 变量名称：伽马修正
  2. 数据格式：double
  3. 数值范围：0.1 ~ 2.0
  4. 默认值：1
"preprocessor":50,
"annotationParameters": {
    "recolorLuminance": {
        "gammaCorrection": 1
    }
}
- 基础算法 1.5：ioclab_sd15_recolor
- 基础算法 XL：sai_xl_recolor_256lora
- 基础算法 F.1：暂无模型


recolor_intensity
recolorIntensity

51
[图片]
1. gammaCorrection
  1. 变量名称：伽马修正
  2. 数据格式：double
  3. 数值范围：0.1 ~ 2.0
  4. 默认值：1
"preprocessor":51,
"annotationParameters": {
    "recolorIntensity": {
        "gammaCorrection": 1
    }
}
- 基础算法 1.5：ioclab_sd15_recolor
- 基础算法 XL：sai_xl_recolor_256lora
- 基础算法 F.1：暂无模型
局部重绘
Inpaint（局部重绘）
inpaint_global_harmonious
inpaintGlobalHarmonious
40
/
/
"preprocessor":40,
"annotationParameters": {
    "inpaintGlobalHarmonious": {}
}
- 基础算法 1.5：segmentation_mask_brushnet_ckpt
- 基础算法 XL：segmentation_mask_brushnet_ckpt_sdxl_v1
- 基础算法 F.1：F.1-dev-Controlnet-Inpainting-Beta


inpaint_only
inpaintOnly
41
/
/
"preprocessor":41,
"annotationParameters": {
    "inpaintOnly": {}
}
- 基础算法 1.5：segmentation_mask_brushnet_ckpt
- 基础算法 XL：segmentation_mask_brushnet_ckpt_sdxl_v1
- 基础算法 F.1：F.1-dev-Controlnet-Inpainting-Beta



inpaint_only+lama
inpaintOnlyLama
42
/
/
"preprocessor":42,
"annotationParameters": {
    "inpaintOnlyLama": {}
}
- 基础算法 1.5：segmentation_mask_brushnet_ckpt
- 基础算法 XL：segmentation_mask_brushnet_ckpt_sdxl_v1
- 基础算法 F.1：F.1-dev-Controlnet-Inpainting-Beta

换脸
IP-Adapter
ip-adapter_face_id
ipAdapterFaceId
62
/
/
"preprocessor":62,
"annotationParameters": {
    "ipAdapterFaceId": {}
}
- 基础算法 1.5：ip-adapter_face_id
- 基础算法 XL：ip-adapter-faceid_sdxl
- 基础算法 F.1：暂无模型



ip-adapter_face_id_plus
ipAdapterFaceIdPlus
63
/
/
"preprocessor":63,
"annotationParameters": {
    "ipAdapterFaceIdPlus": {}
}
- 基础算法 1.5：ip-adapter-faceid-plusv2_sd15
- 基础算法 XL：ip-adapter-faceid-plusv2_sdxl
- 基础算法 F.1：暂无模型


Instant ID
instant_id_face_keypoints
instantIdFaceKeypoints
59
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":59,
"annotationParameters": {
    "instantIdFaceKeypoints": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：暂无模型
- 基础算法 XL：control_instant_id_sdxl
- 基础算法 F.1：暂无模型


instant_id_face_embedding

instantIdFaceEmbedding
60
/
1. preprocessorResolution
  1. 变量名称：预处理器分辨率
  2. 数据格式：int
  3. 数值范围：64 ~ 2048
  4. 默认值：512
"preprocessor":60,
"annotationParameters": {
    "instantIdFaceEmbedding": {
        "preprocessorResolution": 512
    }
}
- 基础算法 1.5：暂无模型
- 基础算法 XL：ip-adapter_instant_id_sdxl
- 基础算法 F.1：暂无模型
其他
/
None
none
0
/
/
"preprocessor":0,
"annotationParameters": {
    "none": {}
}
仅在参考图是处理后的线稿、深度图、骨骼图时使用


/
invert (白底黑线反色)
invert
35
/
/
"preprocessor":35,
"annotationParameters": {
    "invert": {}
}
仅在参考图是白色线条，黑色背景，且要应用线稿模型时使用

③ ControlNet模型列表
适用方向
Controlnet 类型
模型名称
基础算法类型
模型版本UUID
线稿类
Canny（硬边缘）
control_v11p_sd15_canny
基础算法 1.5
7d917ec7e55c5805db737d3b493c91ce


t2iadapter_canny_sd14v1
基础算法 1.5
a2c41c4e97944f3aa71f913bdc45b1ca


t2iadapter_canny_sd15v2
基础算法 1.5
c04144bcf017232483181cd8607097c2


diffusers_xl_canny_full
基础算法 XL
56de5edadb6f2891aff05ff078dc0470


diffusers_xl_canny_mid
基础算法 XL
efb97e9d8c237573298c3a5a7869b89c


diffusers_xl_canny_small
基础算法 XL
dccde738064e9748f93b48ec5868968e


kohya_controllllite_xl_canny
基础算法 XL
5242e3d18cc18689bd8af11dd2d675c1


kohya_controllllite_xl_canny_anime
基础算法 XL
4f3e1cfe79f87496ec69a37826c3afeb


sai_xl_canny_128lora
基础算法 XL
63c7f2c6c354336513831aa522d7e0f4


sai_xl_canny_256lora
基础算法 XL
5bf551f53651764cad56363e17900d87


t2i-adapter_diffusers_xl_canny
基础算法 XL
618390ab2957a422612cb2ba92a2788f


t2i-adapter_xl_canny
基础算法 XL
7cd56501c336c1edba78430355c9d081


xinsir_controlnet-canny-sdxl_V2
基础算法 XL
b6806516962f4e1599a93ac4483c3d23


XLabs-flux-canny-controlnet_v3
基础算法 F.1
017997cd6ba44c4dbe8f60e0a26cd0df


InstantX-FLUX.1-dev-Controlnet-Union-Pro
基础算法 F.1
13c1e1b96ba64f9cbb2b54f89b5fe873

SoftEdge（软边缘）

control_v11p_sd15_softedge
基础算法 1.5
0929722d9047ec6498a50ff5d1081629


sargezt_xl_softedge
基础算法 XL
dda1a0c480bfab9833d9d9a1e4a71fff


controlnet-sd-xl-1.0-softedge-dexined
基础算法 XL
37bddde3d45c11ee9b5e00163e365853


mistoLine_softedge_sdxl_fp16
基础算法 XL
4f6726be104a432f8039b018c92ed4bf


mistoLine_rank256
基础算法 XL
83286d0e66a845c58f7d23442f9dedf9


XLabs-flux-hed-controlnet_v3
基础算法 F.1
6c4d620df3644514903b8189735c6ae9


F.1_mistoline_dev_v1
基础算法 F.1
3e6860a3b9444f25ae07d9c1b5d1ba9e


InstantX-FLUX.1-dev-Controlnet-Union-Pro
基础算法 F.1
13c1e1b96ba64f9cbb2b54f89b5fe873

MLSD（直线）
control_v11p_sd15_mlsd
基础算法 1.5
7168cece6a0d491375aa1753ff3bdc21

Scribble/Sketch（涂鸦/草图）
control_v11p_sd15_scribble
基础算法 1.5
fe57911f7ba1b84eb27f1e1ecead3367


kohya_controllllite_xl_scribble_anime
基础算法 XL
4a399a87f1ffbc26d065a38765d30d24


xinsir_controlnet-scribble-sdxl-1.0
基础算法 XL
888cf8985bd6442cba1f2d975b6eb022


xinsir_anime_painter
基础算法 XL
f936bf22cb8e4dcfa6b0f3b96cdd8eb7

Lineart（线稿）

control_v11p_sd15_lineart
基础算法 1.5
b06dfbd1a61c35e933d9f8caa8a0e031


control_v11p_sd15s2_lineart_anime
基础算法 1.5
c263e039c57b8a958ee0a936039af654


t2i-adapter_diffusers_xl_lineart
基础算法 XL
a0f01da42bf48b0ba02c86b6c26b5699
空间关系类

Depth（深度图）

control_v11f1p_sd15_depth
基础算法 1.5
cf63d214734760dcdc108b1bd094921b


t2iadapter_depth_sd15v2
基础算法 1.5
f08a4a889b56d4099e8a947503cabc14


t2iadapter_depth_sd14v1
基础算法 1.5
8b74bf9ea84f592c069b523d9bef9dab


t2iadapter_zoedepth_sd15v1
基础算法 1.5
fc8b79f97eeceda388b43df12509c311


control_sd15_inpaint_depth_hand_fp16
基础算法 1.5
3497061cd45c11ee9b5e00163e365853


t2i-adapter_diffusers_xl_depth_zoe
基础算法 XL
a35993a2d1cde4a6c800364a68731c67


sai_xl_depth_128lora
基础算法 XL
3156f3428afc7122c66b2b950f09d4cd


t2i-adapter_diffusers_xl_depth_midas
基础算法 XL
c22ec6a7a24eed6b91889ae1a1e94b2e


diffusers_xl_depth_mid
基础算法 XL
740d6d428e70d4b40888efa4d9eb642a


xinsir_controlnet_depth_sdxl_1.0
基础算法 XL
6349e9dae8814084bd9c1585d335c24c


sai_xl_depth_256lora
基础算法 XL
08d0fbb72d7fab601218df26978a46e0


sargezt_xl_depth
基础算法 XL
feb9ee5779bf2eb3fdd669f2e3e6b1aa


sargezt_xl_depth_zeed
基础算法 XL
4216d4b49a6b559d76d181908f866eb8


kohya_controllllite_xl_depth_anime
基础算法 XL
dea707d52e3a8f243da5579579cb3a3d


kohya_controllllite_xl_depth
基础算法 XL
693d7182db5293c0087524580111fd96


sargezt_xl_depth_faid_vidit
基础算法 XL
1c6d32d0fb004cf1becc2b526fd83690


diffusers_xl_depth_small
基础算法 XL
6a786af31a13776100e9c6a90f99aebf


diffusers_xl_depth_full
基础算法 XL
04dcab4b18c7b821e96660d6c19de50b


XLabs-flux-depth-controlnet_v3
基础算法 F.1
0cc4e6b8206b44cdab51e30fb8b9c328


InstantX-FLUX.1-dev-Controlnet-Union-Pro
基础算法 F.1
13c1e1b96ba64f9cbb2b54f89b5fe873


Flux.1-dev-Controlnet-Depth
基础算法 F.1
64dd7a6c714f4512a4500f6a01b016b7

Segment（语义分割）
control_v11p_sd15_seg
基础算法 1.5
94571f4bb5136464afc1540a92ae3ee8

Normal（正态）
control_v11p_sd15_normalbae
基础算法 1.5
9a85fdca18a8b58b2fb2ff13ab339be4


Flux.1-dev-Controlnet-Surface-Normal
基础算法 F.1
e51fdccdf3b8417aab246bde40b5f360
姿态类

OpenPose（姿态）

control_v11p_sd15_openpose
基础算法 1.5
b46dd34ef9c2fe189446599d62516cbf


t2iadapter_openpose_sd14v1
基础算法 1.5
5a8b19a8809e00be4e17517e8ab174ad


control_v11p_sd15_densepose_fp16
基础算法 1.5
3b4e0830d45c11ee9b5e00163e365853


control_sd15_animal_openpose_fp16
基础算法 1.5
329f0073d45c11ee9b5e00163e365853


control_v2p_sd15_mediapipe_face
基础算法 1.5
73de0752a7a8431ba21637cda6723c95


kohya_controllllite_xl_openpose_anime_v2
基础算法 XL
4cbbd2483088ef5f0d41bfef0d7141fb


kohya_controllllite_xl_openpose_anime
基础算法 XL
abb5d55cf94c504f6f8c64abc0b1483f


thibaud_xl_openpose_256lora
基础算法 XL
4dd1f4df2a9d3a9db8aeaa9480196d02


t2i-adapter_xl_openpose
基础算法 XL
9deac5a5c60abfd03261bd174ddba47d


t2i-adapter_diffusers_xl_openpose
基础算法 XL
9cd43e1856040c2436f00802d5b54ee5


thibaud_xl_openpose
基础算法 XL
2fe4f992a81c5ccbdf8e9851c8c96ff2


controlnet-densepose-sdxl
基础算法 XL
3ae77dfdd45c11ee9b5e00163e365853


xinsir_controlnet-openpose-sdxl-1.0
基础算法 XL
23ef8ab803d64288afdb7106b8967a55


F.1-ControlNet-Pose-V1
基础算法 F.1
7c6d889cb9c04b78858d8fece80f9f85
画面参考
Tile/Blur（分块/模糊）
control_v11f1e_sd15_tile
基础算法 1.5
37e42c6bdb6fab4c24a662100f20f722


kohya_controllllite_xl_blur_anime
基础算法 XL
46a34a643f6855e9b3861515712df5d9


xinsir_controlnet_tile_sdxl_1.0
基础算法 XL
0f47ef6d4f4b40afab8b290c98baac0e


kohya_controllllite_xl_blur_anime_beta
基础算法 XL
44199bb6dcf4f65e09a4e5e57ebdf9b4


kohya_controllllite_xl_blur
基础算法 XL
aac5fe593565f0673673731d54ecfab8


TTPLanet_SDXL_Controlnet_Tile_Realistic_v1
基础算法 XL
13bfaf39f9214c658507a92cd15fd02d


TTPLanet_SDXL_Controlnet_Tile_Realistic_v2
基础算法 XL
163d505651a64d6bac9a907b213dc8b0


Flux.1-dev-Controlnet-Upscaler
基础算法 F.1
a696b5bdadc740119fd76505b33d6898

Reference（参考）
None
基础算法 1.5
/
风格迁移
IP-Adapter

ip-adapter_sd15
基础算法 1.5
18801062fe4289dd0a984e69de9f9e7c


ip-adapter_sd15_plus
基础算法 1.5
ad4bd9b4b05c4ac8faf7f81d9fdcadc8


ip-adapter_sd15_light
基础算法 1.5
3a1ddfd0d45c11ee9b5e00163e365853


ip-adapter_sd15_vit-G
基础算法 1.5
36f3d2a0d45c11ee9b5e00163e365853


ip-adapter_xl
基础算法 XL
8ea2538fdd7dcdea52b2da6b5151f875


ip-adapter-plus_sdxl_vit-h
基础算法 XL
38ee73f1d45c11ee9b5e00163e365853


ip-adapter_sdxl_vit-h
基础算法 XL
375866e3d45c11ee9b5e00163e365853


InstantX-F.1-dev-IP-Adapter
基础算法 F.1
c6ed70879cf011ef96d600163e37ec70


F.1-redux-dev
基础算法 F.1
8ddf6f3ba8a111efbb1700163e031cf1

T2I-Adapter
t2iadapter_canny_sd15v2
基础算法 1.5
c04144bcf017232483181cd8607097c2


t2iadapter_depth_sd15v2
基础算法 1.5
f08a4a889b56d4099e8a947503cabc14


t2iadapter_canny_sd14v1
基础算法 1.5
a2c41c4e97944f3aa71f913bdc45b1ca


t2iadapter_color_sd14v1
基础算法 1.5
8e581a4e7c986950d71f1102accad5d0


t2iadapter_depth_sd14v1
基础算法 1.5
8b74bf9ea84f592c069b523d9bef9dab


t2iadapter_keypose_sd14v1
基础算法 1.5
181d8d213381458cb6e326760637d4b4


t2iadapter_openpose_sd14v1
基础算法 1.5
5a8b19a8809e00be4e17517e8ab174ad


t2iadapter_seg_sd14v1
基础算法 1.5
3c680cc8edfbc4479423549e01f21897


t2iadapter_sketch_sd14v1
基础算法 1.5
0d19dd02091ec2d01f3cdd99a4f4b442


t2iadapter_sketch_sd15v2
基础算法 1.5
bd6c5dbb73c2c2e538850c23ab2dcbf5


t2iadapter_style_sd14v1
基础算法 1.5
e33777a1f374eccd9464623c56a82c91


t2iadapter_zoedepth_sd15v1
基础算法 1.5
fc8b79f97eeceda388b43df12509c311

Shuffle (随机洗牌)
control_v11e_sd15_shuffle
基础算法 1.5
9efba1cc2d469bf4be8fc135689bc8a0
上色
Recolor（重上色）
ioclab_sd15_recolor
基础算法 1.5
e0db5b9e227eac932c71498cf7e03a78


sai_xl_recolor_128lora
基础算法 XL
af92235f1de682ceac136c06450c9a51


sai_xl_recolor_256lora
基础算法 XL
03051a3606b4974ec02fc55b079757e7
局部重绘

Inpaint（局部重绘）

control_v11p_sd15_inpaint
基础算法 1.5
ebeada0aa92959b4e905ab6980d5d203


segmentation_mask_brushnet_ckpt
基础算法 1.5
14aa553bf6534a419a9a465eba900f3a


random_mask_brushnet_cpkt
基础算法 1.5
de44488f84a74e02a1fac604d790698c


segmentation_mask_brushnet_ckpt_sdxl_v1
基础算法 XL
a311363995dd4f2fa42ee3fc9582d920


random_mask_brushnet_ckpt_sdxl
基础算法 XL
3161fc68c59847b0ad826a9fb18c857f


F.1-dev-Controlnet-Inpainting-Alpha
基础算法 F.1
012d2f780c0b44dba829bb223207e608


F.1-dev-Controlnet-Inpainting-Beta
基础算法 F.1
31df01fc271d484ca4d496179d69a665
换脸
IP-Adapter

ip-adapter_face_id
基础算法 1.5
368e6a37d45c11ee9b5e00163e365853


ip-adapter-faceid-portrait_sd15
基础算法 1.5
330504bcd45c11ee9b5e00163e365853


ip-adapter-faceid-plusv2_sd15
基础算法 1.5
34fb8ef6d45c11ee9b5e00163e365853


ip-adapter-faceid-plus_sd15
基础算法 1.5
362a215ad45c11ee9b5e00163e365853


ip-adapter-faceid-portrait-v11_sd15
基础算法 1.5
35c50016d45c11ee9b5e00163e365853


ip-adapter-faceid_sdxl
基础算法 XL
38879e1ad45c11ee9b5e00163e365853


ip-adapter-faceid-plusv2_sdxl
基础算法 XL
3953f672d45c11ee9b5e00163e365853


ip-adapter-plus-face_sdxl_vit-h
基础算法 XL
336955e4d45c11ee9b5e00163e365853

Instant ID
ip-adapter_instant_id_sdxl
基础算法 XL
3a8267c7d45c11ee9b5e00163e365853


control_instant_id_sdxl
基础算法 XL
3560664ad45c11ee9b5e00163e365853
其他
光影
control_v1u_sd15_illumination
基础算法 1.5
3109072a5cf6403faba6162003b8f483


control_v1p_sd15_brightness
基础算法 1.5
39b8eac0d45c11ee9b5e00163e365853

二维码
control_v1p_sd15_qrcode_monster
基础算法 1.5
1fa6070c35626e760b1473926852cbbc

3.3 生图状态
3.3.1 生图状态（generateStatus）
状态枚举值
描述
备注
1
等待执行

2
执行中

3
已生图

4
审核中

5
成功

6
失败

7
超时
任务创建30分钟后没有执行结果就计入timeout状态，并解冻积分。
3.3.2 审核状态（auditStatus）
状态枚举值
描述
备注
1
待审核

2
审核中

3
审核通过

4
审核拦截

5
审核失败

3.4 参数模版预设
完整版的生图参数可以满足基础算法F.1、基础算法XL、基础算法1.5下的各类生图任务，但需要非常理解这些参数的含义。
因此除了完整参数的模版以外，我们还提供了一些封装后的参数预设，您可以只提供必要的生图参数，极大简化了配置成本，欢迎体验~
3.4.1 模版选择（templateUuid）
适用方向
模板名称
模板UUID
备注
F.1文生图
F.1文生图 - 自定义完整参数
6f7c4652458d4802969f8d089cf5b91f
- Checkpoint默认为官方模型
- 可用模型范围：基础算法F.1
- 支持additional network
F.1图生图
F.1图生图 - 自定义完整参数
63b72710c9574457ba303d9d9b8df8bd
- Checkpoint默认为官方模型
- 可用模型范围：基础算法F.1
- 支持additional network
1.5和XL文生图

1.5和XL文生图 - 自定义完整参数

e10adc3949ba59abbe56e057f20f883e
- 可用模型范围：基础算法1.5，基础算法XL
- 支持additional network，高分辨率修复和controlnet
- 可通过自由拼接参数实现各类的文生图诉求
1.5和XL图生图
1.5和XL图生图 - 自定义完整参数
9c7d531dc75f476aa833b3d452b8f7ad
- 可用模型范围：基础算法1.5，基础算法XL
- 支持additional network和controlnet
- 可通过自由拼接参数实现各类的图生图和蒙版重绘诉求
局部重绘
Controlnet局部重绘
b689de89e8c9407a874acd415b3aa126
- 提取自文生图完整参数
- 支持additional network和controlnet
- 不支持高分辨率修复（hiresfix）
局部重绘

图生图局部重绘
74509e1b072a4c45a7f1843a963c8462

- 提取自图生图完整参数
- 支持additionalNetwork
- 不支持Controlnet
人物换脸
InstantID人像换脸
7d888009f81d4252a7c458c874cd017f
- 仅用于人像换脸
- 注意人像参考图中的人物面部特征务必清晰
3.4.2 模版传参示例
以下提供了调用各类模版时的传参示例，方便您理解不同模版的使用方式。
注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。
星流Star-3 Alpha文生图
- 接口：POST /api/generate/webui/text2img/ultra
https://liblibai.feishu.cn/sync/AjdCdCiVHsxk2IblvGzcINM1nde
星流Star-3 Alpha图生图
- 接口：POST /api/generate/webui/img2img/ultra
https://liblibai.feishu.cn/sync/TF7jdgTOOsQCP4bxO2bcib7znsg
F.1文生图 - 自定义完整参数示例
- 接口：POST /api/generate/webui/text2img
https://liblibai.feishu.cn/sync/UklAdrkqos0NNubQ42jcymktnSe
F.1图生图 - 自定义完整参数示例
- 接口：POST /api/generate/webui/img2img
https://liblibai.feishu.cn/sync/YasbdeCAasWRaibd0tkc0ZU4nkd
1.5和XL文生图 - 自定义完整参数示例
- 接口：POST /api/generate/webui/text2img
https://liblibai.feishu.cn/sync/VrLRdFII0sSVtJbpj8NccFOqnYb
1.5和XL图生图 - 自定义完整参数示例
- 接口：POST /api/generate/webui/img2img
https://liblibai.feishu.cn/sync/R6HUdfvpEsAHnvbF7i0cf76XnSf
1.5和XL文生图 - 最简版参数示例
- 接口：POST /api/generate/webui/text2img
https://liblibai.feishu.cn/sync/FDSPd57O2seBDwbfJOzcpvvCntg
1.5和XL图生图 - 最简版参数示例
- 接口：POST /api/generate/webui/img2img
https://liblibai.feishu.cn/sync/JPsPdxCIvskntObd6vNc3a0knAb
图生图 - 局部重绘参数示例
- 接口：POST /api/generate/webui/img2img
https://liblibai.feishu.cn/sync/HH8UdbOOzsNQ8Vb3kktcKm7JnHg
Controlnet局部重绘参数示例
- 接口：POST /api/generate/webui/text2img
https://liblibai.feishu.cn/sync/V6jkdvktosdIrfbNiK3cgpB1nOg
InstantID人像换脸参数示例
- 接口：POST /api/generate/webui/text2img
https://liblibai.feishu.cn/sync/BeY5dsCs4sFOtcb2027c8X8Lnrb
F.1风格迁移参数示例
- 接口：POST /api/generate/webui/text2img
{
    "templateUuid": "6f7c4652458d4802969f8d089cf5b91f", // 参数模板ID
    "generateParams": {
        // 基础参数
        "prompt": "The image is a portrait of a young woman with a bouquet of flowers in her hair. She is wearing a white blouse and has a happy expression on her face. The flowers are pink and white daisies with green leaves and stems. The background is a light blue color. The overall mood of the image is dreamy and ethereal.", // 选填
        "steps": 25, // 采样步数
        "width": 768, // 宽
        "height": 1024, // 高
        "imgCount": 1, // 图片数量    
        
        // 风格参考的相关配置
        "controlNet": [
            {
                "unitOrder": 0,
                "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/a9cf89f2d4bec50d81feb021dd25c505865fbc7b19a3979d76773fcf1f581dee.png",
                "width": 1024,
                "height": 1024,
                "preprocessor": 66,
                "annotationParameters": {
                    "ipAdapterSiglip": {
                        "preprocessorResolution": 1024                                
                    }
                },
                "model": "c6ed70879cf011ef96d600163e37ec70",
                "controlWeight": 0.75, // 控制权重推荐取0.6 ~ 0.75之间
                "startingControlStep": 0,
                "endingControlStep": 1,
                "pixelPerfect": 1,
                "controlMode": 0,
                "resizeMode": 1
            }
        ]
    }
}
4. 模型选择
为了确保API服务的生图速度快速且稳定，生图效果有保障，平台精选了各方向下的高质量模型，仅做参考。
全网可商用模型和自有模型皆可调用，详见文档3.1.1。
4.1 Checkpoint
适用方向
基础算法类型
模型名称
模型版本
模型链接
模型版本UUID
效果参考
通用
基础算法 F.1
F.1基础算法模型-哩布在线可运行

F.1-dev-fp8

https://www.liblib.art/modelinfo/488cd9d58cd4421b9e8000373d7da123
412b427ddb674b4dbab9e5abd5ae6057

[图片]
通用
基础算法 XL

Dream Tech XL | 筑梦工业XL
v6.0 - 寄语星河
https://www.liblib.art/modelinfo/5611e2f826be47f5b8c7eae45ed5434a

0ea388c7eb854be3ba3c6f65aac6bfd3

[图片]
通用
基础算法 XL

Dream Tech XL | 筑梦工业XL
v5.0 - 与光同尘
https://www.liblib.art/modelinfo/5611e2f826be47f5b8c7eae45ed5434a
a57911b5dfe64c6aa78821be99367276

[图片]
人像摄影
基础算法 XL
AWPortrait XL
1.1
https://www.liblib.art/modelinfo/f8b990b20cb943e3aa0e96f34099d794
21df5d84cca74f7a885ba672b5a80d19
[图片]
现代创意插画
基础算法 1.5

ComicTrainee丨动漫插画模型

v2.0
https://www.liblib.art/modelinfo/d6053875cca7478a8ab39522b4e7cc1a
c291e0d339f44a98a973f138e6b0b9dc
[图片]
现代创意插画
基础算法 XL
niji-动漫二次元-sdxl
2
https://www.liblib.art/modelinfo/3ecd30364b564a7cadbf4f7f7e7110cf
bd065cff3a854af2b28659ed0f6d289d
[图片]
现代创意插画
基础算法 XL
Neta Art XL 二次元角色 （更新V2）
V2.0
https://www.liblib.art/modelinfo/55b06e35dd724862b3524ff00b069fe8
bfb95ad44a2c4d88963d3147de547600
[图片]
视觉海报
基础算法 XL
真境写真XL Elite KV | 电商产品摄影海报视觉设计
VisionX 万物绘
https://www.liblib.art/modelinfo/75656a71d6c3448cb621d03f67198f6b
dfe59b044783487e8fb0800fc4e8ccc3
[图片]
建筑设计
基础算法 1.5
城市设计大模型 | UrbanDesign
v7
https://www.liblib.art/modelinfo/5e1b4ea7f9554e46b2509f59269b1ea8
f40405b7404a455db689a6646a75c103
[图片]
建筑设计
基础算法 XL
比鲁斯大型建筑大模型
XL0.35_PRO
https://www.liblib.art/modelinfo/a7177a52c3e74e04a65aff5bab87d01a
d3bfdeba43bc4b5ca44e35d9fcd2f487
[图片]
4.2 LoRA
适用方向
基础算法类型
模型名称
模型版本名称
触发词
模型链接
模型版本UUID
效果参考
人像摄影
基础算法 F.1
Filmfotos_日系胶片写真

FLUX

filmfotos,film grain,reversal film photography

https://www.liblib.art/modelinfo/ec983ff3497d46ea977dbfcd1d989f67
b59f7eb734864a74ba476af3aa28c2f3

[图片]
人像摄影
基础算法F.1
极氪白白酱F.1-人像V6MAX

V6MAX
JKBB
https://www.liblib.art/modelinfo/922d83dbec8e4b4b9033851f0038ae90?from=feed&versionUuid=169505112cee468b95d5e4a5db0e5669
169505112cee468b95d5e4a5db0e5669
[图片]
电商场景
基础算法 F.1
电商-F.1- | 运营启动页
v1.0
yun
https://www.liblib.art/modelinfo/033c3ddf8c6f4baba02b2d149ca8310b
76af914cc3434937aa13aeb038aae838
[图片]
视觉海报
基础算法 F.1
UNIT-F.1-MandelaEffect-LoRA

曼德拉效应

/

https://www.liblib.art/modelinfo/02b89792af674243b46db46349393c02
50284151e507431facc2325cd62f73a3
[图片]
创意插画
基础算法 F.1
万物调节丨Flux 情绪插画

V1.0
Simple vector illustration
https://www.liblib.art/modelinfo/6256d14b3a5545cba79f6ca84ab04491?from=feed&versionUuid=be3909c5d7114d3b8717e966c884d3e1
be3909c5d7114d3b8717e966c884d3e1
[图片]
创意插画
基础算法 F.1
嘉嘉_国潮插画_F.1
v1.0
/
https://www.liblib.art/modelinfo/2b4cb7c1799e4f73a00535dc71af73fc
b1d4b896d69d408b815b545126a92df0

[图片]
创意插画
基础算法 F.1
风月无边illustrations
v1.0
/
https://www.liblib.art/modelinfo/b275bf18078b41b38e3dbc40d5b3fead
85a2a6bd4dd945a78f6430c9c4911cf0
[图片]
创意插画
基础算法 F.1
岩彩材质绘画
v1
mineral
https://www.liblib.art/modelinfo/dcd294b15ee0445ebb1917ec011e9f37
46d4086b1a60448dbbeea52e1218bb8b
[图片]
视觉海报
基础算法 XL
筑梦工业 | 海报美学XL
v1.0
Movie Poster Style
https://www.liblib.art/modelinfo/7bcd8a2e75bf4962baaadca9cd01e982
31360f2f031b4ff6b589412a52713fcf

[图片]
扁平插画
基础算法 XL
CJ_illustration丨商业扁平插画XL
v1.0
Illustration
https://www.liblib.art/modelinfo/d6e507424dcd4c728e587db7ddfb9c41
1fe2174f51d04fedb724b28f48d55b7a
[图片]
扁平插画
基础算法 1.5
CJ_illustration丨商业扁平插画

v1.3
Illustration
https://www.liblib.art/modelinfo/760bc28e05b2422fb5b059c18579497b
82f1db0f9fbd4c4b85137e6a4e6bba6d
[图片]
电商场景
基础算法 XL
筑梦工业 | 电商场景-银河系漫游指南XL
v1.0
Creative Showcase
https://www.liblib.art/modelinfo/efeea73d36b541ceaf31a625370d5595
098f08f604ec4c6c9b4ecf9167d39e63
[图片]
电商场景
基础算法 XL
电商-超现实主义v2
超现实主义v2
changjingA
https://www.liblib.art/modelinfo/e332caf6720143ab998235489e270de9
7ba01e531f424ca3b86b4bf00e3abd10
[图片]
电商场景
基础算法 XL
VisionX 万物绘 | 工业产品设计 | 电商产品摄影 
万物绘LORA_V1
/
https://www.liblib.art/modelinfo/b8d0784d423e4c33b7402b28ee2a5b9b
de0db8bac1844d078e1782bd01a64f35
[图片]
电商产品
基础算法 XL
【摸鱼】商业写实渲染 | 电商产品场景 
V1
/
https://www.liblib.art/modelinfo/b76df870c8d2437bb96c039a13539f53
b50b9cce2147400cb161d9be5d4adb6e
[图片]
电商产品
基础算法 XL
【油条】商业产品大片PRO-XL版 
无限创作XL-v1
Realistic product commercial blockbuster
https://www.liblib.art/modelinfo/fbc202e8c7d242c581421c171adedcac
f1119d1dc33a46b8b460dd29ef6dabd2
[图片]
电商产品
基础算法 1.5
产品摄影，北欧极简高质感
1.0
dofas
https://www.liblib.art/modelinfo/85dd9bc4ed6d42f3b9b9a2e89c3281f6
f465b7ed06244afa96f5560a5890bad2
[图片]
logo&icon设计
基础算法 XL
字体logo材质效果-lora-XL-expert
V1.0
CZG, Fluid texture
https://www.liblib.art/modelinfo/8bdabec4b7f44b69954af770744b521b
bbc080acca124995b3dfbd26e56bb278
[图片]
毛绒风
基础算法 XL
WDR_毛绒质感ICON
1.0
a plush app icon
https://www.liblib.art/modelinfo/a442656707b14560aaebce87620e39dd
3dc63c4fe3df4147ac8a875db3621e9f
[图片]
毛毡风
基础算法 1.5
微缩毛毡风格 | Miniature Felt Style
V1.0
Microphotography,Felt style
https://www.liblib.art/modelinfo/177c72eca76248efa63ab97118ce4c93

f3134ad192a14ea6a7c361e04cb74aea
[图片]
蒸汽朋克
基础算法 XL
筑梦工业 | 蒸汽朋克XL
v1.0
SP style,Steampunk aesthetic
https://www.liblib.art/modelinfo/a306e642e11d482983aff1591f85c5d9
0ad44fc3ca564bba864c82a36f3a8f65
[图片]
经典艺术插画
基础算法 1.5
波普艺术_SD 1.5
v1.0
BoPu
https://www.liblib.art/modelinfo/94625fe77493410285701ae8c0a9162a
3b069d49839d4b38b067481ff847fbd8
[图片]
现代创意插画
基础算法 1.5
白泽MARS-治愈系插画
S1.0
/
https://www.liblib.art/modelinfo/56b1c778a22a4fba8481aa18be2c7795
1e20fa53df254ff8a0eeee26230952c3
[图片]
现代创意插画
基础算法 1.5
小清新治愈画风插画
v2.0
/
https://www.liblib.art/modelinfo/4e1d69769c3a499fbbda7bdbd5c775e1
21b92b68ea9142cba052aaee9a2f5410
[图片]
现代创意插画
基础算法 XL
HandDrawing l 卡通手绘-SDXL

v1.0
Cartoon Chinese style
https://www.liblib.art/modelinfo/5c1be02d031d4b3498d47e1e9b504edb
5aad2800df224473acbd27d92aea3f3f
[图片]
现代创意插画
基础算法 XL
筑梦工业 | 风格漫画XL
v1.0
Dream Comic Style
https://www.liblib.art/modelinfo/1993afa92c9443f0b07e84926f2cb773
7aa06b226feb46f485a6793a8d5a5184
[图片]
现代创意插画
基础算法 1.5
Dissney Fable 迪士尼风格插画丨CJ_3D
v1.0
3D
https://www.liblib.art/modelinfo/54af7361461a491ab5c0c03e5c64fb56
9719136dcf26415a8f756ba6cc0946ac
[图片]
现代创意插画
基础算法  XL
99art·治愈系绘本插画壁纸·小笔触
1.0

/
https://www.liblib.art/modelinfo/28471841ac0645e890f92fdd4efeacd5
ba5e04de8f2d4f8a8e8d6e9bfe93a9b4
[图片]
中国风插画
基础算法 XL
Muertu XL丨国风绘本插图画风加强
v1.0
guofeng
https://www.liblib.art/modelinfo/407d4f5126e24e7c84e75b7679e76516
2bc8ff1e8bc847008fd40e40efcdd096
[图片]
中国风插画
基础算法 XL
筑梦工业 | 新派国画水墨XL
v1.0
New Chinese Art Style
https://www.liblib.art/modelinfo/0f7c3c7c374344d88d802b120d548a04
c8d2fcf503d04c10af770bd48145ba30

[图片]
细节优化
基础算法 1.5
极致肤感 | 提升皮肤纹理质感
v-001
/

https://www.liblib.art/modelinfo/6e5e77d53efe414eb675409d5c834b07
6da50214cd4743d4b1ce819411594bbe
[图片]
对比度调节
基础算法 1.5
光泽调节器/Gloss_Tweaker/光沢調整器
v2.0
/

https://www.liblib.art/modelinfo/b11668631ddf4b28a3967e84b33e15f2
d8d47c33f5e34588a1595c8e9bea0d7a
[图片]
手部优化
基础算法 1.5
万物调节丨手部修复2.0
V2.0
perfect hands, delicate hands
https://www.liblib.art/modelinfo/89f67e2790314a1db744b5a1d0ad4d15
365e700254dd40bbb90d5e78c152ec7f
[图片]

4.3 Textual Inversion负向提示词
适用方向
模型名称
模型链接
Trigger word
负向提示词 - 通用型提升画面质量
坏图修复EasyNegative
https://www.liblib.art/modelinfo/458a14b2267d32c4dde4c186f4724364
easynegative,EasyNegative_EasyNegative,EasyNegative
负向提示词 - 通用型提升画面质量
坏图修复DeepNegativeV1.x
https://www.liblib.art/modelinfo/03bae325c623ca55c70db828c5e9ef6c
ng_deepnegative_v1_75t,DeepNegativeV1.x_V175T

负向提示词 - 防止手部崩坏
badhandv4-AnimeIllustDiffusion
https://www.liblib.art/modelinfo/9720584f1c3108640eab0994f9a7b678
badhandv4,badhandv4-AnimeIllustDiffusion_badhandv4
负向提示词 - 通用型提升画面质量
坏图修复veryBadImageNegative
https://www.liblib.art/modelinfo/cbaa93b1001c969c99b6b91a201686ad
verybadimagenegative_v1.3,veryBadImageNegative_veryBadImageNegative_v1.3
负向提示词 - 防止手部崩坏
坏手修复negative_hand Negative Embedding 
https://www.liblib.art/modelinfo/388589a91619d4be3ce0a0d970d4318b
negative_hand
负向提示词 - 防止手部崩坏
Bad-Hands-5
https://www.liblib.art/modelinfo/eafbd93338474dcea0d7432b6229dea9
bad-hands-5,BadHandsV5
负向提示词 - 通用型提升画面质量
EasyNegativeV2
https://www.liblib.art/modelinfo/1bfae4494f3549ce8125021f3f9307ae
EasyNegativeV2
负向提示词 - 动漫类提升画面质量
坏图修复bad-picturenegativeembeddingforChilloutMix
https://www.liblib.art/modelinfo/bc840f95f5f88d8f5bd3d2598616ca56
bad-picture-chill-75v,bad-picturenegativeembeddingforChilloutMix_75VectorVersion
负向提示词 - 通用型提升画面质量
FastNegativeV2
https://www.liblib.art/modelinfo/5c10feaad1994bf2ae2ea1332bc6ac35
FastNegativeV2
负向提示词 - 动漫类提升画面质量
bad-artist-anime
https://www.liblib.art/modelinfo/f0377e81350e49a98b40a57865070de4
bad-artist-anime
负向提示词 - 通用型提升画面质量
bad_prompt Negative Embedding
https://www.liblib.art/modelinfo/a84f2a2bcc38445482d095594873e118
bad_prompt_version2,bad_prompt_version2-neg

负向提示词 - 通用型提升画面质量
美女BadDream + UnrealisticDream (Negative Embeddings)
https://www.liblib.art/modelinfo/5ca778dac416e05b0bd0e98a0f4b82db
BadDream
4.4 VAE
基础算法类型
模型版本名称
模型版本UUID
通用
Automatic
传空值
基础算法 1.5
vae-ft-mse-840000-ema-pruned.safetensors
2c1a337416e029dd65ab58784e8a4763
基础算法 1.5
klF8Anime2VAE_klF8Anime2VAE.ckpt
d4a03b32d8d59552194a9453297180c1
基础算法 1.5
color101VAE_v1.pt
d9be20ad5a7195ff0d97925e5afc7912
基础算法 1.5
cute vae.safetensors
88ae7501f5194e691a1dc32d6f7c6f1a
基础算法 1.5
ClearVAE_V2.3.safetensors
73f6e055eade7a85bda2856421d786fe
基础算法 1.5
difconsistencyRAWVAE_v10.pt
5e93d0d2a64143a9d28988e75f28cb29
基础算法 XL
sd_xl_vae_1.0
3cefd3e4af2b8effb230b960da41a980
4.5 采样方法
采样方法名称
枚举值
推荐度
Euler a
0
⭐⭐⭐⭐⭐
Euler
1
⭐⭐⭐
LMS
2
⭐⭐⭐
HEUN
3
⭐⭐⭐
DPM2
4
⭐⭐⭐
DPM2 a
5
⭐⭐⭐
DPM++ 2S a
6
⭐⭐⭐
DPM++ 2M
7
⭐⭐⭐
DPM++ SDE
8
⭐⭐⭐
DPM++ FAST
9
⭐⭐⭐
DPM++ Adaptive
10
⭐⭐⭐⭐
LMS Karras
11
⭐⭐⭐
DPM2 Karras
12
⭐⭐⭐
DPM2 a Karras
13
⭐⭐⭐
DPM++ 2S a
14
⭐⭐⭐
DPM++ 2M Karras
15
⭐⭐⭐⭐⭐
DPM++ SDE Karras
16
⭐⭐⭐⭐⭐
DDIM
17
⭐⭐⭐
PLMS
18
⭐⭐⭐
UNIPC
19
⭐⭐⭐
DPM++ 2M SDE Karras
20
⭐⭐⭐⭐⭐
DPM++ 2M SDE EXPONENTIAL
21
⭐⭐⭐⭐
DPM++ 2M SDE Heun Karras
24
⭐⭐⭐
DPM++ 2M SDE Heun Exponential
25
⭐⭐⭐
DPM++ 3M SDE Karras
27
⭐⭐⭐⭐
DPM++ 3M SDE Exponential
28
⭐⭐⭐⭐
Restart
29
⭐⭐⭐
LCM
30
⭐⭐⭐
4.6 放大算法模型
模型名称
模型枚举值
原理简介
适用方向
缺点
推荐度
Latent
0
传统放大
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐⭐
Latent (antialiased)
1
在 Latent 的基础上增加了抗锯齿处理，适合需要平滑边缘的图像。
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐
Latent (bicubic)
2
使用双三次插值算法，适合需要较高质量放大的图像。
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐
Latent (bicubic antialiased)
3
结合双三次插值和抗锯齿，适合高质量且平滑的图像放大。
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐
Latent (nearest)
4
使用最近邻插值，速度快但质量较低，适合简单图形。
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐
Latent (nearest-exact)
5
使用精确的最近邻插值算法，适合需要保留原始像素的图像。
低分辨率图像的适度放大，对原图保留度高
Latent系列普遍细节恢复能力弱，可能出现锯齿状边缘。使用Latent放大时，建议重绘幅度 > 0.5，否则图像可能是模糊的。
⭐⭐
Lanczos
6
一种高质量的插值算法，适合需要高保真度的图像放大，尤其在细节丰富的图像中表现良好。
高细节图像（如风景、建筑）的放大，能够很好地保留图像细节和清晰度。
对原图质量要求较高，处理速度可能较慢。这种算法适用于升级分辨率较低的图像、文档或照片，以获得更高质量、更清晰的图像。对原图没有任何优化，仅仅只是放大像素
⭐⭐⭐

Nearest
7
最近邻插值，简单快速，适合低质量图像放大，通常用于图形和图标。
这种算法通常适用于对速度需求较高而不需要过多细节的场景下。适合低清晰度图像的放大。
可能会造成图像边缘模糊、细节丢失或图像瑕疵等。
⭐⭐⭐
ESRGAN_4x
8
基于增强型超分辨率生成对抗网络，适合高质量图像放大，尤其在细节和纹理复原方面表现突出。
GAN系列普遍能够有效恢复图像中的细节，适合图像细节的补充。
计算复杂度高，处理速度较慢。
⭐⭐⭐⭐
LDSR
9
基于深度学习的超分辨率算法，适合需要处理复杂细节的图像。
能够有效恢复细节和纹理，生成的图像通常质量较高。适用于对 CT、MRI 等医学图像进行重建和处理
计算复杂度高，处理速度较慢。
⭐⭐⭐
R-ESRGAN_4x+
10
改进版的 ESRGAN，适合高质量放大，特别是在图像细节和清晰度方面。
主要用于增强细节和保留更多纹理信息，对写实的图片和照片最合适，比较全能。
动漫场景会略逊一筹
⭐⭐⭐⭐⭐
R-ESRGAN_4x+ Anime6B
11
针对动漫图像优化的 R-ESRGAN，适合动漫风格的图像放大。
专门针对动漫风格优化，能保持色彩鲜艳和边缘清晰。
可能对现实图像效果不佳。
⭐⭐⭐⭐⭐
ScuNET GAN
12
ScuNET GAN 是基于生成对抗网络的超分辨率方法
适用于对比较复杂、高精度的图像超分辨率场景
在处理复杂纹理或图案时，可能影响最终图像的真实感。
⭐⭐⭐
ScuNET PSNR
13
相较于ScuNET GAN，PSNR 版本则更注重图像质量。
在自然、艺术、人像等需要保持色彩的鲜艳度和细节完整性的领域表现突出。
在处理复杂纹理或图案时，可能影响最终图像的真实感。
⭐⭐⭐
SwinIR_4x
14
基于 Swin Transformer 的超分辨率方法，适合复杂场景的图像放大。
适合低清晰度图片的增强，以及高细节图像（如风景、建筑）的放大，能够很好地保留图像细节和清晰度，适用于厚涂插画。
可能会过度增强，生成伪影，影响图像的真实感和视觉质量。
⭐⭐⭐
4x-UltraSharp
15
专注于图像锐化的超分辨率算法，适合需要增强边缘和细节的图像。
适合增强图像边缘和细节。
对原图质量要求较高，不适合低清图片的放大。
⭐⭐⭐⭐⭐
8x-NMKD-Superscale
16
该算法专注于高倍放大（8倍），可以有效提升图像分辨率。
采用深度学习技术来增强图像细节和纹理，能够处理复杂的图像内容。
高倍放大算法，适合需要极高分辨率的图像。拥有了更真实的处理细节，不仅仅只追求把人物还原得光滑好看，它还增加了很多噪点和毛孔细节，让人物看起来更加真实可信，并且因为训练集中含有大量的胶片摄影素材，因此很适合真实人像的放大。色调相对偏冷一些。

对原图质量要求较高，不适合低清图片的放大。

⭐⭐⭐⭐⭐
4x_NMKD-Siax_200k
17
该算法为4倍放大，基于特定的数据集（200k）进行训练，优化了在该数据集上的表现。
侧重于图像的细节恢复，尤其在处理低质量图像时表现良好。
适合于需要中等放大的图像，尤其是那些在特定领域（如医学图像、卫星图像）中应用。
对原图质量要求较高，不适合低清图片的放大。
⭐⭐⭐⭐
4x_NMKD-Superscale-SP_178000_G
18
同样为4倍放大，基于不同的数据集（178000）进行训练，具有不同的优化目标。
可能在特定类型的图像上表现更好，尤其是在处理特定风格或特征的图像时。
适合对图像质量有较高要求的应用，特别是在需要保持图像特征的情况下。
对原图质量要求较高，不适合低清图片的放大。

⭐⭐⭐⭐
4x-AnimeSharp
19
针对动漫图像的锐化和放大算法，适合动漫风格图像。
专门针对动漫风格优化，能保持色彩鲜艳和边缘清晰。
可能对现实图像效果不佳。
⭐⭐⭐⭐⭐
4x_foolhardy_Remacri
20
强调细节恢复的放大算法，适合需要高细节保留的图像。
强调细节恢复，能改善模糊效果。
处理时间较长，且效果依赖于原始图像质量。
⭐⭐⭐
BSRGAN
21
基于对抗学习的超分辨率方法，适合高质量图像放大。
能够有效恢复压缩图像中的细节。
对原图质量要求较高，不适合低清图片的放大。
⭐⭐⭐
DAT 2
22
主要用于图像解压和放大，适合需要处理压缩图像的场景。DAT2, DAT3和DAT4是基于不同版本的深度学习超分辨率算法，通常针对不同的应用场景和数据集进行优化。
强调细节恢复，能改善模糊效果。DAT2的放大质量是3款中最佳的。
处理时间较长，且效果依赖于原始图像质量。
⭐⭐⭐⭐⭐
DAT 3
23
主要用于图像解压和放大，适合需要处理压缩图像的场景。
强调细节恢复，能改善模糊效果。
处理时间较长，且效果依赖于原始图像质量。
⭐⭐⭐
DAT 4
24
主要用于图像解压和放大，适合需要处理压缩图像的场景。
强调细节恢复，能改善模糊效果。DAT4是3款中最快的。
处理时间较长，且效果依赖于原始图像质量。
⭐⭐⭐
4x-DeCompress
25
主要用于图像解压和放大，适合需要处理压缩图像的场景。
适合材质效果的增强
对原图质量要求较高，不适合低清图片的放大。
⭐⭐⭐⭐
4x-DeCompress Strong
26
主要用于图像解压和放大，适合需要处理压缩图像的场景。
适合材质效果的增强
对原图质量要求较高，不适合低清图片的放大。
⭐⭐⭐⭐⭐
5. ComfyUI工作流
5.1 ComfyUI工作流生图
- 接口：POST  https://openapi.liblibai.cloud/api/generate/comfyui/app
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
说明
备注
templateUuid
string
否
默认模版：4df2efa0f18d46dc9758803e478eb51c

generateParams
object
是
生图参数，json结构
前端自动创建该工作流版本的API参数示例
1. 目前Lib已开放全站的可商用、可在线运行工作流供API使用，您可以在Lib站内工作流合集检索，https://www.liblib.art/workflows
[图片]
2. 在工作流的详情页会出现【本工作流已提供API服务】，且可查看API相关参数。（详情页未出现API参数的工作流，暂不支持API调用）
[图片]
[图片]
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
- 参数示例
request_body ={
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "12": {
            "class_type": "LoadImage",
            "inputs": {
                "image": "https://liblibai-tmp-image.liblib.cloud/img/baf2e419ce1cb06812314957efd2e067/af0c523d3d2b4092ab45c64c72e4deb76babb12e9b8a178eb524143c3b71bf85.png"
            }
        },
        "112": {
            "class_type": "ImageScale",
            "inputs": {
                "width": 768
            }
        },
        "136": {
            "class_type": "RepeatLatentBatch",
            "inputs": {
                "amount": 4
            }
        },
        "137": {
            "class_type": "LatentUpscaleBy",
            "inputs": {
                "scale_by": 1.5
            }
        },
        "workflowUuid": "2f22ab7ce4c044afb6d5eee2e61547f3"
    }
}
- 参数说明示例（仅少量节点）
节点ID
节点类型
节点名称
参数项
参数名称
参数说明
80

LoadImage

风格图像

image
图像

{
    "parentId": 80,
    "id": "image",
    "name": "image",
    "displayName": "图像",
    "type": "IMAGE",
    "defaultValue": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/aa1a1459986e5cc2b1236f7dc43a029119d6fe6ac26f1961a6639d21ca0b0bbe.png",
    "image_upload": true,
    "isMaskImage": false
}
79
ApplyIPAdapterFlux
风格设置

weight
风格强度

{
    "parentId": 79
    "id": "weight",
    "name": "weight",
    "displayName": "风格强度",
    "type": "FLOAT",
    "defaultValue": 0.75,
    "min": -1,
    "max": 5,
    "step": 0.05    
}
76

SeargePromptCombiner
请描述要绘制的画面

prompt1
画面描述

{
    "parentId": 76,
    "id": "prompt1",
    "name": "prompt1",
    "displayName": "画面描述",
    "type": "STRING",
    "defaultValue": "Anime art, low angle shot back view silhouette of a boy standing on a building rooftop next to a telescope at night, looking up towards the glowing milky way and shooting stars in the starry night, gradient blue orange and pink night sky, dim lighting, dark lighting, highly detailed, ultra-high resolutions, 32K UHD, best quality, masterpiece\n",
},

5.2 查询生图结果
- 接口：POST  https://openapi.liblibai.cloud/api/generate/comfy/status
- headers：
header
value
备注
Content-Type
application/json

- 请求body：
参数
类型
是否必需
备注
generateUuid
string
是
生图任务uuid，发起生图任务时返回该字段
- 返回值：
参数
类型
备注
generateUuid
string
生图任务uuid，使用该uuid查询生图进度
generateStatus
int
生图任务的执行状态：
- 1：等待执行
- 2：执行中
- 3：已生图
- 4：审核中
- 5：任务成功
- 6：任务失败
percentCompleted
float
生图进度，0到1之间的浮点数，（暂未实现）
generateMsg
string
生图信息，提供附加信息，如生图失败信息
pointsCost
int
本次生图任务消耗积分数
accountBalance
int
账户剩余积分数
images
[]object
图片列表，只提供审核通过的图片
images.0.imageUrl
string
图片地址，可直接访问，地址有时效性：7天
images.0.seed
int
随机种子值
iamges.0.auditStatus
int
审核状态：
- 1：待审核
- 2：审核中
- 3：审核通过
- 4：审核拦截
- 5：审核失败
videos
[]object
图片列表，只提供审核通过的图片
videos.0.videoUrl
string
视频列表，只提供审核通过的视频
videos.0.coverPath
string
视频地址，可直接访问，地址有时效性：7天
videos.0.nodeId
string
输出视频的节点ID（可忽略）
videos.0.outputName
string
输出视频的节点名称
videos.0.auditStatus
int
审核状态：
- 1：待审核
- 2：审核中
- 3：审核通过
- 4：审核拦截
- 5：审核失败
示例：
{
        "code": 0,
        "data": {
                "accountBalance": 91111,
                "generateStatus": 5,
                "generateUuid": "a996794faff8424a8ff56acb421e7305",
                "images": [
                        {
                                "auditStatus": 3,
                                "imageUrl": "https://liblibai-tmp-image.liblib.cloud/img/360643a3d8414af8b99664b208bc9302/35801ecbf6e6ea8ad89c2606b68d30dfc9579713f5d917694d1616c57afe82fb.png",
                                "nodeId": "91",
                                "outputName": "SaveImage"
                        }
                ],
                "percentCompleted": 1,
                "pointsCost": 10,
                "videos": []
        },
        "msg": ""
}}

5.3 部分工作流推荐
全量请至https://www.liblib.art/workflows挑选。
使用以下工作流时，只有inputs中的参数是需要自定义的，其他部分请不要动。
功能方向
链接
API参数
标准版_按分辨率缩放
比较推荐，很快
https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal_page&versionUuid=fa2e042e32fa4aabbbacc255b4ab2cca
{
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "workflowUuid": "fa2e042e32fa4aabbbacc255b4ab2cca",
        "30":
        {
            "class_type": "LoadImage",
            "inputs":
            {
                "image": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/5fae2d9099c208487bc97867bece2bf3d904068e307c7bd30c646c9f3059af33.png"
            }
        },
        "31":
        {
            "class_type": "ImageScale",
            "inputs":
            {
                "width": 2048,
                "height": 2048
            }
        }
    }
}
标准版_按系数放大

https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal_page&versionUuid=9a1c74ae498640c28e4269958b1a1b15
{
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "workflowUuid": "9a1c74ae498640c28e4269958b1a1b15",
        "30":
        {
            "class_type": "LoadImage",
            "inputs":
            {
                "image": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/5fae2d9099c208487bc97867bece2bf3d904068e307c7bd30c646c9f3059af33.png"
            }
        },
        "37":
        {
            "class_type": "CR Upscale Image",
            "inputs":
            {
                "upscale_model": "ESRGAN_4x",
                "rescale_factor": 2
            }
        }
    }
}
SD放大
https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal_page&versionUuid=b2c5e10ee73d4cf69a0e51cb1cbc1622
{
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "workflowUuid": "b2c5e10ee73d4cf69a0e51cb1cbc1622",
        "30":
        {
            "class_type": "UltimateSDUpscale",
            "inputs":
            {
                "upscale_by": 2,
                "steps": 30
            }
        },
        "40":
        {
            "class_type": "LoadImage",
            "inputs":
            {
                "image": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/5fae2d9099c208487bc97867bece2bf3d904068e307c7bd30c646c9f3059af33.png"
            }
        },
        "41":
        {
            "class_type": "UpscaleModelLoader",
            "inputs":
            {
                "model_name": "ESRGAN_4x"
            }
        }       
    }
}
图像外扩
https://www.liblib.art/modelinfo/ef740b8a4f384db48fcf9f208372493a?from=personal_page&versionUuid=99fa146a003743bdb676179fa2e546ca
{
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "workflowUuid": "99fa146a003743bdb676179fa2e546ca",
        "17":
        {
            "class_type": "LoadImage",
            "inputs":
            {
                "image": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/ed68325cbfcf4b8f724b6b5aa5914e7d91358c3bbf81fccd5002950a2f8180df.png"
            }
        },
        "23":
        {
            "class_type": "CLIPTextEncode",
            "inputs":
            {
                "text": "beautiful scenery"
            }
        },
        "44":
        {
            "class_type": "ImagePadForOutpaint",
            "inputs":
            {
                "left": 400,
                "top": 400,
                "right": 400,
                "bottom": 400,
                "feathering": 24
            }
        }   
    }
}

5.4 个人工作流调用方法
5.4.1 发布本地工作流
个人本地搭建的ComfyUI工作流，需要先在LiblibAI主页右上方发布至平台，可按需选择【自见】，必须选【生成图片可出售或用于商业目的】。
[图片]
[图片]
[图片]

5.4.2 编辑工作流
编辑方法，详见：LiblibAI--AI应用指南
节点适配范围和调整方式详见：ComfyUI FAQ
若仍有必需使用的节点，可联系商务：17521599324，电话微信同。
成功编辑好的工作流，会出现“运行应用”的button；若未出现，将无法调用API。
[图片]

5.4.3 发布工作流
我们需要约30秒-20分钟，自动试跑该工作流，试跑完成后，该工作流的详情页将会出现API调用参数，可完成API支持调用。
[图片]

5.5 工作流调用费用
每个工作流不同，消耗积分数可以参考API参数详情页左方试跑示范。
[图片]

6. 生图示例完整demo
我们提供了以下Python脚本用于参考，演示了从发起生图任务到查询生图结果的调用流程，提供了以下接口的使用：
1.  星流Star-3 Alpha文生图
2.  星流Star-3 Alpha图生图
3.  LiblibAI自定义模型文生图
4.  LiblibAI自定义模型图生图
5. 查询生图结果

- 文生图示例：（含Star-3 Alpha和自定义模型）
暂时无法在飞书文档外展示此内容
- 图生图示例：（含简易模式和进阶模式）
暂时无法在飞书文档外展示此内容

7. 错误码汇总
错误码
错误信息
备注
401
签名验证失败
/
403
访问拒绝
访问拒绝场景包括：
1. 用户没有开通API商业化权益
2. 账户积分不足
3. 用户当前购买的会员等级无权限执行此操作
429
请求太多，请稍后重试
QPS超限，发起生图任务接口QPS限制1秒1次
100000
参数无效
通用参数校验失败
100010
AccessKey过期
API商业化权益已过期
100020
用户不存在
/
100021
用户积分不足
/
100030
图片地址无法访问，或大小超出限制
目前图片大小不能大于10M
100031
图片包含违规内容
图片地址无效、无法下载或图片过大
100032
图片下载失败
/
100050
生图参数未通过参数完整度校验，请检查参数配置
检查模板和checkpoint和lora的匹配关系
100051
生图任务不存在
/
100052
提示词中包含敏感内容，请修改
包括prompt、negativePrompt等提示词参数中包含敏感内容
100053
当前使用的模型不在提供的模型列表内，请检查
请从平台提供的Checkpoint、LoRA、VAE、Controlnet列表中选择
100054
当前进行中任务数量已达到并发任务上限
/
100055
生图结果中包含敏感内容，请检查参数配置
/
100120
参数模板不存在
传的模板uuid有问题，找不到对应模板
200000
内部服务错误
具体错误包括：
1. 图片上传失败
2. LiblibAI官网系统维护
200001
模型不存在

210000
调用外部服务失败，请重试


8. SDK-java
https://github.com/gravitywp/liblib-java-sdk?tab=readme-ov-file#getting-started
https://github.com/gravitywp/liblib-java-sdk/tree/main/src/main/java/cloud/liblibai/client/examples

9. 彩蛋
一些AI生图小tips，祝大家玩得愉快～一些AI生图小tips