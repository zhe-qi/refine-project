import type { GenerateServiceProps } from 'openapi-ts-request'

export default [
  {
    schemaPath: 'http://localhost:9999/api/admin/doc',
    serversPath: './src/api/admin',
    requestImportStatement: 'import { request } from \'@/api/request\'',
    requestOptionsType: 'CustomRequestOptions',
    isGenReactQuery: true,
    reactQueryMode: 'react',
    isGenJavaScript: false,
  },
  {
    schemaPath: 'http://localhost:9999/api/doc',
    serversPath: './src/api/public',
    requestImportStatement: 'import { request } from \'@/api/request\'',
    requestOptionsType: 'CustomRequestOptions',
    isGenReactQuery: true,
    reactQueryMode: 'react',
    isGenJavaScript: false,
  },
] as GenerateServiceProps[]
