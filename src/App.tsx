import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from '@refinedev/antd'
import {
  Authenticated,
  Refine,
} from '@refinedev/core'

import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router'

import { App as AntdApp } from 'antd'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import { AppIcon } from './components/app-icon'
import { Header } from './components/header'
import { resources, staticRoutes } from './config/resources'
import { ColorModeContextProvider } from './contexts/color-mode'
import { Login } from './pages/login'
import { accessControlProvider } from './providers/accessControl'
import { authProvider } from './providers/authProvider'
import { dataProvider } from './providers/dataProvider'
import { generateRoutes } from './utils/routeGenerator'

import '@refinedev/antd/dist/reset.css'

// 导入调试工具
import '@/utils/debugPermissions'
import { clearPermissionCache } from './providers/accessControl'

const { VITE_APP_BASEURL } = import.meta.env

// 每次App组件加载时清理权限缓存
clearPermissionCache()

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider(VITE_APP_BASEURL)}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              routerProvider={routerBindings}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: 'Se590u-vcWOE1-8ooLXU',
                title: { text: 'Refine Project', icon: <AppIcon /> },
                reactQuery: {
                  clientConfig: {
                    defaultOptions: {
                      queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                      },
                    },
                  },
                },
              }}
            >
              <Routes>
                <Route
                  element={(
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Header={Header}
                        Sider={props => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  )}
                >
                  <Route
                    index
                    element={<NavigateToResource resource="users" />}
                  />
                  {/* 基于 schema 自动生成的路由 */}
                  {generateRoutes(staticRoutes)}
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={(
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  )}
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
