// pages/homePage/homePage.js
const app = getApp();
var postfix = '_deadtime';
var util = require('../../utils/util.js');
import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let that
let list = [0,0,0,0]
let list1 = [0,0,0,0]
//获取echarts 配置

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  // canvas.width = 365;
  // canvas.height = 304;
  var xData = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
  // xData = []
  var colorList = ['#218BEE', '#FE6C52']
  console.log(that)
  var data = {
    // 意向客户: that.data.callrate,
    // 接通率: that.data.iclvelCount
    意向客户:list1,
    接通率:list
  }
  console.log(that)
  console.log(data)
  let fontSize="14"
  let option = {
    tooltip: { //鼠标移入弹出提示
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      //弹出格式自定义   formatter:(params)=>{}
      // show: false,
    },
    legend: {
      // icon:"line",
      itemWidth:20,
      itemHeight:10,
      itemGap:20,
      x: 'left',
      data: Object.keys(data)
    },
    grid: {
      left: '10%',
      right: '1%',
    },
    xAxis: {
      data: xData,
      // axisLabel: {
      //   interval: 0,
      //   rotate: 40

      axisLabel: {
        inside: false,
        interval: 0,
        // rotate: 40,
        textStyle: {
          color: "#000",
          fontSize:10
        }
      },
      axisTick: {
        show: true
      },
      splitLine: { //切割线
        show: false,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLine: { //周线
        show: false,
        lineStyle: {
          color: '#ccc'
        }
      },
    },
    yAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: "#999",
          fontSize
        }
      }
    },
    series: [{
      type: "bar",
      name: '意向客户',
      barWidth: 6, //宽度
      data: data['意向客户']
    },
    {
      type: 'bar',
      name: '接通率',
      barWidth: 6, //宽度
      data: data['接通率']
    }
    ],
    color: colorList

  }

  chart.setOption(option);
  return chart;
}




