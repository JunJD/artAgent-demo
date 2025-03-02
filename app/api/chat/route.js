import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { messages, openId, chatType = 'art-advisor' } = await request.json();
    
    // 根据聊天类型选择对应的API凭证
    let appId, secretKey;
    
    if (chatType === 'art-advisor') {
      appId = process.env.NEXT_PUBLIC_BAIDU_ART_CLIENT_ID;
      secretKey = process.env.NEXT_PUBLIC_BAIDU_ART_CLIENT_SECRET;
    } else if (chatType === 'prompt-optimizer') {
      appId = process.env.NEXT_PUBLIC_BAIDU_PROMPT_CLIENT_ID;
      secretKey = process.env.NEXT_PUBLIC_BAIDU_PROMPT_CLIENT_SECRET;
    } else {
      return NextResponse.json(
        { error: '无效的聊天类型' },
        { status: 400 }
      );
    }
    
    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: '缺少百度智能体API凭证' },
        { status: 500 }
      );
    }
    
    // 获取最后一条用户消息
    const lastMessage = messages[messages.length - 1];
    const threadId = messages.length > 2 ? messages[0].threadId : undefined;
    
    // 构造请求体
    const requestBody = {
      message: {
        content: {
          type: 'text',
          value: {
            showText: lastMessage.content
          }
        }
      },
      source: appId,
      from: 'openapi',
      openId: openId || 'user_' + Date.now(),
      threadId
    };
    
    // 调用百度智能体API
    const response = await fetch(
      `https://agentapi.baidu.com/assistant/conversation?appId=${appId}&secretKey=${secretKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    // 验证响应
    if (!response.ok) {
      const errorText = await response.text();
      console.error('百度智能体API错误:', errorText);
      return NextResponse.json(
        { error: '调用智能体API失败' },
        { status: response.status }
      );
    }
    
    // 设置流式响应头
    const encoder = new TextEncoder();
    let threadIdValue;
    
    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        // 处理SSE响应
        const reader = response.body.getReader();
        let responseText = '';
        let buffer = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 解码当前数据块
            buffer += new TextDecoder().decode(value, { stream: true });
            
            // 处理缓冲区中的每一行
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';  // 最后一行可能不完整，留到下一次处理
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const data = JSON.parse(line.slice(5).trim());
                  
                  if (data.status === 0 && data.data?.message) {
                    const message = data.data.message;
                    
                    // 保存threadId以返回给客户端
                    if (message.threadId && !threadIdValue) {
                      threadIdValue = message.threadId;
                    }
                    
                    // 检查消息内容
                    if (message.content && Array.isArray(message.content)) {
                      for (const content of message.content) {
                        if (content.dataType === 'markdown' && content.data?.text) {
                          responseText += content.data.text;
                          
                          // 发送文本片段
                          controller.enqueue(encoder.encode(JSON.stringify({
                            text: content.data.text,
                            isFinished: content.isFinished,
                            endTurn: message.endTurn,
                            threadId: message.threadId
                          }) + '\n'));
                        }
                      }
                    }
                    
                    // 如果是最后一个消息包，结束流
                    if (message.endTurn) {
                      break;
                    }
                  }
                } catch (e) {
                  console.error('解析SSE响应失败:', e, line);
                }
              }
            }
          }
        } catch (error) {
          console.error('流处理错误:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });
    
    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
    
  } catch (error) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
} 