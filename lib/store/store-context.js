'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { initialState } from '../models'
import { reducer } from './reducer'
import { loadState, saveState } from './persistence'

// 创建上下文
const StoreContext = createContext(null)
const StoreDispatchContext = createContext(null)

/**
 * 全局状态提供者组件
 */
export function StoreProvider({ children }) {
  // 从本地存储加载初始状态
  const persistedState = loadState() || initialState
  
  const [state, dispatch] = useReducer(reducer, persistedState)
  
  // 当状态变化时保存到本地存储
  useEffect(() => {
    saveState(state)
  }, [state])
  
  return (
    <StoreContext.Provider value={state}>
      <StoreDispatchContext.Provider value={dispatch}>
        {children}
      </StoreDispatchContext.Provider>
    </StoreContext.Provider>
  )
}

/**
 * 使用全局状态的Hook
 * @returns {Object} 全局状态
 */
export function useStore() {
  const context = useContext(StoreContext)
  if (context === null) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

/**
 * 使用状态分发的Hook
 * @returns {Function} dispatch函数
 */
export function useDispatch() {
  const context = useContext(StoreDispatchContext)
  if (context === null) {
    throw new Error('useDispatch must be used within a StoreProvider')
  }
  return context
} 