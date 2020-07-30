// pages/auth/index.js
import {
  request
} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getuserinfo(e) {
    // console.log(e);
    // 获取用户信息
    const {
      encryptedData,
      iv,
      rawData,
      signature
    } = e.detail;

    // 获取小程序登录成功后的code
    wx.login({
      timeout: 10000,
      success: (res) => {
        // console.log(res);
        const {
          code
        } = res;

        request({
          url: '/users/wxlogin',
          method: 'post',
          data: {
            encryptedData,
            iv,
            rawData,
            signature,
            code
          }
        }).then(res => {
          console.log(res.data.message);

          const token = res.data.message ? res.data.message.token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';

          // 存储token
          wx.setStorageSync('token', token);

          // 返回支付页面
          wx.navigateBack({
            delta: 1
          });




        });

      }
    });

  }
})