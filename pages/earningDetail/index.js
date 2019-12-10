// pages/upList/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upLists: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //充值提现记录
  upList: function () {
    var that = this
    util.request('pay/getDistributionList', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        for (var i = 0; i < res.data.content.length; i++) {
          // console.log(res.data.content[i].type)
          // if(res.data.content[i].type == 1){
          //   console.log(res.data.content[i])
          //   res.data.content[i].typeText == '合伙人收益'
          // } else if (res.data.content[i].type == 2) {
          //   console.log(res.data.content[i].type)
          //   res.data.content[i].type == '代理收益'
          // }
          // console.log(res.data.content[i])
          if (res.data.content[i].createtime) {
            res.data.content[i].createtime1 = res.data.content[i].createtime + 3600 * 24 * 15 * 1000
            res.data.content[i].createtime = util.formatTimes(res.data.content[i].createtime)
            res.data.content[i].createtime1 = util.formatTimes(res.data.content[i].createtime1)
            // console.log(res.data.content[i])
          }

        }
        that.setData({
          upLists: res.data.content,
        })
        console.log(that.data.upLists)
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
    this.upList()
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