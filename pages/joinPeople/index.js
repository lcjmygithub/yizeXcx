// pages/joinPeople/index.js
const app = getApp();
var postfix = '_deadtime';
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    telNum: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ispanter()
  },
  validateNumber(val) {

    return val.replace(/\D/g, '')
  },
  name(e) {
    // console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  telNum(e) {
    var value = this.validateNumber(e.detail.value)
    this.setData({
      telNum: value
    })
  },
  //判断是否为合伙人 /pay/isDistributionCash
  ispanter: function () {
    var that = this
    util.request('/pay/isDistributionCash', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        if (res.data.content == 1) {
          wx.setStorageSync('isPartner', true)
          that.setData({
            ponerUrl: "../../pages/partner/index",
            text: '合伙人'
          })
        } else if (res.data.content == 2) {
          wx.setStorageSync('isPartner', false)
          that.setData({
            ponerUrl: "../../pages/joinPeople/index"
          })
        }

      } else {
        util.errorTip(res.data.content + '')
        // console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  //申请加入
  joinTeam: function (e) {
    var that = this
    if (!that.data.name || !that.data.telNum) {
      util.errorTip("请填写完整表单!")
      return;
    }
    var data = {
      realname: that.data.name,
      realphone: that.data.telNum
    }
    util.request('/pay/beDistribution', data, 'get', function (res) {
      if (res.data.code == 10000) {
        wx.navigateTo({
          url: '/pages/partner/index'　　 // 页面 A
        })
        wx.showToast({
          title: '申请已提交成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
        // 跳转到tabBar页面（在app.json中注册过的tabBar页面），同时关闭其他非tabBar页面。
        // wx.switchTab({
        //   url: '/pages/task/task'
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.ispanter()
    if (wx.getStorageSync('loginState')) {
      // this.getTaskList();
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先授权登录哦',
        success(res) {
          if (res.confirm) {
            // console.log(1)
            // wx.setStorageSync('isIndex', true)
            // wx.switchTab({
            //   url: '/pages/index/index'
            // })
            // console.log('用户点击确定')
            // wx.reLaunch({
            //   url: '/pages/index/index?isIndex=true'
            // })
            that.bindGetUserInfo()
          }
        }
      })
    }
  },
  //获取用户信息
  bindGetUserInfo: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.login({
      success: res => {
        wx.request({
          url: 'https://yize.kefu7.com/open/getPhoneNumber',
          data: {
            'code': res.code
          },
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          }, // 设置请求的 header
          success: function (res) {
            if (res.data.code == "10000") {
              console.log(res)
              //存入缓存即可
              wx.hideLoading();
              // wx.setStorageSync('phone', res.phone);
              wx.setStorageSync('token', res.data.content.authorization);
              wx.setStorageSync('linkcmpid', res.data.content.ztCompany.companyid);
              wx.setStorageSync('loginState', true, 29940000)
              wx.setStorageSync('link', false);
              wx.setStorageSync('phone', res.data.content.ztGuser.phone)
              wx.setStorageSync('userid', res.data.content.ztGuser.userId)
              wx.setStorageSync('openid', res.data.content.ztGuser.openId)
              that.setData({
                loginState: true
              })
              console.log(that.data.loginState)
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.content,
                success: function (res) { }
              })
              that.setData({
                loginState: false
              })
            }
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})