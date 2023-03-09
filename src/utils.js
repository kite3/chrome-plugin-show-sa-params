export function setBadge(flag) {
  chrome.browserAction.setBadgeText({ text: flag ? 'ON' : 'OFF' })
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
}
