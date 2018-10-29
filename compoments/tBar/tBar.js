//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "../../pages/index/main_page",
      "iconPath": "../../images/i06.png",
      "selectedIconPath": "../../images/i06.png",
      "text": "主页"
    },
    {
      "current": 0,
      "pagePath": "../../pages/products/products?cont=0&id=-1",
      "iconPath": "../../images/i06.png",
      "selectedIconPath": "../../images/i06.png",
      "text": "产品超市"
    },
    {
      "current": 0,
      "pagePath": "../../pages/login/login",
      "iconPath": "../../images/i06.png",
      "selectedIconPath": "../../images/i06.png",
      "text": "用户中心"
    }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  // otabbar[id] 页面的id
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}