const app = getApp()
var template = require("../../compoments/tBar/tBar.js");

Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show : 0,
    user_name: "test",
    img_url: "xxx"
  },
  
  onLoad: function () {
    var that = this;
    template.tabbar("tabBar", 2, this)//0表示第一个tabbar
    wx.checkSession({
      success(){
        that.setData({
          show:1,
        })
      }
    })
  },

  getInformation: function (){
    
  },

  passwordInput:function(event){
    this.data.pwd = event.detail.value;
  },

  usernameInput:function(event){
    this.data.name = event.detail.value;
  },

  loginClick:function(event){
    self = this;
    wx.checkSession({
      success() {
       // session_key 未过期，并且在本生命周期一直有效
        wx.getUserInfo({
          ///////
          success: function (res) {
            console.log(res)
          }
        })
      },
      fail() {
       // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: function (res) {
            //console.log(res.code)
            if (res.code) {
              wx.request({
                url: 'http://192.168.1.6:8080/login/user_login',
                data: {
                  code: res.code
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                },
                success: function (res) {
                  console.log("access_token:", res);
                  var token = res.data.access_token;
                  wx.getUserInfo({
                    ///////
                    success: function(res) {
                      console.log(res)
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