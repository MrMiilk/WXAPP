//index.js
//获取应用实例
//import("/compoments/recommend/recommend.js");
const app = getApp()
var template = require
//default_page = app.globalData.default_page,//默认的产品超市页面
("../../compoments/tBar/tBar.js");
var page = 0;
Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,
    selectedNav: '00',
    showspinner: true,
    spinners: [],
    banner: [],
    Swiper_data: [],
    functions: [
      
    ],
    storelist: [
      
    ],
    storelist_: [

    ]
  },
  apply_now: function (event) {
    //需要添加判断用户是否登陆参数，通过storage
    //没有登陆的跳转到登陆界面
    wx.navigateTo({
      url: '/pages/apply/apply',//需要添加具体类别的参数
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'xx',
      path: '/pages/index/main_page?share_id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad: function (options) {
    console.log('onLoad-options.id:' + options.share_id);
    page = 0;
    template.tabbar("tabBar", 0, this)//0表示第一个tabbar
    // 广告设置
    self = this;
    wx.request({
      url: 'http://192.168.1.6:8080/index/getCarouselData',
      data: {
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          //console.log(res);//获取的数据
          //数据填写
          for(var idx in res.data){
            self.data.banner.push({
              url: res.data[idx].pic_url,
              id: res.data[idx].id,
              link: res.data[idx].url
            })
          }
          self.setData(
            { banner: self.data.banner }
          )
        } else {
          console.log("fail");
          console.log(res);
        }
      },
      fail: function (res) {
        console.log('failed GET');
      }
    })
    //公告设置
    wx.request({
      url: 'http://192.168.1.6:8080/index/getSystemMsgData',
      data: {
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res);//获取的数据
          //数据填写
          for (var idx in res.data) {
            self.data.Swiper_data.push({
              url: 'url',
              title: res.data[idx].msg_content,
            })
          }
          self.setData(
            { Swiper_data: self.data.Swiper_data }
          )
        } else {
          console.log("fail");
          console.log(res);
        }
      },
      fail: function (res) {
        console.log('failed GET');
      }
    })
    //目录
    wx.request({
      url: 'http://192.168.1.6:8080/index/getCateData',
      data: {
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          app.globalData.default_page = res.data[0].id;//默认为第一页
          app.globalData.default_page_1 = res.data[1].id;
          app.globalData.default_page_2 = res.data[2].id;
          console.log(res);//获取的数据
          //数据填写
          for (var idx in res.data) {
            self.data.functions.push({
              url: res.data[idx].pic_url,
              name: res.data[idx].cate_name,
              cont: idx,
              id: res.data[idx].id
            })
            
          }
          self.setData(
            { 
              functions: self.data.functions,
             }
          )
        } else {
          console.log("fail");
          console.log(res);
        }
      },
      fail: function (res) {
        console.log('failed GET');
      }
    })
    //下方贷款
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: "http://192.168.1.6:8080/index/getProductData",
      data: {
        page: page,
        page_size: 4,
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          for (var idx in res.data) {
            self.data.storelist.push({
              id: res.data[idx].id,
              name: res.data[idx].pro_name,
              applycounts: res.data[idx].lenders_number,
              money: res.data[idx].loan_amount,
              rate: res.data[idx].monthly_interest_rate,
              time: res.data[idx].lending_time,
              photo: res.data[idx].pro_pic_url,
              buztype: res.data[idx].prompt_msg
            })
          }
          self.setData(
            { storelist: self.data.storelist }
          )
        }
        else {
          console.log("fail");
          console.log(res);
        }
        page++;
        self.setData({
          hidden: true
        });
      },
      fail: function (res) {
        console.log('failed GET');
      }
    });
  },

  fucClick(event) {
    var that = this;
    const id = event.currentTarget.dataset.id;
    var idx = event.currentTarget.dataset.idx;
    //console.log(id);
    //console.log(idx);//id 不同跳转到不同页面
    wx.redirectTo({
      url: '/pages/products/products?cont=' + id + '&id=' + idx,
    })
  },
  adOnClick(event){
    self = this
    const id = event.currentTarget.dataset.id
    //console.log(self.data.banner)
    for(var idx in self.data.banner){
      if (self.data.banner[idx].id == id){
        console.log(self.data.banner[idx].link)
        wx:wx.navigateTo({
          url: self.data.banner[idx].link,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
  },
  navitation(event) {
    let id = event.currentTarget.dataset.id;
    const that = this;
    console.log(id);
    if (id == that.data.selectedNav) {
      id = '00';
      that.setData({
        showspinner: false,
      })
    } else {
      that.setData({
        showspinner: true,
      })
    }
    console.log(id);
    that.setData({
      selectedNav: id,
    })
    let temps = that.data.spinners;
    if (id == '02') {
      temps = that.data.sort;
    } else if (id == '03') {
      temps = that.data.rank;
    } else if (id == '01') {
      temps = that.data.nearby;
    }
    that.setData({
      spinners: temps,
    })
  },

  spinnerclick(event) {
    const that = this;
    that.setData({
      showspinner: false,
    })
  },

  storelick(event) {
    const that = this;
    wx.navigateTo({
      url: '../store/store',
    })
  },
  
  loadMore() {
    self = this;
    self.setData({
      hidden: false
    });
    wx.request({
      url: "http://192.168.1.6:8080/index/getProductData",
      data: {
        page: page,
        page_size: 4,
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res);//获取的数据
          //数据填写
          for (var idx in res.data) {
            self.data.storelist.push({
              id: res.data[idx].id,
              name: res.data[idx].pro_name,
              applycounts: res.data[idx].lenders_number,
              money: res.data[idx].loan_amount,
              rate: res.data[idx].monthly_interest_rate,
              time: res.data[idx].lending_time,
              photo: res.data[idx].pro_pic_url,
              buztype: res.data[idx].prompt_msg
            })
          }
          self.setData(
            { storelist: self.data.storelist }
          )
        }
        else {
          console.log("fail");
          console.log(res);
        }
        page++;
        self.setData({
          hidden: true
        });
      },
      fail: function (res) {
        console.log('failed GET');
      }
    });
  },
})
