'use client'
const STORAGE_KEY = 'artAgent_state'

/**
 * 检查是否在浏览器环境中
 * @returns {boolean} 是否在浏览器环境
 */
const isBrowser = () => typeof window !== 'undefined'

/**
 * 将状态保存到本地存储
 * @param {Object} state - 要保存的状态
 */
export function saveState(state) {
  if (!isBrowser()) return
  
  try {
    // 序列化日期对象
    const serializedState = JSON.stringify(state, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() }
      }
      return value
    })
    
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (err) {
    console.error('保存状态失败:', err)
  }
}

/**
 * 从本地存储加载状态
 * @returns {Object|null} 加载的状态或null
 */
export function loadState() {
  if (!isBrowser()) return null
  
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    
    if (!serializedState) {
      return null
    }
    
    // 反序列化日期对象
    return JSON.parse(serializedState, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value)
      }
      return value
    })
  } catch (err) {
    console.error('加载状态失败:', err)
    return null
  }
}

/**
 * 清除本地存储的状态
 */
export function clearState() {
  if (!isBrowser()) return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('清除状态失败:', err)
  }
} 