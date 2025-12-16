// pages/login/login.js
Page({
  data: {
    username: "",
    password: ""
  },

  onLoad() {
    this._isDestroyed = false;
  },

  onUnload() {
    this._isDestroyed = true;
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value.trim() }); // 增加 trim() 去除空格
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value.trim() }); // 增加 trim() 去除空格
  },

  onLogin() {
    if (this._isDestroyed) return;

    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({ title: "账号密码不能为空", icon: "none" });
      return;
    }

    const loginUrl = `https://pure-monostylous-lakenya.ngrok-free.dev/api/user/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    wx.request({
      url: loginUrl,
      method: "POST",
      success: (res) => {
        if (this._isDestroyed) return;
        if (res.data.code === 200) {
          wx.setStorageSync("user", { username: res.data.username });
          wx.showToast({ title: "登录成功", icon: "success" }); // 增加 success 图标
          setTimeout(() => {
            if (!this._isDestroyed) {
              // 增加跳转失败的回调捕获
              wx.switchTab({
                url: "/pages/gameIndex/gameIndex",
                fail: (err) => {
                  console.error("跳转失败：", err); // 打印错误信息
                  wx.showToast({ title: "跳转失败，请检查配置", icon: "none" });
                }
              });
            }
          }, 1500);
        } else {
          wx.showToast({ title: res.data.msg || "登录失败", icon: "none" });
        }
      },
      fail: (err) => {
        if (this._isDestroyed) return;
        console.error("登录失败:", err);
        wx.showToast({ title: "网络错误，请检查连接", icon: "none" });
      }
    });
  },

  toRegister() {
    if (!this._isDestroyed) {
      wx.navigateTo({ url: "/pages/register/register" });
    }
  }
});