Page({

  /**
   * 页面的初始数getSaleTaskCall
   */
  data: {
    loginState: false, //验证是否授权
    loginNum: 1, //等于3停止ajax请求
    datainfoNone: false, //没有在呼叫的任务
    callflag: '', //1已经开启   2已经关闭
    isEcharts: false, //收起展开
    connectNum: 0, //今日数据
    ifName: false,
    isIndex:false,
    id: '',
    setValue: '',
    connectRate: 0,
    callPercent: 0,
    callrate: [], //接通率
    iclvelCount: [], //意向客户
    taskList: [],
    time: '',
    pageSize: 10, //一页显示几条
    intentionalCustomer: 0,
    // ec: {
    //   onInit: initChart
    // }
    ec: {
      // lazyLoad: true, // 延迟加载
      onInit: initChart
    },
  },

  // jump: function (e) {
  //   var linkurl = e.currentTarget.dataset.linkurl;
  //   wx.navigateTo({
  //     url: linkurl,
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    if (options) {
      console.log(options.isIndex)
      that.setData({
        isIndex: options.isIndex,
      })
    }
    console.log(this.data.loginState)
    that.setData({
      loginState: wx.getStorageSync('loginState'),
    })
  },
  //获取用户信息
  bindGetUserInfo: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.login({
      success: res => {
        wx.request({
          url: 'https://yize.kefu7.com/open/getPhoneNumber',
          data: {
            'code': res.code
          },
          method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          }, // 设置请求的 header
          success: function (res) {
            if (res.data.code == "10000") {
              console.log(res)
              //存入缓存即可
              wx.hideLoading();
              // wx.setStorageSync('phone', res.phone);
              wx.setStorageSync('token', res.data.content.authorization);
              wx.setStorageSync('linkcmpid', res.data.content.ztCompany.companyid);
              wx.setStorageSync('loginState', true, 29940000)
              wx.setStorageSync('link', false);
              wx.setStorageSync('phone', res.data.content.ztGuser.phone)
              wx.setStorageSync('userid', res.data.content.ztGuser.userId)
              wx.setStorageSync('openid', res.data.content.ztGuser.openId)
              that.setData({
                loginState: true
              })
              console.log(that.data.loginState)
              that.getData();
              that.getTaskList()
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.content + '',
                success: function (res) { }
              })
              that.setData({
                loginState: false
              })
            }
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    })
  },
  //点击展示echarts
  upecharts: function () {
    var that = this
    that.setData({
      isEcharts: !this.data.isEcharts,
    })
    // console.log(that)
    // console.log(that.data.callrate)
    // list = this.data.callrate
  },
  //暂停开始任务 https://localhost/sale/updateSaleTaskCallFlag?taskid=4098
  changeTask: function (e) {
    console.log(e.currentTarget.dataset.callflag)

    var that = this
    // var id = e.currentTarget.dataset.taskid
    that.setData({
      id: e.currentTarget.dataset.taskid,
      callflag: e.currentTarget.dataset.callflag,
    })
    // console.log(e.currentTarget.dataset.flag)
    var  title = ''
    if (e.currentTarget.dataset.callflag == 1){
      title = '任务暂停成功'
    }else{
      title = '任务开启成功'
    }
    if (e.currentTarget.dataset.flag == 3) {
      that.setData({
        ifName: true,
      })
      return;
    }
    util.request('sale/updateSaleTaskCallFlag?taskid=' + that.data.id + '&occurs=' + that.data.setValue, '', 'get', function (res) {
      console.log(res)
      if (res.data.code == 10000) {
        console.log(res)
        that.getTaskList()
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
  setValues(e) {
    this.setData({
      setValue: e.detail.value.replace(/\D/g, '')
    })
  },
  cancel() {
    that.setData({
      ifName: false
    })
  },
  confirm() {
    var that = this
    that.setData({
      ifName: false
    })
    var title = ''
    if (that.data.callflag == 1) {
      title = '任务暂停成功'
    } else {
      title = '任务开启成功'
    }
    util.request('sale/updateSaleTaskCallFlag?taskid=' + that.data.id + '&occurs=' + that.data.setValue, '', 'get', function (res) {
      if (res.data.code == 10000) {
        that.getTaskList()
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
      that.setData({
        setValue: '',
      })
    })
  },
  getStorageSync: function (k, def) {
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        wx.removeStorageSync(k);
        wx.removeStorageSync(k + postfix);
        if (def) {
          return def;
        } else {
          return;
        }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else if (def) {
      return def;
    } else {
      return;
    }
  },
  //修改图表数据
  changeChartData(data1,data2){
    
    setTimeout(()=>{
      let option=chart.getOption();
      console.log('option:',option)
      
      option.series[0].data = data1;
      option.series[1].data = data2;
      chart.setOption(option);
    },400)
    
  },
  //获取首页数据
  getData: function () {
    var that = this;
    util.request('sale/getTodayCall', '', 'get', function (res) {
      var callrate = []
      var iclvelCount = []
      if (res.data.code == 10000) {
        console.log(res.data.content.iclvelList)
        that.setData({
          callPercent: parseFloat(res.data.content.callPercent),
          connectNum: res.data.content.alreadyConnect,
          connectRate: res.data.content.todalCall,
          intentionalCustomer: res.data.content.intentCustomer,
        })
        if (res.data.content.iclvelList){
          for (var i = 0; i < res.data.content.iclvelList.length; i++) {
            callrate.push(res.data.content.iclvelList[i].callrate)
            iclvelCount.push(res.data.content.iclvelList[i].iclvelCount)
          }
          that.changeChartData(iclvelCount, callrate);
          that.setData({
            callrate: callrate,
            iclvelCount: iclvelCount,
          })
        }
       
        console.log(that.data.callrate)
        console.log(that.data.iclvelCount)
        console.log(that.data.callrate)
      } else if (res.data.code == 11005) {
        wx.clearStorageSync()
        that.setData({
          loginState: false
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },
  //获取首页任务列表https://yize.kefu7.com/sale/getSaleTaskCall ?pageNo=' + that.data.pageNo 
  getTaskList: function (state) {
    var that = this;
    if (!state) {
      wx.showLoading({
        title: '加载中',
        duration: 2000
      })
    }
    util.request('sale/getSaleTaskCall?pageNo=1&pageSize=' + this.data.pageSize, '', 'get', function (res) {
      if (res.data.code == 10000) {
        console.log(res)
        for (var i = 0; i < res.data.content.list.length; i++) {
          res.data.content.list[i].createtime = util.formatTime(res.data.content.list[i].createtime)
        }
        that.setData({
          taskList: res.data.content.list
        })
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
    if (!state) {
      wx.hideLoading();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that = this;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.onLoad()
    that.setData({
      time: util.formats(new Date()),
      loginState: wx.getStorageSync('loginState'),
    })
    if (this.getStorageSync("loginState")) {
      this.getData();
      this.getTaskList()
    } else {

    }


    if (wx.getStorageSync('loginState')) {
      wx.setStorageSync('linkstime', '');
      wx.setStorageSync('linketime', '');
      wx.setStorageSync('linktaskid', '');
      wx.setStorageSync('linkstime', '');
      wx.setStorageSync('linkisread', '');
      wx.setStorageSync('linkiclevelid', '');

      // that.getCmpid();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //this.endSetInter();
    console.log("监听页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    //this.endSetInter();
    console.log("页面卸载")
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
    wx.showNavigationBarLoading();
    that.setData({
      pageSize: that.data.pageSize + 10
    })
    // wx.hideNavigationBarLoading() //完成停止加载
    // wx.stopPullDownRefresh() //停止下拉刷新
    wx.showLoading({
      title: '加载中',
      duration: 2000
    })
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      that.getTaskList();
    }, 1000);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})