//index.js
//获取应用实例
//import("/compoments/recommend/recommend.js");
const app = getApp()
var template = require("../../compoments/tBar/tBar.js");
var page=0;

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
      {
        url: '../../images/i01.png',
        name: '热门推荐',
        cont: '01'
      },
      {
        url: '../../images/i02.png',
        name: '放水口子',
        cont: '02'
      },
      {
        url: '../../images/i03.png',
        name: '核审快速',
        cont: '03'
      }
    ],
    storelist: [],
  },

  onLoad: function () {
    template.tabbar("tabBar", 0, this)//0表示第一个tabbar
    // 广告设置
    self = this;
    //console.log(self.data.banner)
    wx.request({
      url: 'http://192.168.2.213:8080/index/getCarouselData',
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
      url: 'http://192.168.2.213:8080/index/getSystemMsgData',
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
    //下方贷款
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: "http://192.168.2.213:8080/index/getProductData",
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

  // 请求数据
  loadMore() {
    self = this;
    self.setData({
      hidden: false
    });
    wx.request({
      url: "http://192.168.2.213:8080/index/getProductData",
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

  fucClick(event) {
    var that = this;
    const id = event.currentTarget.dataset.id;
    console.log(id);//id 不同跳转到不同页面
    wx.navigateTo({
      url: '/pages/products/products?cont=' + id,
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
})
