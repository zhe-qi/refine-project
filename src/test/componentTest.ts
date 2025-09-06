// Test component import resolution
async function testImport() {
  try {
    console.log('Testing component import...')
    const module = await import('../pages/system/users/list')
    console.log('Module exports:', Object.keys(module))
    console.log('UserList export:', typeof module.UserList)
    
    if (module.UserList) {
      console.log('✅ Found UserList export')
      return { default: module.UserList }
    } else {
      console.log('❌ No UserList export found')
    }
  } catch (error) {
    console.error('❌ Import failed:', error.message)
  }
}

testImport()