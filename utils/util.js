const formatTime = date => {
  // date = new Date(date);
  // date = newDate(date) 
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formats = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTimes = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return month + "月" + day + "日"
}


//正则判断
function Regular(str, reg) {
  if (reg.test(str))
    return true;
  return false;
}
//验证银行卡号的正则
function check(content) {
  var regex = /^(998801|998802|622525|622526|435744|435745|483536|528020|526855|622156|622155|356869|531659|622157|627066|627067|627068|627069)\d{10}$/;
  if (regex.test(content)) {
    return true;
  }
  return false;
}
//ajax方法封装
function request(url, data, method, resolve) {
  var data1 = data;
  var url1 = url;
  wx.request({
    url: 'https://yize.kefu7.com/' + url,
    // url: 'https://yize.kefu7.com/' + url,
    header: {
      'content-type': 'application/json',
      'Authorization': wx.getStorageSync('token')
    },
    data: data,
    method: method,
    success: (data) => {
      if(data.data.code == 11005){
        //         console.log(data.data.code)
        // console.log(wx.getStorageSync("loginState"))
        wx.setStorageSync('loginState', false)
        // errorTip('登陆失效')
        wx.switchTab({
          url: '/pages/task/task'
          // url: '/pages/index/index'
        })
        // console.log(data.code)
      }
      resolve(data)
    },
    fail: function() {
      wx.hideLoading();
      console.log(11)
      // fail();
      wx.request({//超时公众号接口反馈(app.json设置超时时间 当前为20s)
        url: 'http://123.56.24.229/wx_api2/rest/?action=sendEarlyWarningMessage&title=%E6%8E%A5%E5%8F%A3%E5%BB%B6%E6%97%B6&remark=' + data1 + '&content=' + url1 + '&userid=1992',

        method: method,
        success: {},
        fail: function () {

        }
      })
      wx.showModal({
        title: '提示',
        content: "加载超时!",
        success: function (res) { }
      })
    }
  })
}


//错误提示
function errorTip(text, error) {
  if(text == 'undefined' || text == '' || !text){
    text = '服务器繁忙'
  }
  wx.showToast({
    title: text,
    image: "/img/error.png",
    duration: 3000
  })
}
//获取音频的长度
function audioSize(src1) {
  var bgM = wx.createInnerAudioContext();
  bgM.src = src1;
  console.log(bgM.duration);
  bgM.onCanplay(() => {
    console.log(bgM.duration)
  })
  bgM.play();
  bgM.onPlay(() => {
    console.log(bgM.duration)
  })
  console.log(bgM.duration)
  //return bgM.duration;
  setTimeout(() => {
    console.log(bgM.duration)
    return bgM.duration;
  }, 1000)
}
//时间戳转换时间
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}

//判断屏幕是左划还是右
function getTouchData(endX, endY, startX, startY) {
  let turn = "";
  if (endX > startX) { //右滑
    turn = "right";
  } else { //左滑
    turn = "left";
  }
  return turn;
}

module.exports = {
  toDate: toDate,
  Regular: Regular,
  request: request,
  errorTip: errorTip,
  getTouchData: getTouchData,
  audioSize: audioSize,
  formatTime: formatTime,
  formatTimes,
  formats,
  check,
}