import settings from './settings'

function jsRight (sr, rightn) {
  return sr.substring(sr.length - rightn, sr.length)
}

function getNow (type = 1) {
  let date = new Date()

  let a = date.getFullYear()
  let b = jsRight(('0' + (date.getMonth() + 1)), 2)
  let c = jsRight(('0' + date.getDate()), 2)
  let d = jsRight(('0' + date.getHours()), 2)
  let e = jsRight(('0' + date.getMinutes()), 2)
  let f = jsRight(('0' + date.getSeconds()), 2)
  let output
  switch (type) {
    case 0:
      output = a + '年' + b + '月' + c + '日'
      break
    case 1:
      output = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f
      break
    case 2:
      output = a + '年' + b + '月' + c + '日' + d + '时' + e + '分' + f + '秒'
      break
    case 3:
      output = a + '-' + b + '-' + c + ' ' + d + ':' + e
      break
    case 4:
      output = a + '年' + b + '月' + c + '日  ' + d + '时' + e + '分'
      break
    case 5:
      output = b + '/' + c + '/' + a
      break
    case 6:
      output = a + '-' + b + '-' + c
      break
    case 7:
      output = a + '-' + b

      break
    case 8:
      output = a + b + c
      break
  }
  return output
}

function parseHtml (html) {
  if (html === '') {
    return html
  }
  // special chacters convert,see from http://stackoverflow.com/questions/19176024/how-to-escape-special-characters-in-building-a-json-string
  html = JSON.stringify(html)
  // 转换后应去除首尾引号
  return html.slice(1, html.length - 1)
}

function handleAttach (html) {
  if (typeof html == 'undefined' || html == '') {
    return ''
  }
  var arrAttach = html.match(/<img \b[^>]*>/g)
  var linkStr
  var i = 1
  if (null == arrAttach) {
    return html
  }

  // rar/txt/docx/xlsx/pptx/zip/audio 类型附件正常显示

  function handleFileFormat (str) {
    // rar
    str = str.replace('href="data:;base64,UmFyI', ' download="附件.rar" href="data:application/x-rar-compressed;base64,UmFyI')

    // txt
    str = str.replace('href="data:text', ' download="附件.txt" href="data:text')

    return str
  }

  arrAttach.map(item => {
    if (item.includes('src="data:')) {
      if (item.includes('src="data:audio/')) {
        linkStr = item.replace('<img src=', '<audio controls="controls" autoplay="true" src=')
        html = html.replace(item, linkStr)
      } else if (!item.includes('src="data:image')) {
        linkStr = item.replace('<img src="', '<a target="_blank" href="').replace('>', '><strong class="attach"> 附件' + i + ' </a></strong>')
        linkStr = handleFileFormat(linkStr)
        html = html.replace(item, linkStr)
        i++
      }
    }
  })
  return html
}

function handleContent (data) {
  data.map((item, i) => {
    data[i].content = handleAttach(item.content)
  })
  return data
}

function getAllReceiver () {
  let userList = settings.rtxInfo
  let user = []
  for (var key in userList) {
    if (key != 'verify' && key != 'reward') {
      userList[key].forEach(item => {
        user.push(item.id)
      })
    }
  }
  return user.join(',')
}

export default {
  getNow,
  parseHtml,
  handleContent,
  handleAttach,
getAllReceiver}
