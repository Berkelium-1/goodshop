import {request} from '../../request/index.js';

// pages/classify/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左边菜单
    leftMenuList:[],
    // 右边
    rightContent:[],

    // 当前active在的位置索引
    activeIndex: 0
  },

  // 缓存数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取存储的数据
    let Cates = wx.getStorageSync('cates');
console.log(Cates);

    if(!Cates){
       // 获取分类数据
      this.getCates();
    }else{
      // 如果缓存数据超过10s 则数据过期 重新请求
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      }else{
        // 使用缓存的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map( v => v.cat_name );
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
   
    
  },

  // 获取导航数据
  getCates(){
    request({
      url:'/categories'
    }).then(res=>{
      // console.log('Cates',res);
      // 所有分类页面的数据
      this.Cates = res.data.message;

      // 获取数据时间和数据放进储存库
      // wx.setStorageSync('key', val); 
      // 和web的区别是，web储存时会转为字符串，而微信小程序不会
      wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});

      let leftMenuList = this.Cates.map( v => v.cat_name );
      // console.log(leftMenuList);

      let rightContent = this.Cates[0].children;
      // console.log(rightContent);

      this.setData({
        leftMenuList,
        rightContent
      })
    });
  },

  // 点击切换active
  tapActive(e){
    // console.log(e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    let rightContent = this.Cates[i].children;
    this.setData({
      activeIndex: i,
      rightContent
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