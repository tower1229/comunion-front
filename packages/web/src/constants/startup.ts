/**
 * Startup types
 */
export const STARTUP_TYPES = ['ORG', 'NGO', 'DAO', 'COM', 'DCO'] as const
export type StartupTypesType = typeof STARTUP_TYPES[number]
export const STARTUP_TYPES_COLOR_MAP = {
  ORG: '#EA4D56', // new 2022.8.26
  NGO: '#F29F39',
  DAO: '#5331F4',
  COM: '#3773F6',
  DCO: '#4BBA64' // new 2022.8.26
} as const

export const STARTUP_TYPES_SUBCOLOR_MAP = {
  ORG: '#FAE4E7',
  NGO: '#FBF5ED',
  DAO: '#F1EDFB',
  COM: '#E9F0FE',
  DCO: '#EDFBEF'
} as const
/**
 * 0:NONE,1:ORG,2:NGO,3:DAO,4:COM,5:DCO
 * @param mode contract mode
 */
export function getStartupTypeFromNumber(mode: number) {
  return STARTUP_TYPES[mode - 1]
}
/**
 * @param type contract mode
 * @return 0:NONE,1:ORG,2:NGO,3:DAO,4:COM,5:DCO
 */
export function getStartupNumberFromType(type: StartupTypesType) {
  return STARTUP_TYPES.indexOf(type) + 1
}
