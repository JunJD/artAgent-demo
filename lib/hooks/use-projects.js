'use client'

import { useCallback } from 'react'
import { useStore, useDispatch } from '../store/store-context'
import * as actions from '../store/actions'

/**
 * 项目管理Hook
 * @returns {Object} 项目相关状态和方法
 */
export function useProjects() {
  const { projects, currentProjectId } = useStore()
  const dispatch = useDispatch()
  
  const currentProject = projects.find(p => p.id === currentProjectId) || null
  
  const createNewProject = useCallback((title, description) => {
    dispatch(actions.createProject(title, description))
  }, [dispatch])
  
  const updateProject = useCallback((id, updates) => {
    dispatch(actions.updateProject(id, updates))
  }, [dispatch])
  
  const deleteProject = useCallback((id) => {
    dispatch(actions.deleteProject(id))
  }, [dispatch])
  
  const setCurrentProject = useCallback((id) => {
    dispatch(actions.setCurrentProject(id))
  }, [dispatch])
  
  const updateFlowData = useCallback((id, nodes, edges) => {
    dispatch(actions.updateFlowData(id, nodes, edges))
  }, [dispatch])
  
  const setProjectCover = useCallback((id, coverImage) => {
    dispatch(actions.setProjectCover(id, coverImage))
  }, [dispatch])
  
  return {
    projects,
    currentProject,
    currentProjectId,
    createNewProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    updateFlowData,
    setProjectCover
  }
} 