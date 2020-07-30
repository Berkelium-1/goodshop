import {request} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    swiperList:[],

    // 导航菜单
    catesList:[],

    //楼层
    flootList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得轮播图
    this.getSwiperList();
    //获得导航
    this.getCatesList();
    //获得楼层
    this.getFlootList();
  },

//获得轮播图数据
  getSwiperList(){
    request({
      url: '/home/swiperdata'
    }).then(res=>{
      // console.log('轮播图',res);
      this.setData({
        swiperList: res.data.message
      });
    });
  },

  // 获得导航数据
  getCatesList(){
    request({
      url:'/home/catitems'
    }).then(res=>{
      // console.log('导航',res);
      this.setData({
        catesList: res.data.message
      });
    })
  },

  // 获得楼层数据
  getFlootList(){
    request({
      url:'/home/floordata'
    }).then(res=>{
      console.log('楼层',res);
      this.setData({
        flootList: res.data.message
      });
    })
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})