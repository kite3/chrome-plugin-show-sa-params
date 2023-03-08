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

        // 不要用window.atob对bas64进行解码，会导致中！文！乱！码！！
        const json_str = base64_decode(params.data) // 这个就是神策埋点的入参
        sendMessageToContentScript(json_str)
      }
    },
    {
      urls: ['https://sdata.xinli001.com/*']
    },
    ['requestBody']
  )
})

function strtr(str, from, to) {
  // 来自: http://phpjs.org/functions/strtr/
  var fr = '',
    i = 0,
    j = 0,
    lenStr = 0,
    lenFrom = 0,
    tmpStrictForIn = false,
    fromTypeStr = '',
    toTypeStr = '',
    istr = ''
  var tmpFrom = []
  var tmpTo = []
  var ret = ''
  var match = false
  if (typeof from === 'object') {
    for (fr in from) {
      if (from.hasOwnProperty(fr)) {
        tmpFrom.push(fr)
        tmpTo.push(from[fr])
      }
    }
    from = tmpFrom
    to = tmpTo
  }
  lenStr = str.length
  lenFrom = from.length
  fromTypeStr = typeof from === 'string'
  toTypeStr = typeof to === 'string'
  for (i = 0; i < lenStr; i++) {
    match = false
    if (fromTypeStr) {
      istr = str.charAt(i)
      for (j = 0; j < lenFrom; j++) {
        if (istr == from.charAt(j)) {
          match = true
          break
        }
      }
    } else {
      for (j = 0; j < lenFrom; j++) {
        if (str.substr(i, from[j].length) == from[j]) {
          match = true
          // Fast forward
          i = i + from[j].length - 1
          break
        }
      }
    }
    if (match) {
      ret += toTypeStr ? to.charAt(j) : to[j]
    } else {
      ret += str.charAt(i)
    }
  }
  return ret
}
function pad(target, n) {
  var len = target.toString().length
  while (len < n) {
    target = '0' + target
    len++
  }
  return target
}
var hexIn = false
var hexOut = false
var base64EncodeChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
var base64DecodeChars = new Array(
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  62,
  -1,
  -1,
  -1,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  -1,
  -1,
  -1,
  -1,
  -1
)
function base64encode(str) {
  var out, i, len
  var c1, c2, c3
  var charCode
  len = str.length
  i = 0
  out = ''
  while (i < len) {
    c1 = (hexIn ? str[i++] : str.charCodeAt(i++)) & 0xff
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = hexIn ? str[i++] : str.charCodeAt(i++)
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xf) << 2)
      out += '='
      break
    }
    c3 = hexIn ? str[i++] : str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3f)
  }
  return out
}
function base64decode(str) {
  var c1, c2, c3, c4
  var i, len, out
  var charCode
  len = str.length
  i = 0
  out = hexOut ? [] : ''
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1)
    if (c1 == -1) break
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1)
    if (c2 == -1) break
    charCode = (c1 << 2) | ((c2 & 0x30) >> 4)
    hexOut ? out.push(charCode) : (out += String.fromCharCode(charCode))
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff
      if (c3 == 61) return out
      c3 = base64DecodeChars[c3]
    } while (i < len && c3 == -1)
    if (c3 == -1) break
    charCode = ((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2)
    hexOut ? out.push(charCode) : (out += String.fromCharCode(charCode))
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff
      if (c4 == 61) return out
      c4 = base64DecodeChars[c4]
    } while (i < len && c4 == -1)
    if (c4 == -1) break
    charCode = ((c3 & 0x03) << 6) | c4
    hexOut ? out.push(charCode) : (out += String.fromCharCode(charCode))
  }
  return out
}
function utf16to8(str) {
  var out, i, len, c
  var charCode
  out = hexIn ? [] : ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = hexIn ? str[i] : str.charCodeAt(i)
    if (c >= 0x0001 && c <= 0x007f) {
      hexIn ? out.push(str[i]) : (out += str.charAt(i))
    } else if (c > 0x07ff) {
      charCode = 0xe0 | ((c >> 12) & 0x0f)
      hexIn ? out.push(charCode) : (out += String.fromCharCode(charCode))
      charCode = 0x80 | ((c >> 6) & 0x3f)
      hexIn ? out.push(charCode) : (out += String.fromCharCode(charCode))
      charCode = 0x80 | ((c >> 0) & 0x3f)
      hexIn ? out.push(charCode) : (out += String.fromCharCode(charCode))
    } else {
      charCode = 0xc0 | ((c >> 6) & 0x1f)
      hexIn ? out.push(charCode) : (out += String.fromCharCode(charCode))
      charCode = 0x80 | ((c >> 0) & 0x3f)
      hexIn ? out.push(charCode) : (out += String.fromCharCode(charCode))
    }
  }
  return out
}
function utf8to16(str) {
  var out, i, len, c
  var char2, char3
  var charCode
  out = hexOut ? [] : ''
  len = str.length
  i = 0
  while (i < len) {
    c = hexOut ? str[i++] : str.charCodeAt(i++)
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        hexOut ? out.push(str[i - 1]) : (out += str.charAt(i - 1))
        break
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = hexOut ? str[i++] : str.charCodeAt(i++)
        charCode = ((c & 0x1f) << 6) | (char2 & 0x3f)
        hexOut ? out.push(charCode) : (out += String.fromCharCode(charCode))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = hexOut ? str[i++] : str.charCodeAt(i++)
        char3 = hexOut ? str[i++] : str.charCodeAt(i++)
        charCode =
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        hexOut ? out.push(charCode) : (out += String.fromCharCode(charCode))
        break
    }
  }
  return out
}
function CharToHex(str) {
  var out, i, len, c, h
  out = ''
  len = str.length
  i = 0
  while (i < len) {
    c = str.charCodeAt(i++)
    h = c.toString(16)
    if (h.length < 2) h = '0' + h
    out += '\\x' + h + ' '
    if (i > 0 && i % 8 == 0) out += '\r\n'
  }
  return out
}
function base64_encode(src, hI) {
  hexIn = hI
  return base64encode(hexIn ? src : utf16to8(src))
}
function base64_decode(src, hO, out_de) {
  hexOut = hO
  var ret = base64decode(src)
  if (!hexOut || out_de == 'u' || out_de == 'd') {
    ret = utf8to16(ret)
  }
  return ret
}
function base64_gb2312(src, op) {
  var ret = ''
  $.ajax({
    url: '/ajax/base64_gb2312.php?type=' + op,
    data: {
      data: src
    },
    async: false,
    type: 'POST',
    success: function (e) {
      ret = e
    }
  })
  return ret
}
function base64_encode_gb2312(src) {
  return base64_gb2312(src, 'encode')
}
function base64_decode_gb2312(src) {
  return base64_gb2312(src, 'decode')
}
