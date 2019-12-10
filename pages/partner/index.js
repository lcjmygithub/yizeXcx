// pages/partner/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerLists: [],
    distributiontime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取合伙人信息
  partnerList: function (e) {
    var that = this
    // var id = e.currentTarget.dataset.taskid
    util.request('pay/getDistributionMsg', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({
          partnerLists: res.data.content[0],
          distributiontime: util.formats(res.data.content[0].distributiontime || 0)
        })
        console.log(that.data.distributiontime)
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },
  // / pay / checkDistributionLog
  //分销金额可用判断/checkDistributionLog
  ismoney: function () {
    var that = this
    util.request('pay/checkDistributionLog', '', 'get', function (res) {
      // if(res.data.code ===)
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
    this.partnerList()
    this.ismoney()
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
    console.log(123)
    wx.switchTab({
      url: '/pages/mys/index'
    })
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