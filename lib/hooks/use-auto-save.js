'use client'

import { useEffect, useRef } from 'react'
import { useProjects } from './use-projects'
import { useSettings } from './use-settings'

/**
 * 自动保存Hook
 * @param {Array} nodes - 流程图节点
 * @param {Array} edges - 流程图连接
 */
export function useAutoSave(nodes, edges) {
  const { currentProject, updateFlowData } = useProjects()
  const { settings } = useSettings()
  const timerRef = useRef(null)
  
  useEffect(() => {
    // 如果没有当前项目或自动保存关闭，则不执行
    if (!currentProject || !settings.autoSave) {
      return
    }
    
    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // 设置新的定时器
    timerRef.current = setInterval(() => {
      updateFlowData(currentProject.id, nodes, edges)
      console.log('自动保存流程图数据')
    }, settings.autoSaveInterval * 1000)
    
    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentProject, nodes, edges, settings.autoSave, settings.autoSaveInterval, updateFlowData])
} 