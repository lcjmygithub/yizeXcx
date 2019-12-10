// pages/recharge/index.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMax: 0, //可用余额
    isRecharges: true, //是否显示充值或者提现
    recharges: '', // 充值金额
    upMoney: '', //提现金额
    name: '', //开户姓名
    card: '', //提现卡号
    blank: '', //提现银行
    // isModel:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      totalMax: wx.getStorageSync('totalMoney') || 0
    })
  },
  //充值方法
  upChange1: function (e) {
    let that = this
    console.log(e)
    let query = e.currentTarget.dataset['index'];
    that.setData({
      upMoney: '', //提现金额
      name: '', //开户姓名
      card: '', //提现卡号
      blank: '', //提现银行
    })
    let data = {
      money: that.data.recharges
    }
    if (!that.data.recharges) {
      util.errorTip('请输入充值金额')
      return;
    } else {
      if (Number(that.data.recharges) > Number(that.data.totalMax)) {
        util.errorTip('可用余额不足')
        return;
      }
      if (that.data.recharges <= 0) {
        util.errorTip('请输入合法金额')
        return;
      }
    }
    util.request('pay/saveOrUpdateDistributionCash?state=' + query, data, 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        wx.showToast({
          title: '申请已提交',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          recharges: '',
        })
        setTimeout(function(){
          wx.redirectBack({
            url: '/pages/myearnings/index'
          })
        },2000)
        // wx.redirectTo({
        //   url: '/pages/myearnings/index'
        // })
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },
  //提现方法
  upChange2: function (e) {
    let that = this
    console.log(e)
    let query = e.currentTarget.dataset['index'];
    that.setData({
      recharges: '',
    })
    let data = {
      bankcard: that.data.card,
      bankname: that.data.blank,
      cardname: that.data.name,
      money: Number(that.data.upMoney)
    }
    if (!that.data.card || !that.data.blank || !that.data.name || !that.data.upMoney) {
      util.errorTip('请完善表单信息!')
      return
    } else {
      if (Number(that.data.upMoney) > Number(that.data.totalMax)) {
        util.errorTip('可用余额不足')
        return;
      }
      if (that.data.upMoney <= 0){
        util.errorTip('请输入合法金额')
        return;
      }
    }
    util.request('pay/saveOrUpdateDistributionCash?state=' + query, data, 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        wx.showToast({
          title: '申请已提交',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          upMoney: '', //提现金额
          name: '', //开户姓名
          card: '', //提现卡号
          blank: '', //提现银行
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/myearnings/index'
          })
        }, 2000)
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },
  //提示银行卡的弹框
  isModel: function () {
    console.log(1)
    wx.showModal({
      title: '持卡人说明',
      content: '为了资金安全,只能绑定当前持卡人的银行卡',
      confirmText: "知道了",
      showCancel: false,
      // success(res) {
      //   if (res.confirm) {
      //     console.log('用户点击确定')
      //   }
      // }
    })
  },
  //获取充值表单数据
  submitUp: function (e) {
    var value = this.validateNumber(e.detail.value)
    console.log(e.detail.value)
    this.setData({
      recharges: value
    })

    if (Number(this.data.recharges) > Number(this.data.totalMax)) {
      util.errorTip('可用余额不足')
    }

  },
  //正则数字
  validateNumber(val) {
    // return val.replace(/\D/g, '')
    return val.replace(/[^\d.]/g, "").replace (/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  },

  //获取提现菜单数据
  //提现金额
  submitadd: function (e) {
    var value = this.validateNumber(e.detail.value)
    this.setData({
      upMoney: value
    })
    if (Number(this.data.upMoney) > Number(this.data.totalMax)) {
      util.errorTip('可用余额不足')
    }
  },
  //姓名
  submitName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //卡号
  submitCard: function (e) {
    // var card = e.detail.value
    var card = this.validateNumber(e.detail.value)

    this.setData({
      card: card
    })
  },
  //银行
  submitBlank: function (e) {
    this.setData({
      blank: e.detail.value
    })
  },
  isRecharge: function () {
    this.setData({
      isRecharges: !this.data.isRecharges
    })
    if (!this.data.isRecharges) {
      wx.setNavigationBarTitle({
        title: '提现'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '充值'
      })
    }

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
    this.setData({
      totalMax: wx.getStorageSync('totalMoney') || 0
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