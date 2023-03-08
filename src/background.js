chrome.runtime.onInstalled.addListener(function () {
  console.log('插件已被安装')

  function sendMessageToContentScript(message) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
          console.log('来自content-script的回复: ' + response)
        })
      }
    )
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function (detail) {
      if (
        detail &&
        detail.requestBody &&
        detail.requestBody.raw &&
        detail.requestBody.raw[0] &&
        detail.requestBody.raw[0].bytes
      ) {
        // bytes是ArrayBuffer
        const bytes = detail.requestBody.raw[0].bytes
        // 先将ArrayBuffer转为Uint8Array
        const uint8_msg = new Uint8Array(bytes)
        // 然后借助文本解码器，将Uint8Array转为字符串
        const d = new TextDecoder('utf-8')

        const code = d.decode(uint8_msg)
        // code是表单格式的，由&和=连接起来的，这里把它切割开来组装成一个对象
        const params = code.split('&').reduce((map, cur) => {
          const pair = cur.split('=')
          map[pair[0]] = decodeURIComponent(pair[1])
          return map
        }, {})

        const json_str = window.atob(params.data) // 这个就是神策埋点的入参
        sendMessageToContentScript(json_str)
      }
    },
    {
      urls: ['https://sdata.xinli001.com/*']
    },
    ['requestBody']
  )
})
