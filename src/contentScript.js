chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const data = JSON.parse(message)

  let target = {
    '----------神策埋点----------': '----------神策埋点----------',
    事件: data['event'],
    distinct_id: data.distinct_id || ' ',
    login_id: data.login_id || ' '
  }
  let properties = data.properties
  for (let key in properties) {
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

  console.table(target)
  sendResponse('get!')
})
