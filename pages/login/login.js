const app = getApp()
var template = require("../../compoments/tBar/tBar.js");

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show : 0,
    user_name: "test",
    img_url: ""
  },
  
  onLoad: function () {
    var that = this;
    template.tabbar("tabBar", 2, this)//0表示第一个tabbar
    wx.checkSession({
      success(){
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              user_name: res.userInfo["nickName"],
              img_url: res.userInfo["avatarUrl"],
              show: 1
            })
          }
        })
      }
    })
  },

  loginClick:function(event){
    self = this;
    wx.checkSession({
      success() {
       //session_key 未过期，并且在本生命周期一直有效
        wx.getUserInfo({
          ///////
          success: function (res) {
            self.setData({
              user_name: res.userInfo["nickName"],
              img_url: res.userInfo["avatarUrl"],
              show: 1
            })
          }
        })
      },
      fail() {
       //session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: function (res) {
            //console.log(res.code)
            if (res.code) {
              wx.request({
                url: 'http://192.168.1.11:8080/login/user_login',
                data: {
                  code: res.code
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                },
                success: function (res) {
                  //console.log("access_token:", res);
                  //var token = res.data.access_token;
                  wx.getUserInfo({
                    success: function(res_) {
                      console.log(res.data["token"])
                      self.setData({
                        user_name: res_.userInfo["nickName"],
                        img_url: res_.userInfo["avatarUrl"],
                        show: 1,
                      })
                      wx.setStorage({
                        key: 'token',
                        data: res.data["token"],
                      })
                    }
                  })
                },
                fail: function (error) {
                  console.log(error);
                }
              })
            } else {
              console.log("error code:" + res.errMsg);
            }
          }
        })
      }
    })
  }
})