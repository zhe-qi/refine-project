import type {
  CreateManyParams,
  CreateManyResponse,
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteManyParams,
  DeleteManyResponse,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  UpdateManyParams,
  UpdateManyResponse,
  UpdateParams,
  UpdateResponse,
} from '@refinedev/core'

import httpClient from '@/api/request'
import { apiResources } from '@/config/resources'
import { handleError } from '@/utils/errorHandler'
import { getBulkApiPath, getSimpleApiPath } from '@/utils/resourcePath'


export function dataProvider(apiUrl: string): DataProvider {
  return {
    getOne: async <TData = any>(params: GetOneParams): Promise<GetOneResponse<TData>> => {
      try {
        const { resource, id, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'show', { id })
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers } = meta ?? {}

        const response = await httpClient.get(url, { headers })
        return { data: (response as any).data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    update: async <TData = any, TVariables = any>(params: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
      try {
        const { resource, id, variables, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'edit', { id })
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers, method } = meta ?? {}

        // 过滤掉空值的字段（比如空密码）
        const filteredVariables = Object.fromEntries(
          Object.entries(variables || {}).filter(([_, value]) => value !== '' && value != null),
        )

        const response = method === 'put'
          ? await httpClient.put(url, filteredVariables, { headers })
          : await httpClient.patch(url, filteredVariables, { headers })
        return { data: (response as any).data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    create: async <TData = any, TVariables = any>(params: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
      try {
        const { resource, variables, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'create')
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers } = meta ?? {}

        const response = await httpClient.post(url, variables, { headers })
        return { data: (response as any).data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    deleteOne: async <TData = any, TVariables = any>(params: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
      try {
        const { resource, id, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'delete', { id })
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers } = meta ?? {}

        const response = await httpClient.delete(url, { headers })
        return { data: (response as any).data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    getList: async <TData = any>(params: GetListParams): Promise<GetListResponse<TData>> => {
      try {
        const { resource, pagination, sorters, filters, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'list')
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers: headersFromMeta } = meta ?? {}

        const queryParams = new URLSearchParams()

        // 处理分页 - 使用 Refine 标准分页参数
        if (pagination) {
          const { current = 1, pageSize = 10, mode = 'server' } = pagination
          if (mode === 'server') {
            queryParams.append('current', current.toString())
            queryParams.append('pageSize', pageSize.toString())
            queryParams.append('mode', mode)
          }
        }

        // 处理排序 - 转换为 JSON 字符串格式，与 refine-query 兼容
        if (sorters && sorters.length > 0) {
          const sortersData = sorters.map(sorter => ({
            field: sorter.field,
            order: sorter.order,
          }))
          queryParams.append('sorters', JSON.stringify(sortersData))
        }

        // 处理过滤 - 支持复杂过滤条件
        if (filters && filters.length > 0) {
          queryParams.append('filters', JSON.stringify(filters))
        }

        const response = await httpClient.get(
          `${url}?${queryParams.toString()}`,
          { headers: headersFromMeta },
        )

        // 处理响应数据 - 与 Hono 模板保持一致
        const responseData = (response as any).data

        const totalFromHeaders = (response as any).headers?.['x-total-count']
        const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])
        const total = totalFromHeaders ? Number.parseInt(totalFromHeaders, 10) : (responseData?.total || data.length)

        return { data, total }
      }
      catch (error) {
        return handleError(error)
      }
    },

    getMany: async <TData = any>(params: GetManyParams): Promise<GetManyResponse<TData>> => {
      try {
        const { resource, ids, meta } = params
        const resourcePath = getSimpleApiPath(apiResources, resource, 'list')
        const url = `${apiUrl}/api/${resourcePath}`
        const { headers } = meta ?? {}

        const queryParams = new URLSearchParams()
        queryParams.append('ids', ids.join(','))

        const response = await httpClient.get(
          `${url}?${queryParams.toString()}`,
          { headers },
        )

        const responseData = (response as any).data
        const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

        return { data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    createMany: async <TData = any, TVariables = any>(params: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
      try {
        const { resource, variables, meta } = params
        const bulkPath = getBulkApiPath(apiResources, resource)
        const url = `${apiUrl}/api/${bulkPath}`
        const { headers } = meta ?? {}

        const response = await httpClient.post(url, { data: variables }, { headers })
        const responseData = (response as any).data
        const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

        return { data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    updateMany: async <TData = any, TVariables = any>(params: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
      try {
        const { resource, ids, variables, meta } = params
        const bulkPath = getBulkApiPath(apiResources, resource)
        const url = `${apiUrl}/api/${bulkPath}`
        const { headers } = meta ?? {}

        const filteredVariables = Object.fromEntries(
          Object.entries(variables || {}).filter(([_, value]) => value !== '' && value != null),
        )

        const response = await httpClient.put(url, {
          ids,
          data: filteredVariables,
        }, { headers })

        const responseData = (response as any).data
        const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

        return { data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    deleteMany: async <TData = any, TVariables = any>(params: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
      try {
        const { resource, ids, meta } = params
        const bulkPath = getBulkApiPath(apiResources, resource)
        const url = `${apiUrl}/api/${bulkPath}`
        const { headers } = meta ?? {}

        const response = await httpClient.delete(url, {
          ...{ headers },
          data: { ids },
        })

        const responseData = (response as any).data
        const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

        return { data }
      }
      catch (error) {
        return handleError(error)
      }
    },

    getApiUrl: () => apiUrl,
  }
}
