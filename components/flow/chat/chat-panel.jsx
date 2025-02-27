import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

const suggestions = [
  "如何优化我的创作流程？",
  "推荐一些艺术风格",
  "解释下印象派的特点",
  "如何提高作品质量？"
]

const messages = [
  {
    role: 'assistant',
    content: '你好！我是你的艺术导师。让我们一起探索艺术的世界吧！有什么想学习的吗？',
    avatar: '🎨'
  },
  {
    role: 'user',
    content: '我想了解印象派',
    avatar: '👤'
  },
  {
    role: 'assistant',
    content: '印象派是19世纪后期兴起的艺术运动，特点是...',
    avatar: '🎨'
  }
]

export function ChatPanel() {
  const [input, setInput] = useState('')

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* 聊天头部 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">艺术导师</h3>
        <p className="text-sm text-gray-500">AI 辅助教学，帮助提升创作能力</p>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {message.avatar}
            </div>
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* 快捷建议 */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm font-medium mb-2">快捷指令</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-gray-50"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入问题..."
            className="flex-1"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 