import { BaseNode } from './base-node'
import Image from 'next/image'
import { useState } from 'react'

export function EndNode({ data, selected }) {
  const [imageError, setImageError] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!data.image || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // 获取图片数据
      const response = await fetch(data.image);
      const blob = await response.blob();
      
      // 创建一个临时的对象URL
      const blobUrl = URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // 从URL中提取文件名，如果无法提取则使用默认名称
      const fileName = data.image.split('/').pop().split('?')[0] || 'image.png';
      link.download = fileName;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理对象URL
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        setIsDownloading(false);
      }, 100);
    } catch (error) {
      console.error('下载图片失败:', error);
      setIsDownloading(false);
    }
  };

  return (
    <BaseNode
      data={data}
      selected={selected}
      type="end"
      inputs={['image']}
      className="w-[200px]"
    >
      <div className="p-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">⭕</span>
          <span className="font-medium">完成</span>
        </div>
        {data.image && (
          <>
            <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
              <Image
                src={data.image}
                alt="最终结果"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="200px"
                priority
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500">
                  图片加载失败
                </div>
              )}
            </div>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className={`mt-2 w-full py-1 px-2 ${isDownloading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md text-sm flex items-center justify-center transition-colors`}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在下载...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载图片
                </>
              )}
            </button>
          </>
        )}
      </div>
    </BaseNode>
  )
} 
