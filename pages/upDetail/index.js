// pages/upDetail/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashid: '',
    upDetailList: {},
    upTime:'', //提现时间
    timeing:'' //操作时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { //options用于接收上个页面传递过来的参数
    var that = this;
    console.log(options)
    that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
      cashid: options.cashid,
    })
  },
  //获取提现详情列表
  upDetails: function(e) {
    var that = this
    // var id = e.currentTarget.dataset.taskid
    util.request('pay/getOneDistributionCash?cashid=' + this.data.cashid, '', 'get', function(res) {
      if (res.data.code == 10000) {
        console.log(res)
        if (res.data.content.operatetime){
          that.setData({
            timeing: util.formatTime(res.data.content.operatetime),
          })
        }
        that.setData({
          upDetailList: res.data.content,
          upTime: util.formatTime(res.data.content.applytime || 0),
        })
        console.log(that.data.upDetailList)
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.upDetails()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})