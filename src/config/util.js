function jsRight(sr, rightn) {
  return sr.substring(sr.length - rightn, sr.length);
}

function getNow(type) {
  var date = new Date();
  var a = date.getFullYear();
  var b = jsRight(('0' + (date.getMonth() + 1)), 2);
  var c = jsRight(('0' + date.getDate()), 2);
  var d = jsRight(('0' + date.getHours()), 2);
  var e = jsRight(('0' + date.getMinutes()), 2);
  var f = jsRight(('0' + date.getSeconds()), 2);
  var output;
  switch (type) {
    case 0:
      output = a + '年' + b + '月' + c + '日';
      break;
    case 1:
      output = a + '-' + b + '-' + c + ' ' + d + ':' + e + ':' + f;
      break;
    case 2:
      output = a + '年' + b + '月' + c + '日' + d + '时' + e + '分' + f + '秒';
      break;
    case 3:
      output = a + '-' + b + '-' + c + ' ' + d + ':' + e;
      break;
    case 4:
      output = a + '年' + b + '月' + c + '日  ' + d + '时' + e + '分';
      break;
    case 5:
      output = b + '/' + c + '/' + a;
      break;
    case 6:
      output = a + '-' + b + '-' + c;
      break;
    case 7:
      output = a + '-' + b;
      break;
    case 8:
      output = a + b + c;
      break;
  }
  return output;
}

export default {
  getNow
};
