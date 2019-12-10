// pages/taskDetail/taskDetail.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isload: false,
    isShowTime:false,
    loginState: wx.getStorageSync('loginState'),//验证是否登入
    task_id: '', //当前任务id
    isTaskOpen: false, //任务是否开启
    detailList: {
    },
    isread: '', //已读未读
    // pageNo:1,
    pageSize: 10,
    callAllList: [], // 通话记录列表
    array: ['默认', '已读', '未读'],
    // arrayTest:['默认','有明确意向','有可能有意向','明确拒接','用户忙碌','拨打失败','无效客户','忠实客户'],
    iclevelid: '', //选中意向等级
    state: '', //状态
    objectArrayTest: [],
    index: 0,
    index1: 0,
    isState: false, //是否显示状态
    isTime: false,//是否显示意向
    isLong: false, //是否显示时长
    maxCallTime: '', //最大时长
    minCallTime: '',//最小时长
  },

  customerDetails: function (e) {
    var saleid = e.currentTarget.dataset.saleid;
    var isread = e.currentTarget.dataset.isread;
    var index = e.currentTarget.dataset.index;
    var data1 = "datainfo[" + index + "].isread"
    this.setData({
      [data1]: 1,
    })
    wx.navigateTo({
      url: '../callPages/index?saledataid=' + saleid + '&cmpid=' + wx.getStorageSync("linkcmpid")
      // url: '../callPages/index?saledataid=250650&cmpid=' + wx.getStorageSync("linkcmpid")
    })
  },
  //暂停开始任务 https://localhost/sale/updateSaleTaskCallFlag?taskid=4098
  changeTask: function (e) {
    var that = this

    var id = e.currentTarget.dataset.taskid
    var callflag = e.currentTarget.dataset.callflag
    console.log(e.currentTarget.dataset.taskid)
    console.log(e.currentTarget.dataset.callflag)
    var title = ''
    if (callflag == 1) {
      title = '任务暂停成功'
    } else {
      title = '任务开启成功'
    }
    util.request('sale/updateSaleTaskCallFlag?taskid=' + id, '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        that.setData({})
        that.getTaskDetail()
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  //获取通话列表 https://yize.kefu7.com/sale/getTaskDetail?taskid=3926
  getCallList: function (id) {
    var that = this
    var data = {
      iclevelid: that.data.iclevelid,
      isread: that.data.isread,
      pageNo: 1,
      pageSize: that.data.pageSize,
      minCallTime: this.data.minCallTime,
      maxCallTime: this.data.maxCallTime
    }
    console.log(data)
    util.request('sale/getCallRecord?taskid=' + this.data.task_id, data, 'get', function (res) {
      if (res.data.code == 10000) {
        that.setData({
          isShowTime: false,
        })
        if (data.minCallTime || data.maxCallTime){
          // console.log(12345)
          that.setData({
            isLong: true,
          })
        }
        console.log(that.data.pageSize)
        if (that.data.pageSize == 10) {
        } else {
          if (res.data.content.list.length < 10) {
            // util.errorTip('没有更多数据了')
          }
        }
        that.setData({
          // callAllList: that.data.callAllList.concat(res.data.content.list)
          callAllList: res.data.content.list
        })
        // if (!res.data.content.list.length){
        //   util.errorTip("没有更多数据了")
        // }
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })

  },
  //状态选择器 isState
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    var state = null
    if (e.detail.value == 0) {
      state = ''
    } else {
      state = e.detail.value
    }
    this.setData({
      index1: e.detail.value,
      isState: true,
      isread: state
    })
    this.getCallList()
  },
  //点击显示获取时长maxCallTime  minCallTime
  bindLongChange() {
    this.setData({
      isShowTime:true,
      minCallTime:'',
      maxCallTime:''

    })
  },
  minLong(e) {
    this.setData({
      minCallTime: e.detail.value
    })
  },
  maxLong(e) {
    this.setData({
      maxCallTime: e.detail.value
    })
  },
  confirm(){
    console.log(123)
    this.searchTime()
  },
  cancel(){
    this.setData({
      // isLong: true,
      isShowTime: false,

    })
  },
  searchTime() {

    if (Number(this.data.maxCallTime) && Number(this.data.minCallTime)) {
      if (Number(this.data.maxCallTime) < Number(this.data.minCallTime)) {
        util.errorTip('输入数据有误!')
        return;
      }
    }
    this.getCallList()
  },

  //获取任务详情
  getTaskDetail: function () {
    var that = this;
    util.request('sale/getTaskDetail?taskid=' + this.data.task_id, '', 'get', function (res) {
      console.log(res.data.content.saletaskCalltime)
      console.log(res)
      if (res.data.code == 10000) {
        that.setData({
          detailList: res.data.content
        })
        if (!res.data.content.saletaskCalltime.length) {
        console.log(11111)
          console.log(that.data.detailList)
        }
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  //获取意向等级
  getStates: function () {
    var that = this;
    util.request('task/getIclevel', '', 'get', function (res) {
      if (res.data.code == 10000) {
        // console.log(res.data.content)
        res.data.content.unshift({ iclevelname: '默认', iclevelid: '' })
        that.setData({
          objectArrayTest: res.data.content
        })
        console.log(that.data.objectArrayTest)
      } else {
        util.errorTip(res.data.content + '')
      }
    })
  },
  //切换意向等级
  bindChangecase(e) {
    var that = this
    that.setData({
      index: e.detail.value,
      iclevelid: that.data.objectArrayTest[that.data.index].iclevelid,
      isTime: true,
    })
    var id = that.data.objectArrayTest[that.data.index].iclevelid
    that.data.iclevelid = that.data.objectArrayTest[that.data.index].iclevelid
    that.getCallList(id)
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
    this.getCallList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 用于接收上个页面带过来的参数
  onLoad: function (options) { //options用于接收上个页面传递过来的参数
    var that = this;
    that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
      task_id: options.taskid, //id是a页面传递过来的名称，a_id是保存在本页面的全局变量   {{b_id}}方法使用
    })
    this.getStates()
    this.getTaskDetail()
    this.getCallList()
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
    setTimeout(function () { wx.hideNavigationBarLoading(); that.getCallList(that.data.iclevelid); }, 1000);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {//分享小程序
    // return {
    //   title: '跃讯Ai',
    //   desc: '通话记录详情!',
    //   path: `/pages/taskDetail/taskDetail?taskid=${this.data.task_id}`
    // }
  },
})