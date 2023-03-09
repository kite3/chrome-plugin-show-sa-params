import { setBadge } from './utils'

const btn = document.querySelector('#btn')

let flag = false
chrome.storage.sync.get('flag', function (data) {
  // 复原上次的状态
  flag = data.flag
  btn.innerHTML = flag ? '关闭监听' : '开启监听'
  setBadge(flag)
})

btn.addEventListener('click', function () {
  flag = !flag
  btn.innerHTML = flag ? '关闭监听' : '开启监听'
  setBadge(flag)
  // 将状态记录在本地，下次popup打开时才能复原
  chrome.storage.sync.set({ flag }, () => {})

  chrome.runtime.sendMessage({ isIntercept: flag }, function (response) {
    console.log('收到来自后台的回复：' + response)
  })
})
