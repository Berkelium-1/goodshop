// pages/user/index.js
Page({
  data: {
    isUser: false,

    // 用户信息
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
  },

  // 初始化
  onShow() {
    const userInfo = wx.getStorageSync('user_info');
    // console.log(userInfo);

    if (userInfo) {
      this.setData({
        isUser: true,
        userInfo
      })
    }
  },

  // 获取用户信息
  getUserInfo(e) {
    // console.log(e.detail.userInfo);
    const userInfo = e.detail.userInfo;

    wx.setStorageSync('user_info', userInfo);

    this.setData({
      isUser: true,
      userInfo
    })

  }



})