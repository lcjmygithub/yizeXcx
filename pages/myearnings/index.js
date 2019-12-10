// pages/myearnings/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    learnList:{},//收益列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //我的收益
  myLearn: function (e) {
    var that = this
    // var id = e.currentTarget.dataset.taskid
    util.request('pay/getDistributionProfit', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({
          learnList:res.data.content[0]
        })
        wx.setStorageSync('totalMoney', res.data.content[0].cash)
        // that.getTaskList()
        // wx.showToast({
        //   title: '任务修改成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
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
    this.myLearn()
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