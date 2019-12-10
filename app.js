//app.js
App({
  onLaunch: function () {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //验证用户是否登陆超时
    wx.checkSession({
      success: function (res) {
        //session 未过期，并且在本生命周期一直有效
        that.getUserData();
      },
      fail: function () {
        //登录态过期,重新获取用户信息
        that.getUserData();
        return false;
      }
    })

  },
  getUserData: function () {
    let that = this;
    // 获取用户openid并访问注册接口  https://localhost:5433/open/getPhoneNumber?code=011aoanm1uTp7q0OMblm1aDenm1aoanW
    wx.login({
      success: function (res) {
        console.log(res);
        // wx.request({
        //   url: that.globalData.url + '/open/getPhoneNumber',
        //   method: 'POST',
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   data: { code: res.code },
        //   success: function (res) {
        //     if(res.data.code == '10000'){
        //       // console.log(res.data.content.authorization)
        //       wx.setStorageSync('token', res.data.content.authorization);
        //     }
        //     console.log('这是打印openid之前的一句话');
        //     console.log(res);
        //     console.log('这是打印openid之后的一句话');
        //     that.globalData.openid = res.data.openid;
        //     wx.setStorageSync('openid', res.data.openid);
        //     var user = {};
        //     user.wechat = res.data.openid;
        //     if (res.data.openid) {
        //       wx.request({
        //         url: that.globalData.url + '/mallUserController/addMallUser.do',
        //         data: user,
        //         success: (res) => {
        //           if (res.data == 0) {
        //             console.log('注册成功，新增用户成功');
        //           } else {
        //             console.log('您已经成功授权过啦');
        //           }
        //         }
        //       });
        //     }
        //   }
        // });
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log(res)
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(this.globalData.userInfo)
              wx.setStorageSync('userData', this.globalData.userInfo)
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)

              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: {},
    appid:wx.getAccountInfoSync().miniProgram.appId,
    url: 'https://yize.kefu7.com:5433',
    // url: 'http://192.168.3.234:8082/',
    // prefixAudio: 'http://47.94.89.73:37179/zrobot/',//上传录音前缀
    // allPrefixAudio: "https://zvoice.oss-cn-beijing.aliyuncs.com/cerec",//机器人整段录音前缀
    // partPrefixAudio: "https://zvoice.oss-cn-beijing.aliyuncs.com/cezrobot/",//机器人片段录音前缀
    prefixAudio: 'http://39.106.25.179:37179/zrobot/',//上传录音前缀
    allPrefixAudio: "https://zvoice.oss-cn-beijing.aliyuncs.com/rec",//机器人整段录音前缀
    partPrefixAudio: "https://zvoice.oss-cn-beijing.aliyuncs.com/zrobot/",//机器人片段录音前缀
    openid: ''
  }
})