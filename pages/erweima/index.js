// pages/erweima/index.js
const app = getApp();
var postfix = '_deadtime';
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: '',
    imgsrc: '',
    winWidth: 375,
    winHeight: 640,
    index:0,
    arrImg: ['/img/oneBackground.png', '/img/twoBackground.png', '/img/threeBackground.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success(e) {
        // screenHeight和screenWidth
        that.setData({
          winWidth: e.screenWidth,
          winHeight: e.screenHeight,
        })
      }
    })
    this.erweima()
  },
  erweima: function() {
    var that = this
    util.request('open/getYzWxQRCode?userid=' + wx.getStorageSync('userid'), '', 'post', function(res) {
      console.log(res)
      if (res.data.code == 10000) {
        console.log(res.data.content)
        that.setData({
          imgsrc: res.data.content
        })
        that.saveImg(that.data.arrImg[that.data.index]).then(e => {
          that.downLoad()
        });
      } else {
        util.errorTip(res.data.content + '')
        console.log("接口报错了/接口报错了/接口报错了")
      }
    })
  },


  // 把网络图片改成临时路径
  downLoad: function(e) {
    var that = this;
    //缓存canvas背景图
    wx.downloadFile({
      url: that.data.imgsrc, //网络路径
      success: function(res3) {
        console.log(res3)
        that.setData({
          imgsrc: res3.tempFilePath
        })
        console.log(res3.tempFilePath)
        console.log('开始绘制图片')
        that.saveImg(that.data.arrImg[that.data.index]); //绘图的函数
        // // 结束加载中提示
      }
    })
  },
  saveImg: function(src) {
    let that = this;
    let w = that.data.winWidth;
    let h = that.data.winHeight;
    // console.log(that.data.imgsrc)
    return new Promise(function(resolve, reject) {
      let context = wx.createCanvasContext('erweima');
      context.drawImage(src, 0, 0, w, h);
      context.drawImage(that.data.imgsrc, w * 0.11, h * 0.82, w * 0.26, h * 0.140);
      context.setTextAlign('center')
      context.setFillStyle('#fff')
      context.setFontSize(16)
      //绘制图片
      context.draw();
      resolve();
    });
  },
  imageErrorAuth() {
    // 授权失败 提示授权操作
    wx.showModal({
      title: '提示',
      content: '需要您授权保存至相册',
      showCancel: false,
      success: modalSuccess => {
        wx.openSetting({
          success(settingData) {
            console.log("settingData", settingData)
            if (settingData.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '提示',
                content: '获取权限成功,再次保存图片即可',
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取权限失败，将无法保存到相册',
                showCancel: false
              })
            }
          },
          fail(failData) {
            console.log("failData", failData)
          },
          complete(finishData) {
            console.log("finishData", finishData)
          }
        })
      }
    })
  },
  saveStart() {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: -100,
      width: that.data.winWidth,
      height: that.data.winHeight,
      destWidth: that.data.winWidth,
      destHeight: that.data.winHeight,
      canvasId: 'erweima',
      success: function(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
          success: function(res) {
            console.log(res)
            wx.showToast({
              title: '成功保存到相册',
              icon: 'success'
            })
          },
          fail: function(res) {
            wx.showModal({
              title: '温馨提示',
              content: '若不打开授权，则无法将图片保存在相册中！',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.imageErrorAuth()
                }
              }
            })
            console.log('用户拒绝')
          }
        })
      }
    })
  },
  changeBackGround(){
    let that = this
    that.data.index++
    if (that.data.index == 3){
      that.data.index = 0
    }
    console.log(that.data.index)
    this.erweima(that.data.arrImg[that.data.index])
  },
  // ------------------------------

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.erweima()
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