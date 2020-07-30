// 定义请求的次数
let ajaxSendNum = 0;

export const request=(params)=>{
  let baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

  // 不存在 http 时
  if(params.url.indexOf('http') == -1){
    params.url = baseUrl + params.url;
  }
  
  // 请求数加一
  ajaxSendNum++;

  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })


  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        // 请求结束一个 减一
        ajaxSendNum--;

        // 当所有请求结束时  结束加载效果
        if(ajaxSendNum==0){
          wx.hideLoading();
        }
      }
    });
  });
}

