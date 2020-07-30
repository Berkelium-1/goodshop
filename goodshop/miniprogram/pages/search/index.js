// pages/search/index.js

import {
  request
} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索内容
    searchList: [],

    val: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取关键字搜索内容
  getKeyData(e) {
    request({
      url: '/goods/qsearch',
      data: {
        query: e.detail.value
      }
    }).then(res => {
      console.log(res);

      this.setData({
        searchList: res.data.message
      })
    })
  },

  // 取消按钮
  cancelBtn() {
    this.setData({
      val: '',
      searchList: []
    })
  }




})