console.info('======contentScript======')

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('background-script发来的消息')
  console.table(JSON.parse(message).properties)
  sendResponse('get!')
})
