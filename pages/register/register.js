Page({
  data: {
    username: "",
    password: ""
  },

  // 页面加载时初始化状态
  onLoad() {
    this._isDestroyed = false;
  },

  // 页面卸载时标记销毁
  onUnload() {
    this._isDestroyed = true;
  },

  onUsernameInput(e) {
    if (!this._isDestroyed) {
      this.setData({ username: e.detail.value.trim() });
    }
  },
  onPasswordInput(e) {
    if (!this._isDestroyed) {
      this.setData({ password: e.detail.value.trim() });
    }
  },

  onRegister() {
    if (this._isDestroyed) return;

    const { username, password } = this.data;

    // 原有输入校验逻辑保留
    if (!username) {
      wx.showToast({ title: "请输入用户名", icon: "none", duration: 1500 });
      return;
    }
    if (!password) {
      wx.showToast({ title: "请输入密码", icon: "none", duration: 1500 });
      return;
    }
    if (password.length < 6) {
      wx.showToast({ title: "密码至少6位", icon: "none", duration: 1500 });
      return;
    }

    wx.showLoading({ title: "注册中..." });

    // 关键修改：参数拼接到URL，用encodeURIComponent处理特殊字符（如中文、空格）
    const registerUrl = `https://pure-monostylous-lakenya.ngrok-free.dev/api/user/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    wx.request({
      url: registerUrl, // 拼接后的URL（替代原data传参）
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 保留原有header，适配表单参数格式
      },
      success: (res) => {
        if (this._isDestroyed) return; // 防护：页面已销毁则不操作

        wx.hideLoading();
        console.log("【注册响应】", res.data); // 调试用：查看具体返回内容

        if (res.data?.code === 200) {
          wx.showToast({ title: "注册成功", icon: "success", duration: 1500 });
          setTimeout(() => {
            if (!this._isDestroyed) {
              wx.navigateTo({ url: "/pages/login/login" }); // 保留原有跳转逻辑
            }
          }, 1500);
        } else {
          // 显示后端返回的具体错误信息
          const msg = res.data?.msg || "注册失败";
          wx.showToast({ title: msg, icon: "none", duration: 2000 });
        }
      },
      fail: (err) => {
        if (this._isDestroyed) return;

        wx.hideLoading();
        console.error("【注册请求失败】", err);
        wx.showToast({
          title: "网络异常，请检查连接",
          icon: "none",
          duration: 2000
        });
      }
    });
  },

  toLogin() {
    if (!this._isDestroyed) {
      wx.navigateTo({ url: "/pages/login/login" }); // 保留原有跳转逻辑
    }
  }
});