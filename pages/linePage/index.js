// pages/linePage/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 20,
    total: null,
    listData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLineData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getLineData: function() {
    console.log(111)
    let that = this;
    util.request(`channel/getLineInfo?pageNo=1&pageSize=${this.data.pageSize}`, '', 'get', function(res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({
          listData: res.data.content.list,
          total: res.data.content.totalCount
        })
        wx.hideNavigationBarLoading();
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
    // if (!state) {
    //   wx.hideLoading();
    // }
  },
  cacalLine: function(e) {
    let that = this
    util.request(`channel/delNumberConf?phone=${e.currentTarget.dataset.phone}`, '', 'get', function(res) {
      if (res.data.code == 10000) {
        that.getLineData()
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  useLine: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.phone)
    util.request(`channel/saveNumberConf?phone=${e.currentTarget.dataset.phone}`, '', 'get', function(res) {
      if (res.data.code == 10000) {
        that.getLineData()
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getLineData()
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      pageSize: that.data.pageSize + 10
    })
    wx.showLoading({
      title: '加载中',
      duration: 2000
    })
    if (that.data.pageSize >= that.data.total) {
      util.errorTip('没有更多数据了')
    }
    this.getLineData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})