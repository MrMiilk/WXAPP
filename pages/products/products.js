const app = getApp()
var template = require("../../compoments/tBar/tBar.js");
// import tmp from "../../compoments/recommend/recommend.js";
var page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '1',
    storelist: [],
    default_page_: 0,
    kind:'',
    cate_name0:'',
    cate_name1:'',
    cate_name2:'',
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取当前页面加载内容
   */
  onLoad: function (options) {
    self = this;
    template.tabbar("tabBar", 1, this)
    var that = this
    var tmp = 0
    // console.log(options)
    that.setData({
      content: options.cont,
    })
    if(options.id == -1){
      tmp = app.globalData.default_page
    }else{
      tmp = options.id
    }
    that.setData({
      default_page_ : tmp,
      cate_name0: app.globalData.cate_name0,
      cate_name1: app.globalData.cate_name1,
      cate_name2: app.globalData.cate_name2,
    })
    console.log(that.data.default_page_)//测试，如果能得到
    console.log(that.data.cate_name1)
    //贷款详情
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: "http://192.168.1.7:8080/index/getCateProductData",
      data: {
        cate_id: this.data.default_page_,
        page: 0,
        page_size: 7
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

  apply_now: function (event) {
    //需要添加判断用户是否登陆参数，通过storage
    //没有登陆的跳转到登陆界面
    var kind = event.currentTarget.id;
    console.log(kind);
    if (kind!= '')
      wx.checkSession({
        success() {
          wx.navigateTo({
            url: '/pages/apply/apply?kind=' + kind,//需要添加具体类别的参数
          })
        },
      fail() {
        wx.redirectTo({
          url: '/pages/login/login',//需要登陆
        })
      }
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
    
  },
  tabChart(event){
    const id = event.currentTarget.id;
    var tmp = app.globalData.default_page;
    if(id == 0){
      tmp = app.globalData.default_page
    }
    if(id == 1){
      tmp = app.globalData.default_page_1
    }
    if(id == 2){
      tmp = app.globalData.default_page_2
    }
    //console.log(id)
    wx:wx.redirectTo({
      url: '/pages/products/products?cont=' + id + '&id=' + tmp,
      success: function (res) {
      },
      fail: function (res) {
      },
      complete: function(res) {},
    })
  }
})