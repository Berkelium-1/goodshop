import {
  request
} from '../../request/index.js'

// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        title: '综合',
        isActive: true
      },
      {
        title: '销量',
        isActive: false
      },
      {
        title: '价格',
        isActive: false
      }
    ],

    // 商品列表数据
    goodsList: []
  },

  // 接口的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得参数cid
    this.QueryParams.cid = options.cid;

    // 获取商品列表
    this.getGoodsList();
  },

  // 标签栏标签切换 从子组件拿数据
  tapTabsItem(e) {
    // console.log(e);
    let {
      index
    } = e.detail;
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => {
      v.isActive = index === i;
    });

    this.setData({
      tabs
    })
  },

  // 获取列表数据
  getGoodsList() {
    request({
      url: '/goods/search',
      data: this.QueryParams
    }).then(res => {
      console.log(res);
      // 总条数
      let total = res.data.message.total;
      // 计算总页数    总条数 / 一页的条数
      this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
      this.setData({
        goodsList: [...this.data.goodsList, ...res.data.message.goods]
      });

      // 数据拿到时停止刷新
      wx.stopPullDownRefresh();
    });
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    // 判断是否有下一页 现在的页数是否大于等于总页数
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页了'
      })
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  // 页面下拉刷新
  onPullDownRefresh: function () {
    // 重置数据
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum = 1;
    this.getGoodsList();

  }

});