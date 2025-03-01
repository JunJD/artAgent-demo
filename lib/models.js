/**
 * 项目模型
 * @typedef {Object} Project
 * @property {string} id - 项目唯一ID
 * @property {string} title - 项目标题
 * @property {string} description - 项目描述
 * @property {string} coverImage - 项目封面图片URL
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 最后更新时间
 * @property {Object} flowData - 流程图数据
 * @property {Array} flowData.nodes - 流程图节点
 * @property {Array} flowData.edges - 流程图连接
 */

/**
 * 用户设置模型
 * @typedef {Object} UserSettings
 * @property {string} theme - 主题 ('light' | 'dark' | 'system')
 * @property {boolean} autoSave - 是否自动保存
 * @property {number} autoSaveInterval - 自动保存间隔(秒)
 */

/**
 * 应用状态模型
 * @typedef {Object} AppState
 * @property {Array<Project>} projects - 项目列表
 * @property {string|null} currentProjectId - 当前打开的项目ID
 * @property {UserSettings} settings - 用户设置
 */

/**
 * 创建新项目
 * @param {string} title - 项目标题
 * @param {string} description - 项目描述
 * @returns {Project} 新项目
 */
export function createProject(title, description = '') {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    coverImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    flowData: {
      nodes: [],
      edges: []
    }
  }
}

/**
 * 初始应用状态
 */
export const initialState = {
  projects: [],
  currentProjectId: null,
  settings: {
    theme: 'system',
    autoSave: true,
    autoSaveInterval: 30
  }
} 