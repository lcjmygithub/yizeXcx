// pages/rechgeMys/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blance: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  searchValueInput: function (e) {
    let that = this
    // var re = /^\d*\.{0,1}\d{0,1}$/;
    // // re.exec(num) != null;
    // console.log(re.exec(e.detail.value))
    // console.log(e.detail.value)
    e.detail.value = e.detail.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')
    console.log(e.detail.value)
    that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
      blance: e.detail.value,
    })
  },
  rechage: function () {
    console.log(123)
    let that = this;
    if (!that.data.blance) {
      // that.toast("", "请输入充值金额!");
      util.errorTip('请输入充值金额!')
      return;
    }
    // let data = { fee: this.data.blance };
    // if (openid) {
    var openid = wx.getStorageSync('openid');
    util.request(`pay/miniProgramPay?fee=${this.data.blance}&openid=${openid}`, '', 'get', function (res) {
      // console.log(res.data.content);
      if (res.data.code == 10000) {
        // let packages = res.data.content.packages
        // console.log(res.data.content.package)
        // console.log(res.data.content.packages + openid)
        wx.requestPayment({
          appId: res.data.content.appid,
          timeStamp: res.data.content.timeStamp,
          nonceStr: res.data.content.nonceStr1,
          package: res.data.content.packages,
          signType: "MD5",
          paySign: res.data.content.paySign,
          success: function (res) {
            console.log(res)
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/mys/index'
                    })
                  }, 1500);
                }
              });
              that.data.blance = ''
            } else {
              console.log('zhifushibai')
            }
          },
          fail: function (res) {
            console.log(111);
            wx.showToast({
              title: "支付失败",
              icon: "none",
              duration: 2000,
              success: function () { }
            });
          }
        });
      }
    });
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