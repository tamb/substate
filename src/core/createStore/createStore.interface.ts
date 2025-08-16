import type { UpdateMiddleware } from '../Substate/Substate.interface'

interface ICreateStoreConfig {
  name: string
  state?: object
  defaultDeep?: boolean
  beforeUpdate?: UpdateMiddleware[]
  afterUpdate?: UpdateMiddleware[]
}

export type { ICreateStoreConfig }
