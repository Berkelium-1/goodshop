// pages/pay/index.js
import {
  request
} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address: {},

    // 购物车数据
    cart: [],

    // 总价
    totalPrice: 0,

    // 总数量
    totalNum: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
  },

  // 检测是否有缓存数据 有就放进data
  onShow() {
    // 获取缓存数据
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];

    // 过滤数组 只保留被勾选过的商品
    cart = cart.filter(v => v.checked);

    // 如果购物车没有被勾选过的商品 则返回购物车
    if (cart.length == 0) {
      wx.switchTab({
        url: '/pages/cart/index'
      });
      return;
    }

    // 总数量 总价格
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })

    // 数据放进data
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    });
  },

  // 支付
  nowPay() {
    const token = wx.getStorageSync('token');

    // 是否有token
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });

      return;
    }

    // 创建订单

    // 请求头参数
    const header = {
      Authorization: token
    };

    // 请求体参数
    // 价格
    const order_price = this.data.totalPrice;

    // 地址

    const {
      provinceName,
      cityName,
      countyName,
      detailInfo
    } = this.data.address;
    let address_all = provinceName + cityName + countyName + detailInfo;
    const consignee_addr = address_all;

    const {
      cart
    } = this.data;
    // 订单数组
    let goods = [];

    // 获取goods字段参数
    cart.forEach(v => {
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      })
    })

    const orderParams = {
      order_price,
      consignee_addr,
      goods
    };

    // 发起请求 获取订单编号
    request({
      url: '/my/orders/create',
      method: 'post',
      data: orderParams,
      header
    }).then(res => {
      const order_number = res.data.message.order_number;

      // 发起请求 获取支付参数
      request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        data: {
          order_number
        },
        header
      }).then(res => {
        // console.log(res.data.message.pay);
        const pay = res.data.message.pay;
        /* wx.requestPayment({
          ...pay,
          success: (res) => {
            console.log(res);
            // 查看订单支付状态
            request({
              url: '/my/orders/chkOrder',
              method: 'post',
              data: {
                order_number
              },
              header
            }).then(res => {
              console.log(res);
            });
          },
          fail: err => {
            console.log(err);
          }
        });*/

        if (pay.timeStamp && pay.nonceStr && pay.package && pay.signType && pay.paySign) {
          wx.showToast({
            title: '支付成功',
            mask: false,
            success: (result) => {
              // console.log(res);

              // 获取当前日期时间
              const timestamp = Date.parse(new Date());
              const date = new Date(timestamp);
              const y = date.getFullYear();
              const m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
              const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
              const ymd = y + '-' + m + '-' + d;

              const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
              const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
              const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
              const time = hours + ':' + minutes + ':' + seconds;


              // 创建订单对象
              const order_item = {
                order_date: ymd,
                order_time: time,
                order_user: this.data.address.userName,
                order_tel: this.data.address.telNumber,
                order_address: consignee_addr,
                total_price: this.data.totalPrice,
                order_list: [...this.data.cart]
              };

              // 获取已支付订单数组 如果没有就返回空数组
              const paid_order = wx.getStorageSync('paid_order') || [];
              paid_order.push(order_item);;

              // 存储已支付订单
              wx.setStorageSync('paid_order', paid_order);

              // 删除已支付的购物车数据
              let newCart = wx.getStorageSync('cart');

              // 获取未选中的商品成一个数组
              newCart = newCart.filter(v => !v.checked);

              // 修改购物车数据
              wx.setStorageSync('cart', newCart);


              // 跳转到订单页面
              wx.navigateTo({
                url: '/pages/order/index'
              });
            }
          });
        }
      });
    });
  }

});