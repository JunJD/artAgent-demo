'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState('getting-started')

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">AI 图像生成教程中心</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          学习如何使用我们的平台生成令人惊叹的 AI 艺术作品和图像
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="max-w-5xl mx-auto" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-8">
          <TabsTrigger value="getting-started">入门指南</TabsTrigger>
          <TabsTrigger value="stability-ai">Stability AI 教程</TabsTrigger>
          <TabsTrigger value="baidu-ai">百度 AI 教程</TabsTrigger>
          <TabsTrigger value="advanced">高级技巧</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>欢迎来到 AI 图像生成世界</CardTitle>
              <CardDescription>
                了解如何开始使用我们的平台创建 AI 生成的图像
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">平台概述</h3>
                  <p className="mb-4">
                    我们的平台整合了业界领先的 AI 图像生成技术，包括 Stability AI 和百度文心 AI。
                    无论您是艺术家、设计师还是普通爱好者，都能轻松创建高质量的 AI 图像。
                  </p>
                  <h3 className="text-xl font-semibold mb-2">主要功能</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>文本到图像生成</li>
                    <li>图像编辑与修改</li>
                    <li>风格迁移与混合</li>
                    <li>多语言提示支持</li>
                    <li>高分辨率输出</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M12 18v-6"></path>
                        <path d="M8 15h8"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium mb-2">开始创建您的第一个项目</h4>
                    <p className="text-sm text-muted-foreground mb-4">按照我们的分步指南快速入门</p>
                    <Link href="/flow" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                      创建项目
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快速入门指南</CardTitle>
              <CardDescription>
                4 个简单步骤开始生成 AI 图像
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "1. 创建账户",
                    description: "注册并设置您的个人资料以开始使用我们的服务。",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )
                  },
                  {
                    title: "2. 选择 AI 模型",
                    description: "选择 Stability AI 或百度 AI 作为您的图像生成引擎。",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    )
                  },
                  {
                    title: "3. 创建提示",
                    description: "使用详细的文本描述来指导 AI 生成您想要的图像。",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    )
                  },
                  {
                    title: "4. 生成与编辑",
                    description: "生成图像并根据需要调整参数以获得理想结果。",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    )
                  }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 bg-background rounded-lg border">
                    <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stability-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stability AI 图像生成教程</CardTitle>
              <CardDescription>
                学习如何使用 Stability AI 的强大功能创建高质量图像
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Stability AI 基础</h3>
                  <p className="mb-4">
                    Stability AI 提供了业界领先的图像生成技术。使用 Stable Diffusion 模型，您可以从文本描述生成高度详细和创意丰富的图像。
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>提示词编写技巧</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>使用详细的描述（&quot;一只站在雨中的红狐狸&quot;比简单的&quot;狐狸&quot;效果更好）</li>
                          <li>添加艺术风格（如&quot;油画风格&quot;、&quot;插画风格&quot;、&quot;照片写实风格&quot;）</li>
                          <li>指定照明条件（&quot;阳光明媚&quot;、&quot;月光下&quot;、&quot;霓虹灯照明&quot;）</li>
                          <li>添加细节元素（&quot;细节丰富&quot;、&quot;高分辨率&quot;、&quot;8k&quot;）</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>模型版本与特点</AccordionTrigger>
                      <AccordionContent>
                        <p>Stability AI 提供多种模型版本：</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li><strong>SD XL</strong>：最高质量，适合商业用途</li>
                          <li><strong>SD 1.5</strong>：平衡速度和质量的通用模型</li>
                          <li><strong>SD 2.1</strong>：改进的人物渲染</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>图像参数调整</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>CFG Scale</strong>：控制图像对提示的遵循程度（建议值 7-12）</li>
                          <li><strong>Steps</strong>：生成步骤数（20-30 步通常足够）</li>
                          <li><strong>Seed</strong>：控制随机性，固定种子可重现相同结果</li>
                          <li><strong>Sampler</strong>：不同采样器产生不同风格和细节</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">示例提示词与结果</h3>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3 bg-background">
                        <p className="text-sm font-medium mb-2">提示词：</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          &quot;一只狐狸站在森林中的小溪旁，日落时分，光线从树叶间穿过，形成金色光斑，照片般逼真，高细节，8k&quot;
                        </p>
                        <div className="relative h-40 bg-muted-foreground/20 rounded-md overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                            示例图像
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/flow" className="block py-2 px-4 text-center text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                    尝试 Stability AI 创作
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="baidu-ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>百度 AI 图像生成教程</CardTitle>
              <CardDescription>
                掌握百度文心 AI 绘画和创作技巧
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">百度文心 AI 介绍</h3>
                  <p className="mb-4">
                    百度文心大模型提供强大的中文 AI 绘画能力，特别适合东方风格和汉语提示词创作。支持多种风格，包括写实、动漫、国画等。
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>中文提示词技巧</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>使用四字成语增强意境（如&quot;山清水秀&quot;、&quot;云蒸霞蔚&quot;）</li>
                          <li>添加中国传统艺术风格（如&quot;国画风&quot;、&quot;水墨画&quot;、&quot;青花瓷风格&quot;）</li>
                          <li>指定具体中国元素（如&quot;青龙&quot;、&quot;牡丹&quot;、&quot;亭台楼阁&quot;）</li>
                          <li>使用诗词意境（&quot;小桥流水人家&quot;、&quot;飞流直下三千尺&quot;）</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>文心 AI 特色功能</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>风格多样化</strong>：支持写实、动漫、油画、水彩等多种风格</li>
                          <li><strong>东方元素优化</strong>：对中国传统元素理解更准确</li>
                          <li><strong>人物生成</strong>：特别擅长生成亚洲面孔人物</li>
                          <li><strong>场景构建</strong>：能准确理解中文环境描述</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>参数控制方法</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>画质设置</strong>：选择标准或高清质量输出</li>
                          <li><strong>风格权重</strong>：调整文本对图像风格的影响程度</li>
                          <li><strong>分辨率</strong>：支持多种比例和分辨率选择</li>
                          <li><strong>负面提示</strong>：指定不希望出现在图像中的元素</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">示例提示词与结果</h3>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3 bg-background">
                        <p className="text-sm font-medium mb-2">提示词：</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          &quot;江南水乡，小桥流水人家，烟雨朦胧，粉墙黛瓦，远处有山峦起伏，水墨国画风格，高清细节&quot;
                        </p>
                        <div className="relative h-40 bg-muted-foreground/20 rounded-md overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                            示例图像
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/flow" className="block py-2 px-4 text-center text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                    尝试百度 AI 创作
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>高级 AI 图像生成技巧</CardTitle>
              <CardDescription>
                掌握进阶技术，创造出专业级 AI 艺术作品
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold mb-4">提示词工程高级技巧</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">权重控制</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        使用 (括号) 和 [方括号] 增加或减少特定词语的权重：
                      </p>
                      <code className="text-xs bg-muted p-2 rounded block">
                        美丽的风景，(山脉:1.2)，[城市:-0.5]，(湖泊:1.3)，4k 高清
                      </code>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">混合风格技巧</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        组合多种艺术风格创造独特效果：
                      </p>
                      <code className="text-xs bg-muted p-2 rounded block">
                        女孩肖像，(水彩风格:0.8) 与 (赛博朋克:0.6) 的混合，(梦幻:0.7)，精细细节
                      </code>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mt-6 mb-4">进阶项目创意</h3>
                  <div className="grid gap-3 grid-cols-2">
                    {[
                      {
                        title: "角色设计集",
                        description: "为游戏或故事创建一系列具有一致风格的角色"
                      },
                      {
                        title: "概念艺术场景",
                        description: "为电影或游戏创建宏伟的环境和场景设计"
                      },
                      {
                        title: "艺术风格变异",
                        description: "将同一主题以多种艺术风格呈现的系列作品"
                      },
                      {
                        title: "叙事插画集",
                        description: "创建一系列图像来讲述完整故事或情节"
                      }
                    ].map((project, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">技术深度解析</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>图像到图像技术</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm mb-3">
                          使用现有图像作为起点，允许您保留特定元素同时修改其他部分。
                        </p>
                        <ol className="list-decimal pl-5 text-sm space-y-1">
                          <li>上传参考图像</li>
                          <li>调整相似度/变化强度</li>
                          <li>添加文本描述您想更改的内容</li>
                          <li>通过蒙版选择要保留或修改的区域</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>LoRA 和自定义模型</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm mb-3">
                          LoRA (Low-Rank Adaptation) 允许使用专门训练的小型模型添加到基础模型，以提供特定风格或主题。
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>在提示中添加特定触发词</li>
                          <li>调整 LoRA 权重（0.7-1.0 范围内效果通常最佳）</li>
                          <li>可组合多个 LoRA 创造独特效果</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>批量生成与变异</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm mb-3">
                          通过批量生成和系统变异探索创意可能性：
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>使用相同提示生成多个变体</li>
                          <li>从初始结果创建变异以微调细节</li>
                          <li>使用不同随机种子探索多种可能性</li>
                          <li>创建提示模板并系统性调整变量</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">创意突破练习</h3>
                    <p className="text-sm mb-4">
                      尝试这些练习来提升您的 AI 艺术创作能力：
                    </p>
                    <ol className="list-decimal pl-5 text-sm space-y-2">
                      <li>
                        <strong>风格融合挑战</strong>：选择两种截然不同的艺术风格（如水墨画和科幻）并尝试将它们融合。
                      </li>
                      <li>
                        <strong>情绪表达</strong>：创建表达特定情绪的图像，不使用人脸或表情。
                      </li>
                      <li>
                        <strong>抽象概念可视化</strong>：尝试将抽象概念如&quot;时间&quot;、&quot;自由&quot;或&quot;和谐&quot;转化为视觉图像。
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 