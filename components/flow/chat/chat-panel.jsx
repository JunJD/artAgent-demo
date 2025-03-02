import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Trash2 } from 'lucide-react'
import { useChatStore } from '@/lib/stores/chat-store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

export function ChatPanel() {
  const messagesEndRef = useRef(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const abortControllerRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [activeChat, setActiveChat] = useState('art-advisor') // 'art-advisor' 或 'prompt-optimizer'
  
  // 添加客户端检测
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const { 
    getMessages,
    addMessage, 
    getThreadId,
    setThreadId,
    clearMessages,
    setActiveChat: setStoredActiveChat
  } = useChatStore()
  
  // 获取当前聊天类型的消息和threadId
  const messages = getMessages(activeChat)
  const threadId = getThreadId(activeChat)

  // 切换聊天类型
  const switchChatType = (type) => {
    // 如果正在流式传输，先中止请求
    if (streaming) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      setStreaming(false)
      setLoading(false)
      setCurrentResponse('')
    }
    
    setActiveChat(type)
    setStoredActiveChat(type)
  }

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentResponse])

  // 发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return
    
    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: input,
      avatar: '👤'
    }
    addMessage(activeChat, userMessage)
    
    // 清空输入框并开始加载
    setInput('')
    setLoading(true)
    setStreaming(true)
    setCurrentResponse('')
    
    try {
      // 中止之前的请求（如果有）
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // 创建新的AbortController
      abortControllerRef.current = new AbortController()
      
      // 调用流式API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages, 
            userMessage
          ].map(msg => ({
            role: msg.role,
            content: msg.content,
            threadId
          })),
          openId: 'user_' + Date.now(),
          chatType: activeChat // 传递聊天类型给API
        }),
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error('API响应错误: ' + response.status)
      }
      
      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedResponse = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        // 解码收到的数据
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            const { text, threadId: newThreadId, endTurn } = JSON.parse(line)
            
            // 保存threadId用于后续对话
            if (newThreadId && !threadId) {
              setThreadId(activeChat, newThreadId)
            }
            
            // 更新当前响应
            accumulatedResponse += text
            setCurrentResponse(accumulatedResponse)
            
            // 如果是最后一个消息，添加到消息历史
            if (endTurn) {
              setStreaming(false)
              // 明确告诉 store 保存 AI 回复
              addMessage(activeChat, {
                role: 'assistant',
                content: accumulatedResponse,
                avatar: activeChat === 'art-advisor' ? '🎨' : '✨'
              })
              break
            }
          } catch (e) {
            console.error('解析流式响应失败:', e, line)
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('获取回复失败:', error)
        setStreaming(false)
        addMessage(activeChat, {
          role: 'assistant',
          content: '抱歉，我遇到了问题，请稍后再试。',
          avatar: activeChat === 'art-advisor' ? '🎨' : '✨'
        })
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  // 清空聊天历史
  const handleClearChat = () => {
    if (streaming) {
      // 如果正在流式传输，先中止请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      setStreaming(false)
      setLoading(false)
    }
    
    // 清空当前响应和输入
    setCurrentResponse('')
    setInput('')
    
    // 清空聊天历史
    clearMessages(activeChat)
  }

  // 渲染消息内容
  const renderMessageContent = (content) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        className="prose prose-sm max-w-none break-words"
      >
        {content}
      </ReactMarkdown>
    )
  }

  // 如果是服务器端渲染，返回一个加载状态
  if (!isClient) {
    return (
      <div className="h-full flex flex-col bg-white border-l">
        <div className="p-4 border-b">
          <h3 className="font-semibold">AI助手</h3>
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  const getChatTitle = () => {
    return activeChat === 'art-advisor' 
      ? { title: '艺术导师', description: 'AI 辅助教学，帮助提升创作能力' }
      : { title: '提示词优化器', description: '帮助优化AI绘画提示词，提升生成效果' }
  }

  const { title, description } = getChatTitle()

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* 聊天头部 */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClearChat}
            title="清空聊天记录"
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        
        {/* 聊天类型切换 */}
        <div className="flex border rounded-md overflow-hidden">
          <button
            className={`flex-1 py-1.5 px-3 text-sm font-medium ${
              activeChat === 'art-advisor' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => switchChatType('art-advisor')}
          >
            艺术导师
          </button>
          <button
            className={`flex-1 py-1.5 px-3 text-sm font-medium ${
              activeChat === 'prompt-optimizer' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => switchChatType('prompt-optimizer')}
          >
            提示词优化器
          </button>
        </div>
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
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {activeChat === 'art-advisor' ? '🎨' : '✨'}
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              {currentResponse ? (
                renderMessageContent(currentResponse)
              ) : (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeChat === 'art-advisor' ? "输入问题..." : "输入你想优化的提示词..."}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}