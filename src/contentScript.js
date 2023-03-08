chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.table(JSON.parse(message).properties)
  sendResponse('get!')
})
