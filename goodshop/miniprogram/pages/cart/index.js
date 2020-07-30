// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address: {},

    // 购物车数据
    cart: [],

    // 全选
    allChecked: false,

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
    const cart = wx.getStorageSync('cart') || [];

    // 数据放进data
    this.setData({
      address
    });

    // 刷新数据
    this.setCart(cart);

  },

  // 地址按钮
  chooseAddress() {

    let scopeAddress = null;

    // 获取权限状态
    wx.getSetting({
      success: (result) => {
        // console.log(result);
        // 需要获取的属性名比较不规范的时候要用 ['key'] 的形式来获取
        scopeAddress = result.authSetting['scope.address'];



        // console.log(scopeAddress);

        // true || undefined || false
        // 有权限 || 第一次打开 需要给权限 || 拒绝过权限

        // 判断权限状态
        if (scopeAddress || scopeAddress == undefined) {
          // 微信自带收货地址
          wx.chooseAddress({
            success: res => {
              // console.log(res);
              wx.setStorageSync('address', res);

            }
          });
        } else {
          wx.openSetting({
            success: (openRes) => {
              // console.log('openRes==>', openRes);

              wx.chooseAddress({
                success: res => {
                  // console.log('false==>', res);
                  wx.setStorageSync('address', res);
                }
              });

            }
          });
        }



      },
    });

  },

  // 复选框 商品的选中
  itemChange(e) {
    // console.log(e);
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;

    // 获取购物车数组
    let {
      cart
    } = this.data;

    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);

    // 选中状态修改
    cart[index].checked = !cart[index].checked;


    // 刷新数据
    this.setCart(cart);
  },

  //全选
  itemAllChecked() {
    let {
      cart
    } = this.data;

    // allChecked会跟着改变所有的checked而改变 所以这里省略给allChecked取反
    cart.forEach(v => {
      v.checked = !this.data.allChecked;
    });

    this.setCart(cart);
  },

  // + - 按钮
  btnNumEdit(e) {
    // 获取参数
    const goods_id = e.currentTarget.dataset.id;
    const n = e.currentTarget.dataset.num;

    let {
      cart
    } = this.data;

    const index = cart.findIndex(v => v.goods_id === goods_id);

    if (n === -1 && cart[index].num === 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除此选项？',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1);
            // 注意：success 一定要是箭头函数 this指向问题
            this.setCart(cart);
          }
        },
      });
    } else {
      cart[index].num += n;
      this.setCart(cart);
    }

  },

  // 优化封装 用于刷新数据
  setCart(cart) {
    // 全选
    let allChecked = cart.length ? true : false;

    // 总数量 总价格
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })

    // 数据放进data
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });

    // 修改缓存数据
    wx.setStorageSync('cart', cart);
  },

  // 结算
  pay() {
    const {
      address,
      totalNum
    } = this.data;

    // 判断是否有选中地址
    if (!address.userName) {
      wx.showToast({
        title: '未选择收货地址',
        icon: 'none',
        mask: false,
        success: (result) => {

        }
      });

      return;
    }

    // 判断是否有选中商品
    if (totalNum === 0) {
      wx.showToast({
        title: '未选购商品',
        icon: 'none',
        mask: false,
        success: (result) => {

        }
      });
      return;
    }

    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }

});