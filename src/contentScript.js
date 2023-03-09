chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const data = JSON.parse(message)

  let target = {
    事件: data['event']
  }
  let properties = data.properties
  const excludes = ['platform_type', 'yxl_source', 'source_page', 'touch_name']
  for (let key in properties) {
    if (!key.startsWith('$') && !excludes.includes(key)) {
      if (typeof properties[key] === 'string') {
        if (properties[key].trim() === '') {
          target[key] = ' '
        } else {
          target[key] = properties[key]
        }
      } else {
        target[key] = JSON.stringify(properties[key])
      }
    }
  }

  console.table(target)
  sendResponse('get!')
})
