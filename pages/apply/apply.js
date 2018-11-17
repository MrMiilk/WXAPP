//var app = require('../../resource/js/util.js');
var Util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',//姓名
    phone: '',//手机号
    code: '',//验证码
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    txt: '',
    _this:'',
  },
  onLoad: function (options) {
    //这里可以获取，设置一个变量存储
    var txt=options.kind;
      this.setData({
        txt:txt,
      })
  },
  getNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        url: "http://192.168.1.7:8080/apply/check_code",///
        header: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        data: { 
          token: wx.getStorageSync("token"),
          phone_num: this.data.phone,
         },
        success(res) {
          console.log(res)//后端获取的数据
          _this.setData({
            iscode: res.data.data
          })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        }
      })

    }


  },
  //获取验证码
  getVerificationCode: function() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  //提交表单信息
  save: function () {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.code != this.data.iscode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.setStorageSync('name', this.data.name);
      wx.setStorageSync('phone', this.data.phone);
      //将电话号码返回，表示成功验证
      wx.showModal({
        title: '提示',
        content: '模态弹窗',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
      wx.request({
        url: "http://192.168.1.7:8080/apply/verified_code",///
        header: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        data: {
          token: wx.getStorageSync("token"),
          phone_num: this.data.phone,
          idx: wx.getStorageSync("idx"),
          name: this.data.name,
        },
        success(res) {
          console.log(res)//后端获取的数据
        }
      })
      wx.redirectTo({
        url: '../index/main_page',
      })
    }
  },
})