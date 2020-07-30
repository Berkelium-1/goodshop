// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单数据
    orderList: [],

    isOrder: false
  },


  onLoad: function (options) {
    this.getOrderList();
  },

  // 获取订单数据
  getOrderList() {
    const orderList = wx.getStorageSync('paid_order');

    if (orderList) {
      this.setData({
        orderList,
        isOrder: true
      });
    } else {
      this.setData({
        isOrder: false
      });
    }

  }
})