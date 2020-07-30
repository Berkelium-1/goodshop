// pages/goods_detail/index.js
import {
  request
} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品数据
    goodsDetail: {}
  },

  // 商品数据
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      goods_id
    } = options;

    // 获取商品详情
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情
  getGoodsDetail(goods_id) {
    request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    }).then(res => {
      // console.log(res.data.message);

      this.GoodsInfo = res.data.message;

      this.setData({
        // 全拿的话数据太多了
        // goodsDetail: res.data.message

        // 数据优化
        goodsDetail: {
          goods_name: res.data.message.goods_name,
          goods_price: res.data.message.goods_price,
          // 部分iphone手机 不识别 webp 图片格式
          // 最好找后台 让他进行修改
          // 临时自己改就要确定后台存在格式 .webp
          goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics: res.data.message.pics,
        }
      })
      // console.log(this.data.goodsDetail);
    });
  },

  // 预览图片
  previewImg(e) {
    // 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);

    // 第一个显示的图片 从参数获取url
    const current = e.currentTarget.dataset.url;

    // 微信小程序 预览图片 api
    wx.previewImage({
      current,
      urls
    });

  },

  // 加入购物车
  addCart() {
    let cart = wx.getStorageSync('cart') || [];

    // 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);

    if (index === -1) { // 不存在
      // 添加属性num 代表数量
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;


      // 把商品信息存进去
      cart.push(this.GoodsInfo);
    } else { // 存在
      // 对应商品数量加一
      cart[index].num++;
    }

    // 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);

    // 提示弹窗
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });

  }
})