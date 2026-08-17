export type ScFieldType =
  | 'text' | 'textarea' | 'rich-text' | 'number' | 'boolean'
  | 'date' | 'datetime' | 'email' | 'phone' | 'url'
  | 'password' | 'color' | 'select' | 'json' | 'file' | 'image'

export type ScAccessLevel = 'public' | 'admin' | 'granular'

export type ScRelationType = 'many-to-one' | 'many-to-many' | 'one-to-many'

export interface ScFieldOption {
  label: string
  value: string | number
}

export interface ScFieldConfig {
  name: string
  label: string
  type: ScFieldType
  required: boolean
  unique: boolean
  searchable: boolean
  sortable: boolean
  visible: boolean
  defaultValue?: any
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  options?: ScFieldOption[]
  placeholder?: string
  helpText?: string
}

export interface ScRelationConfig {
  name: string
  type: ScRelationType
  targetModule: string
  joinTable?: string
}

export interface ScModule {
  id: number
  name: string
  label: string
  routePath: string
  menuLabel: string
  accessLevel: ScAccessLevel
  accessRoles: string[] | null
  accessPermissions: string[] | null
  isActive: boolean
  fieldsConfig: ScFieldConfig[]
  relationsConfig: ScRelationConfig[] | null
  createdAt: string
  updatedAt: string
}

export interface CreateScModule {
  name: string
  label: string
  menuLabel: string
  description?: string
  fields: ScFieldConfig[]
  relations?: ScRelationConfig[]
  accessLevel: ScAccessLevel
  accessRoles?: string[]
  accessPermissions?: string[]
}

export interface UpdateScModule {
  label?: string
  menuLabel?: string
  fields?: ScFieldConfig[]
  relations?: ScRelationConfig[]
  accessLevel?: ScAccessLevel
  accessRoles?: string[]
  accessPermissions?: string[]
}

export interface QueryScModule {
  page?: number
  limit?: number
  search?: string
  searchField?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}
