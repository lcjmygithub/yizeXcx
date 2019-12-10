// pages/callPages/index.js
const audioManager = wx.getBackgroundAudioManager()
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sale_id: '',
    gadNews: {}, //客户基本信息
    question: [], //问题库
    icrule: '', //关键词
    pass_time: '00:00', //开始时间
    total_time: '00:00', //结束时间
    pauseState: true, //开启暂停
    prefixAudio: '', //录音前缀
    allPrefixAudio: "", //机器人整段录音前缀
    partPrefixAudio: "", //机器人片段录音前缀
    robotList: [],
    audioSrc: '',
    max: 0,
    isStart: false,
    value: 0,
    audioSize: '',
    cmpid: '',
    // datainfo: [],//聊天记录
    //增加的
    audioPlayState: false,
    audioSrc: '',
    audioSize: '',
    value: 0,
    percent: 0,
    max: 0,
    // pass_time: '00:00',
    // total_time: '00:00',
    // pauseState: true,
    seekTime: '',
    mask: true,
    manualClassification: true,
     //增加的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 用于接收上个页面带过来的参数
  onLoad: function(options) { //options用于接收上个页面传递过来的参数
    var that = this;
    console.log(options)
    that.setData({ //this.setData的方法用于把传递过来的id转化成小程序模板语言
      sale_id: options.saledataid, //id是a页面传递过来的名称，a_id是保存在本页面的全局变量   {{b_id}}方法使用
      cmpid: options.cmpid || ''
    })
    wx.setInnerAudioOption({ obeyMuteSwitch: false }) //增加的
    that.setData({
      prefixAudio: app.globalData.prefixAudio,
      allPrefixAudio: app.globalData.allPrefixAudio,
      partPrefixAudio: app.globalData.partPrefixAudio,
    })
    this.getCalldetailsList()
   
   //this.wxzxSlider = this.selectComponent("#wxzxSlider");          //lcj 增加的
    audioManager.onTimeUpdate(function() {
      // if (!that.wxzxSlider.properties.isMonitoring) {
      //   return
      // }
      var currentTime = audioManager.currentTime.toFixed(0);
      console.log(currentTime, that.data.max);
      if (currentTime == that.data.max - 2) {
        that.setData({
          pauseState: true
        })
      }
      if (currentTime > that.data.max) {
        currentTime = that.data.max;

      }
      var pass_time = that.secondTransferTime(currentTime);
      that.setData({
        value: currentTime,
        pass_time: pass_time,
        percent: audioManager.buffered / audioManager.duration * 100,
        // audioSize: !audioManager.duration ? '00:00' : that.s_to_hs(audioManager.duration),
        disabled: false
      });
    })
    
    audioManager.onWaiting(function() {
      that.setData({
        disabled: true
      })
    })

    audioManager.onEnded(function() {
      that.setData({
        pauseState: true,
        value: 0,
        pass_time: '00:00',
        percent: 0,
      })
    })
    // console.log(audioManager.duration)
  },
  secondTransferTime: function(time) {
    if (time > 3600) {
      return [
          parseInt(time / 60 / 60),
          parseInt(time / 60 % 60),
          parseInt(time % 60)
        ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    } else {
      return [
          parseInt(time / 60 % 60),
          parseInt(time % 60)
        ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    }
  },
  //获取通话记录列表
  getCalldetailsList: function() {
    var that = this
    var data = {
      sale_id: that.data.sale_id,
      cmpid: that.data.cmpid || ''
    }
    util.request('/open/getSaleDataMatch?saleid=' + that.data.sale_id + '&cmpid=' + this.data.cmpid, '', 'get', function(res) {
      // util.request('/open/getSaleDataMatch?saleid=338619861&cmpid=4765', '', 'get', function (res) {
      // this.data.sale_id
      if (res.data.code == 10000) {
        console.log(res.data.content)
        var data1 = res.data.content.callrecord.robotList
        for (var i = 0; i < data1.length; i++) {
          data1[i].size = "点击播放";
          data1[i].playState = false;
        }
        console.log(res.data.content.callrecord.calltime)
        that.setData({

          audioSize: !res.data.content.callrecord.calltime ? '00:00' : that.s_to_hs(res.data.content.callrecord.calltime),
          max: !res.data.content.callrecord.calltime ? '0' : res.data.content.callrecord.calltime,
          audioSrc: res.data.content.callrecord.voxfile,
          gadNews: res.data.content.callrecord,
          question: res.data.content.queslist,
          icrule: res.data.content.icrule,
          robotList: data1
        })
        console.log(that.data.question)
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })

  },
  phoneCopy: function () {//点击复制电话号码
    var that = this;
    wx.setClipboardData({
      data: that.data.gadNews.mobilephone,
      success: function (res) {
        console.log(res);
      }
    })
  },
  callphone: function(e) { //点击拨打电话
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function(res) {
        console.log("打电话了")
        that.setData({
          mask: false,
          manualClassification: false
        })
      }

    })
  },

//lcj

  // 点击slider时调用
  sliderTap: function (e) {
    console.log("sliderTap")
    this.seek()
  },

  // 开始滑动时
  sliderStart: function (e) {
    console.log("sliderStart");

  },

  // 正在滑动
  sliderChange: function (e) {
    this.wxzxSlider = this.selectComponent("#wxzxSlider");
    var value = this.wxzxSlider.properties.value;
    console.log(value)
    var seek_time = parseInt(value);
    var pass_time = this.secondTransferTime(seek_time);
    //this.wxzxSlider.properties.value = pass_time;
    console.log(this.wxzxSlider.properties.value);
    this.setData({
      seekTime: seek_time,
      pass_time: pass_time
    })
    console.log(this.data.value)
  },

  // 滑动结束
  sliderEnd: function (e) {
    var that = this;
    console.log("sliderEnd")
    console.log(this.wxzxSlider.properties.value);
    console.log(this.data.value)
    this.setData({ value: that.data.seekTime })
    this.seek()
  },

  // 滑动取消 （左滑时滑到上一页面或电话等情况）
  sliderCancel: function (e) {
    console.log("sliderCancel")
    this.seek()
  },

  seek: function () {
   var  value = this.wxzxSlider.properties.value
    // var value = this.wxzxSlider? this.wxzxSlider.properties.value : 0
    console.log(this.wxzxSlider)
    // console.log(this.wxzxSlider.properties)
    // console.log(value)
    var seek_time = value.toFixed(0);
    var pass_time = this.secondTransferTime(seek_time);
    this.setData({
      pass_time: pass_time,
    })
    audioManager.seek(Number(seek_time));
  },


//lcj

  
  s_to_hs: function(s) {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    //将变量转换为字符串
    h += '';
    s += '';
    //如果只有一位数，前面增加一个0
    h = (h.length == 1) ? '0' + h : h;
    s = (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
  },
  //点击开始播放录音
  start: function() {
    if (this.innerAudioContext) {
      this.innerAudioContext.pause();
    }
    var datainfo = this.data.robotList;
    for (var i = 0; i < datainfo.length; i++) {
      datainfo[i].playState = false
    }
    this.setData({
      datainfo: datainfo
    })
    console.log(audioManager)
    console.log(this.data.audioSize)
    if (this.data.audioSize == '00:00') {
      return;
    }
    console.log(this.data.allPrefixAudio + this.data.audioSrc + ".wav")
    audioManager.title = '通话整段录音'
    audioManager.epname = '通话整段录音'
    // console.log(audioManager.duration)
    audioManager.singer = '一泽AI'
    audioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    audioManager.startTime = this.data.value
    audioManager.src = this.data.allPrefixAudio + this.data.audioSrc + ".wav"
    // audioManager.src = "https://zvoice.oss-cn-beijing.aliyuncs.com/rec/289/20190815/s119071507461875333948.wav"
    this.setData({
      pauseState: false
    })
  },
  //点击暂停录音
  pause: function(e) {
    audioManager.pause()
    this.setData({
      pauseState: true
    })
  },
  //录音播放
  yyPlay: function(e) {
    /*播放状态*/
    var playstateZt = e.currentTarget.dataset.playstate;
    console.log(playstateZt);
    /*关闭整段录音*/
    this.pause();
    var that = this;
    if (this.innerAudioContext) {
      this.innerAudioContext.pause();
    }
    this.innerAudioContext = wx.createInnerAudioContext();
    //this.innerAudioContext.pause();
    var src = e.currentTarget.dataset.yy;
    var index = e.currentTarget.dataset.index;
    console.log(src);
    console.log(e)
    var playState = '';
    playState = "robotList[" + index + "].playState";
    console.log(playState);
    var datainfo = this.data.robotList;
    for (var i = 0; i < datainfo.length; i++) {
      datainfo[i].playState = false
    }

    this.setData({
      robotList: datainfo
    })
    if (!playstateZt) { //
      console.log("没有播放  播放")
      this.setData({
        [playState]: true
      })
      this.innerAudioContext.src = src;
      console.log(this.innerAudioContext.src)
      this.innerAudioContext.play();
    }
    console.log(that.data.robotList)
    //this.innerAudioContext.autoplay=true;

    this.innerAudioContext.onEnded(() => {
      console.log('录音播放结束');
      that.setData({
        [playState]: false
      })
    })
    console.log(that.data.robotList)
    //当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
    console.log(this.innerAudioContext.duration)
  },
  // //所有录音播放
  // allyyPlay: function (e) {
  //   var that = this;
  //   this.innerAudioContext = wx.createInnerAudioContext();
  //   var src = e.currentTarget.dataset.yy;
  //   var size = e.currentTarget.dataset.size;
  //   console.log(src);
  //   console.log(e)
  //   if (!size) {
  //     console.log("无效的src 录音地址")
  //     return;
  //   }

  //   var playState = '';
  //   this.setData({
  //     isStart: true
  //   })
  //   this.innerAudioContext.src = src;
  //   this.innerAudioContext.play();
  //   this.innerAudioContext.onEnded(() => {
  //     console.log('录音播放结束');
  //     that.setData({
  //       isStart: false
  //     })
  //   })
  //   //当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
  //   console.log(this.innerAudioContext.duration)
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    // saleid = ' + that.data.sale_id + ' & cmpid=' + this.data.cmpid
    return {
      title: '跃讯Ai',
      desc: '通话记录详情!',
      path: `/pages/callPages/index?saleid=${that.data.sale_id}&cmpid=${this.data.cmpid}`
    }
  }
})