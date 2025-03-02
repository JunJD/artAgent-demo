'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useProjects } from '@/lib/hooks/use-projects'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function Home() {
  const { projects, createNewProject, setCurrentProject } = useProjects()
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const handleCreateProject = () => {
    createNewProject('新项目', '我的创作项目')
  }
  
  // 客户端渲染保护
  if (!isMounted) {
    return null // 或者返回一个加载指示器
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 导航栏 */}
      <header className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container flex h-16 items-center px-4 mx-auto">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                ArtAgent
              </span>
            </Link>
          </div>
          <div className="flex items-center ml-auto space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/tutorial">观看教程</Link>
            </Button>
            <Button asChild onClick={() => handleCreateProject()}>
              <Link href="/flow">立即开始创作</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="pt-16">
        {/* Hero 区域 */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                ArtAgent - 智能艺术创作平台
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                利用 AI 技术，激发你的艺术灵感，创作独特作品
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/flow">立即开始创作</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/tutorial">查看教程</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
        </section>

        {/* 特性区域 */}
        <section className="py-20 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">平台特性</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">AI 驱动创作</h3>
                <p className="text-gray-600">
                  结合多种 AI 模型，让创作过程更加智能和高效
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">丰富艺术风格</h3>
                <p className="text-gray-600">
                  支持多种艺术流派，满足不同创作需求
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100">
                <div className="text-3xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold mb-2">智能艺术导师</h3>
                <p className="text-gray-600">
                  AI 辅助教学，帮助你提升艺术创作能力
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 项目展示区域 */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">我的项目</h2>
              <Button variant="outline" onClick={handleCreateProject} asChild>
                <Link href="/flow">创建新项目</Link>
              </Button>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-4">还没有创建任何项目</p>
                <Button onClick={handleCreateProject} asChild>
                  <Link href="/flow">创建第一个项目</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100 relative group">
                      {project.coverImage ? (
                        <Image 
                          src={project.coverImage} 
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          无预览图
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="secondary"
                          onClick={() => {
                            setCurrentProject(project.id)
                          }}
                          asChild
                        >
                          <Link href="/flow">查看详情</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-500">创作于 {formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
