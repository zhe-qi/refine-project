import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  zh: {
    translation: {
      buttons: {
        create: '创建',
        edit: '编辑',
        show: '查看',
        delete: '删除',
        save: '保存',
        cancel: '取消',
        clear: '清除',
        apply: '应用',
        undo: '撤销',
        refresh: '刷新',
        list: '列表',
        clone: '克隆',
      },
      notifications: {
        success: '成功',
        error: '错误',
        created: '创建成功',
        createSuccess: '创建成功',
        createError: '创建失败',
        updated: '更新成功',
        updateSuccess: '更新成功',
        updateError: '更新失败',
        deleted: '删除成功',
        deleteSuccess: '删除成功',
        deleteError: '删除失败',
        editSuccess: '编辑成功',
        editError: '编辑失败',
        undoable: '你有 {{seconds}} 秒时间来撤销',
        progress: '处理中',
      },
      resources: {
        'system/dicts': {
          name: '字典',
          fields: {
            id: 'ID',
            code: '字典编码',
            name: '字典名称',
            description: '描述',
            items: '字典项',
            status: '状态',
            createdAt: '创建时间',
          },
        },
        'system/params': {
          name: '参数',
          fields: {
            id: 'ID',
            key: '参数键',
            name: '参数名称',
            value: '参数值',
            valueType: '值类型',
            description: '描述',
            status: '状态',
            createdAt: '创建时间',
          },
        },
        'system/users': {
          name: '用户',
          fields: {
            id: 'ID',
            username: '用户名',
            nickName: '昵称',
            status: '状态',
            roles: '角色',
            createdAt: '创建时间',
          },
        },
        'system/roles': {
          name: '角色',
          fields: {
            id: 'ID',
            name: '角色名称',
            description: '描述',
            status: '状态',
            createdAt: '创建时间',
          },
        },
      },
      confirmations: {
        delete: '你确定要删除这条记录吗?',
        deleteMany: '你确定要删除这些记录吗?',
      },
      table: {
        filter: {
          text: {
            placeholder: '筛选...',
          },
          numeric: {
            placeholder: '筛选...',
          },
          combobox: {
            placeholder: '选择...',
            search: '搜索...',
            noResults: '未找到结果。',
          },
          operator: {
            placeholder: '搜索操作符...',
            noResults: '未找到操作符。',
            eq: '等于',
            ne: '不等于',
            lt: '小于',
            gt: '大于',
            lte: '小于等于',
            gte: '大于等于',
            in: '包含于数组',
            nin: '不包含于数组',
            ina: '包含于数组(区分大小写)',
            nina: '不包含于数组(区分大小写)',
            contains: '包含',
            ncontains: '不包含',
            containss: '包含(区分大小写)',
            ncontainss: '不包含(区分大小写)',
            between: '在...之间',
            nbetween: '不在...之间',
            null: '为空',
            nnull: '不为空',
            startswith: '开始于',
            nstartswith: '不开始于',
            startswiths: '开始于(区分大小写)',
            nstartswiths: '不开始于(区分大小写)',
            endswith: '结束于',
            nendswith: '不结束于',
            endswiths: '结束于(区分大小写)',
            nendswiths: '不结束于(区分大小写)',
          },
        },
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    lng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
