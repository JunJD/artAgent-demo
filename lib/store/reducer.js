import { createProject } from '../models'

// 定义action类型
export const ActionTypes = {
  CREATE_PROJECT: 'CREATE_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  UPDATE_FLOW_DATA: 'UPDATE_FLOW_DATA',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_PROJECT_COVER: 'SET_PROJECT_COVER'
}

/**
 * 全局状态Reducer
 * @param {Object} state - 当前状态
 * @param {Object} action - 分发的动作
 * @returns {Object} 新状态
 */
export function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.CREATE_PROJECT: {
      const newProject = createProject(
        action.payload.title,
        action.payload.description
      )
      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProjectId: newProject.id
      }
    }
    
    case ActionTypes.UPDATE_PROJECT: {
      const { id, ...updates } = action.payload
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === id 
            ? { ...project, ...updates, updatedAt: new Date() } 
            : project
        )
      }
    }
    
    case ActionTypes.DELETE_PROJECT: {
      const { id } = action.payload
      const newProjects = state.projects.filter(project => project.id !== id)
      
      return {
        ...state,
        projects: newProjects,
        currentProjectId: state.currentProjectId === id 
          ? (newProjects.length > 0 ? newProjects[0].id : null)
          : state.currentProjectId
      }
    }
    
    case ActionTypes.SET_CURRENT_PROJECT: {
      return {
        ...state,
        currentProjectId: action.payload.id
      }
    }
    
    case ActionTypes.UPDATE_FLOW_DATA: {
      const { id, nodes, edges } = action.payload
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === id 
            ? { 
                ...project, 
                flowData: { nodes, edges },
                updatedAt: new Date()
              } 
            : project
        )
      }
    }
    
    case ActionTypes.SET_PROJECT_COVER: {
      const { id, coverImage } = action.payload
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === id 
            ? { ...project, coverImage, updatedAt: new Date() } 
            : project
        )
      }
    }
    
    case ActionTypes.UPDATE_SETTINGS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      }
    }
    
    default:
      return state
  }
} 