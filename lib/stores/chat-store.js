import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 初始消息
const initialArtAdvisorMessages = [
  {
    role: 'assistant',
    content: '你好！我是你的艺术导师。让我们一起探索艺术的世界吧！有什么想学习的吗？',
    avatar: '🎨'
  }
]

const initialPromptOptimizerMessages = [
  {
    role: 'assistant',
    content: '你好！我是提示词优化器。请输入你想要优化的提示词，我会帮你改进使其生成更好的AI艺术作品。',
    avatar: '✨'
  }
]

// 解决服务器渲染和客户端hydration不匹配的问题
function createChatStore() {
  // 创建商店实例
  const useStore = create(
    persist(
      (set, get) => ({
        // 存储不同类型的聊天
        chats: {
          'art-advisor': {
            messages: initialArtAdvisorMessages,
            threadId: null
          },
          'prompt-optimizer': {
            messages: initialPromptOptimizerMessages,
            threadId: null
          }
        },
        activeChat: 'art-advisor', // 当前活跃的聊天类型
        
        // 设置当前活跃的聊天类型
        setActiveChat: (chatType) => 
          set({ activeChat: chatType }),
          
        // 获取指定聊天类型的消息
        getMessages: (chatType) => 
          get().chats[chatType]?.messages || 
          (chatType === 'art-advisor' ? initialArtAdvisorMessages : initialPromptOptimizerMessages),
        
        // 获取指定聊天类型的threadId
        getThreadId: (chatType) => 
          get().chats[chatType]?.threadId || null,
        
        // 添加消息到指定聊天类型
        addMessage: (chatType, message) => 
          set((state) => ({
            chats: {
              ...state.chats,
              [chatType]: {
                ...state.chats[chatType],
                messages: [...(state.chats[chatType]?.messages || []), message]
              }
            }
          })),
        
        // 设置指定聊天类型的threadId
        setThreadId: (chatType, threadId) =>
          set((state) => ({
            chats: {
              ...state.chats,
              [chatType]: {
                ...state.chats[chatType],
                threadId
              }
            }
          })),
        
        // 清空指定聊天类型的记录
        clearMessages: (chatType) => 
          set((state) => ({ 
            chats: {
              ...state.chats,
              [chatType]: {
                messages: chatType === 'art-advisor' 
                  ? initialArtAdvisorMessages 
                  : initialPromptOptimizerMessages,
                threadId: null
              }
            }
          })),
      }),
      {
        name: 'ai-chat-assistant', // localStorage存储名称
        storage: createJSONStorage(() => localStorage), // 显式指定使用localStorage
        partialize: (state) => ({  // 只保存我们需要的字段
          chats: state.chats,
          activeChat: state.activeChat
        }),
      }
    )
  )

  return useStore
}

// 导出客户端安全的钩子
let useChatStore

// 确保代码只在客户端执行
if (typeof window !== 'undefined') {
  useChatStore = createChatStore()
} else {
  // 服务器端的存根实现
  useChatStore = create(() => ({
    chats: {
      'art-advisor': {
        messages: initialArtAdvisorMessages,
        threadId: null
      },
      'prompt-optimizer': {
        messages: initialPromptOptimizerMessages,
        threadId: null
      }
    },
    activeChat: 'art-advisor',
    setActiveChat: () => {},
    getMessages: () => initialArtAdvisorMessages,
    getThreadId: () => null,
    addMessage: () => {},
    setThreadId: () => {},
    clearMessages: () => {},
  }))
}

export { useChatStore } 