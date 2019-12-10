// pages/logs/index.js
const app = getApp();
var postfix = '_deadtime';
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: wx.getStorageSync('loginState'),
    avatarUrl: '',
    userInfo: {},
    balance: '', //余额
    etime: '', //过期时间
    phone: '',
    text:'成为合伙人',
    ponerUrl:'../../pages/joinPeople/index', //成为合伙人的url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //微信获取信息为请求(异步)
    if (wx.getStorageSync('loginState')) {
      this.searchBranch()
      this.ispanter()
      // this.getWxUserInfo();
    } else {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '请先授权登录哦',
      //   success(res) {
      //     if (res.confirm) {
      //       console.log(1)
      //       wx.switchTab({
      //         url: '/pages/index/index?isIndex=true',
      //       })
      //       // wx.reLaunch({
      //       //   url: '/pages/index/index?isIndex=true',
      //       // })
      //     }
      //   }
      // })
    }
  },
  //检查是否有头像
  // getWxUserInfo: function () {
  //   if (this.data.avatarUrl) {//如果已经有头像了，则退出
  //     return;
  //   }
  //   console.log('do-getWxUserInfo')
  //   if (!app.globalData.userInfo.avatarUrl) { //判断是否登录获取到头像
  //     //登录信息中没有
  //     if (wx.getStorageSync("userData").imageUrl) {//判断缓存中是否有头像
  //       this.setData({
  //         // avatarUrl: wx.getStorageSync("userData").avatarUrl
  //         userInfo: wx.getStorageSync("userData")
  //       })
  //       return;
  //     }
  //     setTimeout(() => {
  //       this.getWxUserInfo();
  //     }, 500)
  //   } else {
  //     this.setData({
  //       // avatarUrl: app.globalData.userInfo.avatarUrl
  //       userInfo: wx.getStorageSync("userData")
  //     })
  //   }
  // },
  //查询余额
  searchBranch: function (e) {
    var that = this
    util.request('/pay/getBalance', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({
          balance: res.data.content.balance,
          etime: res.data.content.endtime
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  //判断是否为合伙人 /pay/isDistributionCash
  ispanter: function () {
    var that = this
    util.request('/pay/isDistributionCash', '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        if(res.data.content == 1){
          wx.setStorageSync('isPartner', true)
          that.setData({
            ponerUrl:"../../pages/partner/index",
            text:'合伙人'
          })
        }else if(res.data.content == 2){
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
    if (wx.getStorageSync('loginState')) {
      this.searchBranch()
      this.ispanter()
      this.setData({
        phone: wx.getStorageSync('phone')
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先授权登录哦',
        success(res) {
          if (res.confirm) {
            console.log(1)
            wx.setStorageSync('isIndex', true)
            // wx.switchTab({
            //   url: '/pages/index/index'
            // })
            wx.reLaunch({
              url: '/pages/index/index?isIndex=true'
            })
          }
        }
      })
    }
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