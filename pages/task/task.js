// pages/task/task.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // login: wx.getStorageSync('loginState'),
    taskList: [],
    date: util.formats(new Date()),
    getValue: '', //搜索文本框的值
    isDate: false, //是否显示日期
    isState: false, //是否显示状态
    array: ['默认', '进行中', '已暂停', '已完成'],
    // array: [{ value: '已开启', state: 1 }, { value: '已暂停', state: 2 }, { value: '已结束', state: 2 }],
    pageSize: 10,
    stime: '',
    etime: '',
    state: '',
    cmpid: '', //公司id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    console.log(wx.getStorageSync('loginState'))
    if (wx.getStorageSync('loginState')) {
      if (options.date) {
        console.log(options)
        that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
          cmpid: options.cmpid || "",
          stime: options.date + ' 00:00:00',
          etime: options.date + ' 23:59:59',
        })
        this.getTaskList()
      }
      // if (!wx.get){
      // }
    } else {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '请先授权登录哦',
      //   success(res) {
      //     if (res.confirm) {
      //       console.log(1)
      //       wx.setStorageSync('isIndex', true)
      //       console.log(2)
      //       // wx.reLaunch({
      //       //   url: '/pages/index/index'
      //       // })
      //     }
      //   }
      // })
    }

  },
  //搜索
  searchName: function() {
    console.log(1)
    this.getTaskList()
  },
  getTaskList: function(state) {
    var that = this;
    var data = {
      taskname: that.data.getValue,
      cmpid: that.data.cmpid
    }
    util.request('task/getSaleTaskCall?pageNo=1&pageSize=' + this.data.pageSize + '&stime=' + this.data.stime + '&etime=' + this.data.etime + '&state=' + this.data.state, data, 'get', function(res) {
      if (res.data.code == 10000) {
        if (that.data.pageSize == 10) {
          if (res.data.content.list.length == 0) {
            // util.errorTip('暂无数据')
          }
        } else {
          if (res.data.content.list.length < 10) {
            // util.errorTip('没有更多数据了')
          }
        }
        var taskArr = [];
        for (var i = 0; i < res.data.content.list.length; i++) {
          console.log(res.data.content.list[i].createtime)

          res.data.content.list[i].createtime = util.formatTime(res.data.content.list[i].createtime)
        }
        that.setData({
          taskList: res.data.content.list
        })
        // if (!res.data.content.list.length) {
        //   util.errorTip("没有更多数据了")
        // }
        // console.log(this.data.taskList)
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
    if (!state) {
      wx.hideLoading();
    }
  },
  //获取搜索文本框的值
  getVal(e) {
    console.log(e.detail.value)
    this.setData({
      getValue: e.detail.value,
    })
    this.getTaskList()
  },
  //暂停开始任务 https://localhost/sale/updateSaleTaskCallFlag?taskid=4098
  changeTask: function(e) {
    var that = this
    var id = e.currentTarget.dataset.taskid
    var callflag = e.currentTarget.dataset.callflag
    var title = ''
    if (callflag == 1) {
      title = '任务暂停成功'
    } else {
      title = '任务开启成功'
    }
    util.request('sale/updateSaleTaskCallFlag?taskid=' + id, '', 'get', function(res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({})
        that.getTaskList()
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },
  //时间选择
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      stime: e.detail.value + ' 00:00:00',
      etime: e.detail.value + ' 23:59:59',
      isDate: true,
    })
    this.getTaskList()
  },
  //状态选择器 isState
  bindPickerChange: function(e) {
    console.log(e.detail.value)
    var state = null
    if (e.detail.value == 0) {
      state = ''
    } else if (e.detail.value == 3) {
      state = 4
    } else {
      state = e.detail.value
    }
    this.setData({
      index: e.detail.value,
      isState: true,
      state: state
    })
    this.getTaskList()
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
    var that = this
    // console.log(wx.getStorageSync('loginState'))
    if (wx.getStorageSync('loginState')) {
      this.getTaskList();
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
            console.log('用户点击确定')
            wx.reLaunch({
              url: '/pages/index/index?isIndex=true'
            })
          }
        }
      })
    }
    this.setData({
      stime: '',
      etime: '',
      state: '',
      isDate: false, //是否显示日期
      isState: false, //是否显示状态
    })
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
    var that = this;
    // console.log(that.data.maxPageNo)
    // if (!that.data.maxPageNo) {
    //   return;
    // }
    wx.showLoading({
      title: '加载中',
      duration: 2000
    })
    wx.showNavigationBarLoading();
    that.setData({
      pageSize: that.data.pageSize + 10
    })
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      that.getTaskList();
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})