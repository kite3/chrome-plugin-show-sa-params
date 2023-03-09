import { decode } from 'js-base64'
import { setBadge } from './utils'

function sendMessageToContentScript(message) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        console.log('content-script发来的消息 ' + response)
      })
    }
  )
}

function handleDetail(detail) {
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

    // 不要用window.atob对bas64进行解码，会导致中！文！乱！码！！
    const json_str = decode(params.data) // 这个就是神策埋点的入参
    sendMessageToContentScript(json_str)
  }
}

function startListener() {
  chrome.webRequest.onBeforeRequest.addListener(
    handleDetail,
    {
      urls: ['https://sdata.xinli001.com/*']
    },
    ['requestBody']
  )
}

function closeListener() {
  chrome.webRequest.onBeforeRequest.removeListener(
    handleDetail,
    {
      urls: ['https://sdata.xinli001.com/*']
    },
    ['requestBody']
  )
}

chrome.runtime.onInstalled.addListener(function () {
  console.log('插件已被安装')

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    console.log('popup-script发来的消息', message)
    if (message.isIntercept) {
      startListener()
    } else {
      closeListener()
    }
    sendResponse('ok!')
  })

  chrome.storage.sync.get('flag', function (data) {
    // 背景脚本初始化的时候，根据本地存储的状态，判断是否要开启监听
    let flag = data.flag
    flag ? startListener() : closeListener()
    setBadge(flag)
  })
})
