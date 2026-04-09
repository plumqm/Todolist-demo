Page({
  data: {
    webUrl: ""
  },

  onLoad() {
    const app = getApp()
    this.setData({
      webUrl: app.globalData.webUrl || ""
    })
  }
})
