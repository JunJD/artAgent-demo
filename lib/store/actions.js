import { ActionTypes } from './reducer'

/**
 * 创建新项目
 * @param {string} title - 项目标题
 * @param {string} description - 项目描述
 */
export function createProject(title, description = '') {
  return {
    type: ActionTypes.CREATE_PROJECT,
    payload: { title, description }
  }
}

/**
 * 更新项目信息
 * @param {string} id - 项目ID
 * @param {Object} updates - 要更新的字段
 */
export function updateProject(id, updates) {
  return {
    type: ActionTypes.UPDATE_PROJECT,
    payload: { id, ...updates }
  }
}

/**
 * 删除项目
 * @param {string} id - 项目ID
 */
export function deleteProject(id) {
  return {
    type: ActionTypes.DELETE_PROJECT,
    payload: { id }
  }
}

/**
 * 设置当前项目
 * @param {string} id - 项目ID
 */
export function setCurrentProject(id) {
  return {
    type: ActionTypes.SET_CURRENT_PROJECT,
    payload: { id }
  }
}

/**
 * 更新流程图数据
 * @param {string} id - 项目ID
 * @param {Array} nodes - 节点数据
 * @param {Array} edges - 连接数据
 */
export function updateFlowData(id, nodes, edges) {
  return {
    type: ActionTypes.UPDATE_FLOW_DATA,
    payload: { id, nodes, edges }
  }
}

/**
 * 设置项目封面图片
 * @param {string} id - 项目ID
 * @param {string} coverImage - 封面图片URL
 */
export function setProjectCover(id, coverImage) {
  return {
    type: ActionTypes.SET_PROJECT_COVER,
    payload: { id, coverImage }
  }
}

/**
 * 更新用户设置
 * @param {Object} settings - 要更新的设置
 */
export function updateSettings(settings) {
  return {
    type: ActionTypes.UPDATE_SETTINGS,
    payload: settings
  }
} 