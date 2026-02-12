import {
  Authenticated,
  Refine,
} from '@refinedev/core'
// import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router'
import { BookOpen, Cog, Globe, Settings, ShieldCheck, Users } from 'lucide-react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import { accessControlProvider } from '@/providers/access-control'
import { authProvider } from '@/providers/auth-provider'
import { dataProvider } from '@/providers/data-provider'
import { useI18nProvider } from '@/providers/i18n-provider'
import { ErrorComponent } from './components/refine-ui/layout/error-component'
import { Layout } from './components/refine-ui/layout/layout'
import { Toaster } from './components/refine-ui/notification/toaster'
import { useNotificationProvider } from './components/refine-ui/notification/use-notification-provider'
import { ThemeProvider } from './components/refine-ui/theme/theme-provider'
import { Login } from './pages/login'
import {
  DictCreate,
  DictEdit,
  DictList,
  DictShow,
} from './pages/system/dicts'
import {
  ParamCreate,
  ParamEdit,
  ParamList,
  ParamShow,
} from './pages/system/params'
import {
  RoleAssignPermissions,
  RoleCreate,
  RoleEdit,
  RoleList,
  RoleShow,
} from './pages/system/roles'
import {
  UserAssignRoles,
  UserCreate,
  UserEdit,
  UserList,
  UserShow,
} from './pages/system/users'

import './App.css'

function App() {
  const i18nProvider = useI18nProvider()

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          {/* <DevtoolsProvider> */}
          <Refine
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            dataProvider={dataProvider()}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            i18nProvider={i18nProvider}
            resources={[
              {
                name: 'system',
                meta: {
                  label: '系统管理',
                  icon: <Settings size={16} />,
                },
              },
              {
                name: 'system/users',
                list: '/system/users',
                create: '/system/users/create',
                edit: '/system/users/edit/:id',
                show: '/system/users/show/:id',
                meta: {
                  label: '用户管理',
                  canDelete: true,
                  parent: 'system',
                  icon: <Users size={16} />,
                  customActions: {
                    分配角色: {
                      path: '/system/users/{id}/roles',
                      method: 'PUT',
                    },
                  },
                },
              },
              {
                name: 'system/roles',
                list: '/system/roles',
                create: '/system/roles/create',
                edit: '/system/roles/edit/:id',
                show: '/system/roles/show/:id',
                meta: {
                  label: '角色管理',
                  canDelete: true,
                  parent: 'system',
                  icon: <ShieldCheck size={16} />,
                  customActions: {
                    查看权限: {
                      path: '/system/roles/{id}/permissions',
                      method: 'GET',
                    },
                    分配权限: {
                      path: '/system/roles/{id}/permissions',
                      method: 'PUT',
                    },
                  },
                },
              },
              {
                name: 'system/dicts',
                list: '/system/dicts',
                create: '/system/dicts/create',
                edit: '/system/dicts/edit/:id',
                show: '/system/dicts/show/:id',
                meta: {
                  label: '字典管理',
                  canDelete: true,
                  parent: 'system',
                  icon: <BookOpen size={16} />,
                },
              },
              {
                name: 'system/params',
                list: '/system/params',
                create: '/system/params/create',
                edit: '/system/params/edit/:id',
                show: '/system/params/show/:id',
                meta: {
                  label: '参数配置',
                  canDelete: true,
                  parent: 'system',
                  icon: <Cog size={16} />,
                },
              },
              {
                name: 'common',
                meta: {
                  label: '通用资源',
                  icon: <Globe size={16} />,
                },
              },
              {
                name: 'common/public-api',
                meta: {
                  label: '公共接口',
                  parent: 'common',
                  customActions: {
                    对象存储上传: {
                      path: '/resources/object-storage/upload',
                      method: 'POST',
                    },
                    对象存储下载: {
                      path: '/resources/object-storage/{id}',
                      method: 'GET',
                    },
                  },
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: '7XPXCx-bNv6R5-iksduN',
            }}
          >
            <Routes>
              <Route
                element={(
                  <Layout>
                    <Outlet />
                  </Layout>
                )}
              >
                <Route
                  index
                  element={<NavigateToResource resource="system/users" />}
                />
                <Route path="/system/users">
                  <Route index element={<UserList />} />
                  <Route path="assign-roles/:id" element={<UserAssignRoles />} />
                  <Route path="create" element={<UserCreate />} />
                  <Route path="edit/:id" element={<UserEdit />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
                <Route path="/system/roles">
                  <Route index element={<RoleList />} />
                  <Route path="assign-permissions/:id" element={<RoleAssignPermissions />} />
                  <Route path="create" element={<RoleCreate />} />
                  <Route path="edit/:id" element={<RoleEdit />} />
                  <Route path="show/:id" element={<RoleShow />} />
                </Route>
                <Route path="/system/dicts">
                  <Route index element={<DictList />} />
                  <Route path="create" element={<DictCreate />} />
                  <Route path="edit/:id" element={<DictEdit />} />
                  <Route path="show/:id" element={<DictShow />} />
                </Route>
                <Route path="/system/params">
                  <Route index element={<ParamList />} />
                  <Route path="create" element={<ParamCreate />} />
                  <Route path="edit/:id" element={<ParamEdit />} />
                  <Route path="show/:id" element={<ParamShow />} />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* 登录 */}
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

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          {/* <DevtoolsPanel /> */}
          {/* </DevtoolsProvider> */}
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
