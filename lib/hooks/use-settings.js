'use client'

import { useCallback } from 'react'
import { useStore, useDispatch } from '../store/store-context'
import { updateSettings } from '../store/actions'

/**
 * 用户设置Hook
 * @returns {Object} 设置相关状态和方法
 */
export function useSettings() {
  const { settings } = useStore()
  const dispatch = useDispatch()
  
  const updateUserSettings = useCallback((newSettings) => {
    dispatch(updateSettings(newSettings))
  }, [dispatch])
  
  const setTheme = useCallback((theme) => {
    dispatch(updateSettings({ theme }))
  }, [dispatch])
  
  const setAutoSave = useCallback((autoSave) => {
    dispatch(updateSettings({ autoSave }))
  }, [dispatch])
  
  const setAutoSaveInterval = useCallback((autoSaveInterval) => {
    dispatch(updateSettings({ autoSaveInterval }))
  }, [dispatch])
  
  return {
    settings,
    updateUserSettings,
    setTheme,
    setAutoSave,
    setAutoSaveInterval
  }
} 