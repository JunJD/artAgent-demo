"use client"

import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import FlowEditor from '@/components/flow/flow-editor'
import { Sidebar } from '@/components/flow/sidebar'
import { ChatPanel } from '@/components/flow/chat/chat-panel'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function FlowPage() {
  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧工具栏 */}
      <Sidebar />

      {/* 中间流程编排区 */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <FlowEditor />
        </ReactFlowProvider>
      </div>

      {/* 右侧聊天面板 */}
      <div className={`relative transition-all duration-300 ${isChatOpen ? 'w-[380px]' : 'w-0'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-14 top-4 bg-white shadow-sm border"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <ChatPanel />
      </div>
    </div>
  )
} 