import type {
  CreateManyParams,
  CreateManyResponse,
  CreateParams,
  CreateResponse,
  CustomParams,
  CustomResponse,
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

import { tryit } from 'radashi'
import { fetchClinet } from '@/api'

const adminPrefix = '/api/admin'
const bulkAfterPrefix = '/bulk'

export function dataProvider(): DataProvider {
  return {
    getOne: async <TData = any>(params: GetOneParams): Promise<GetOneResponse<TData>> => {
      const { resource, id, meta } = params

      const resourcePath = `${adminPrefix}/${resource}/${id}`

      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.GET)(resourcePath as any, {
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error as any)
      }

      return { data: response?.data?.data as TData }
    },

    update: async <TData = any, TVariables = any>(params: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
      const { resource, id, variables, meta } = params
      const resourcePath = `${adminPrefix}/${resource}/${id}`
      const { headers, method } = meta ?? {}

      // 过滤掉空值的字段（比如空密码）
      const filteredVariables = Object.fromEntries(
        Object.entries(variables || {}).filter(([_, value]) => value !== '' && value != null),
      )

      const [error, response] = method === 'put'
        ? await tryit(fetchClinet.PUT)(resourcePath as any, {
            body: filteredVariables,
            headers,
          })
        : await tryit(fetchClinet.PATCH)(resourcePath as any, {
            body: filteredVariables,
            headers,
          })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      return { data: response?.data?.data as TData }
    },

    create: async <TData = any, TVariables = any>(params: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
      const { resource, variables, meta } = params
      const resourcePath = `${adminPrefix}/${resource}`
      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.POST)(resourcePath as any, {
        body: variables,
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      return { data: response?.data?.data as TData }
    },

    deleteOne: async <TData = any, TVariables = any>(params: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
      const { resource, id, meta } = params
      const resourcePath = `${adminPrefix}/${resource}/${id}`
      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.DELETE)(resourcePath as any, {
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      return { data: response?.data?.data as TData }
    },

    getList: async <TData = any>(params: GetListParams): Promise<GetListResponse<TData>> => {
      const { resource, pagination, sorters, filters, meta } = params
      const resourcePath = `${adminPrefix}/${resource}`
      const { headers: headersFromMeta } = meta ?? {}

      const queryParams: Record<string, string> = {}

      // 处理分页 - 使用 Refine 标准分页参数
      if (pagination) {
        const { currentPage = 1, pageSize = 10, mode = 'server' } = pagination
        if (mode === 'server') {
          queryParams.current = currentPage.toString()
          queryParams.pageSize = pageSize.toString()
          queryParams.mode = mode
        }
        else if (mode === 'off') {
          // 关闭分页时，传递 mode=off 给后端，让后端返回所有数据
          queryParams.mode = mode
        }
      }

      // 处理排序 - 转换为 JSON 字符串格式，与 refine-query 兼容
      if (sorters && sorters.length > 0) {
        const sortersData = sorters.map(sorter => ({
          field: sorter.field,
          order: sorter.order,
        }))
        queryParams.sorters = JSON.stringify(sortersData)
      }

      // 处理过滤 - 支持复杂过滤条件
      if (filters && filters.length > 0) {
        queryParams.filters = JSON.stringify(filters)
      }

      const [error, response] = await tryit(fetchClinet.GET)(resourcePath as any, {
        params: {
          query: queryParams,
        },
        headers: headersFromMeta,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      const responseData = response?.data

      const totalFromHeaders = response?.response?.headers?.get('x-total-count')
      const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])
      const total = totalFromHeaders ? Number.parseInt(totalFromHeaders, 10) : (responseData?.total || data.length)

      return { data, total }
    },

    getMany: async <TData = any>(params: GetManyParams): Promise<GetManyResponse<TData>> => {
      const { resource, ids, meta } = params
      const resourcePath = `${adminPrefix}/${resource}`
      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.GET)(resourcePath as any, {
        params: {
          query: {
            ids: ids.join(','),
          },
        },
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      const responseData = response?.data
      const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

      return { data }
    },

    createMany: async <TData = any, TVariables = any>(params: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
      const { resource, variables, meta } = params
      const bulkPath = `${adminPrefix}/${resource}${bulkAfterPrefix}`
      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.POST)(bulkPath as any, {
        body: { data: variables } as any,
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      const responseData = response?.data
      const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

      return { data }
    },

    updateMany: async <TData = any, TVariables = any>(params: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
      const { resource, ids, variables, meta } = params
      const bulkPath = `${adminPrefix}/${resource}${bulkAfterPrefix}`
      const { headers } = meta ?? {}

      const filteredVariables = Object.fromEntries(
        Object.entries(variables || {}).filter(([_, value]) => value !== '' && value != null),
      )

      const [error, response] = await tryit(fetchClinet.PUT)(bulkPath as any, {
        body: {
          ids,
          data: filteredVariables,
        },
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      const responseData = response?.data
      const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

      return { data }
    },

    deleteMany: async <TData = any, TVariables = any>(params: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
      const { resource, ids, meta } = params
      const bulkPath = `${adminPrefix}/${resource}${bulkAfterPrefix}`
      const { headers } = meta ?? {}

      const [error, response] = await tryit(fetchClinet.DELETE)(bulkPath as any, {
        body: { ids },
        headers,
      })

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      const responseData = response?.data
      const data = Array.isArray(responseData) ? responseData : (responseData?.data || [])

      return { data }
    },

    custom: async <TData = any, TQuery = unknown, TPayload = unknown>(
      params: CustomParams<TQuery, TPayload>,
    ): Promise<CustomResponse<TData>> => {
      const { url, method = 'get', payload, query, headers: headersFromParams, meta } = params
      const { headers: headersFromMeta } = meta ?? {}

      // 合并 headers
      const headers = {
        ...headersFromMeta,
        ...headersFromParams,
      }

      let error: any
      let response: any

      switch (method.toLowerCase()) {
        case 'get':
          [error, response] = await tryit(fetchClinet.GET)(url as any, {
            params: {
              query,
            },
            headers,
          })
          break

        case 'post':
          [error, response] = await tryit(fetchClinet.POST)(url as any, {
            body: payload,
            headers,
          })
          break

        case 'put':
          [error, response] = await tryit(fetchClinet.PUT)(url as any, {
            body: payload,
            headers,
          })
          break

        case 'patch':
          [error, response] = await tryit(fetchClinet.PATCH)(url as any, {
            body: payload,
            headers,
          })
          break

        case 'delete':
          [error, response] = await tryit(fetchClinet.DELETE)(url as any, {
            body: payload,
            headers,
          })
          break

        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      if (error || response?.error) {
        throw error || new Error(response?.error)
      }

      return { data: response?.data?.data as TData }
    },

    getApiUrl: () => import.meta.env.VITE_APP_BASEURL,
  }
}
