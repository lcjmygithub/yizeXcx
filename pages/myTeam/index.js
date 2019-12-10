// pages/myTeam/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamLists: [],
    state: 1,
    openid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { //options用于接收上个页面传递过来的参数
    var that = this;
    console.log(options)
    if (options.state) {
      that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
        state: options.state, //id是a页面传递过来的名称，a_id是保存在本页面的全局变量   {{b_id}}方法使用
        openid:options.openid,
      })
      console.log(this.data.state)
    }
  },

  //获取我的团队
  teamList: function(e) {
    var that = this
    // var id = e.currentTarget.dataset.taskid
    util.request('pay/getDistributionTeam?state=' + this.data.state + '&openid=' + this.data.openid, '', 'get', function(res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({
          teamLists: res.data.content
        })
        console.log(res.data.content)
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
    this.teamList()
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