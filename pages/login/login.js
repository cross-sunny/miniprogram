Page({
  data: {
    username: "",
    password: ""
  },

  onLoad() {
    this._isDestroyed = false;
    // 调试日志：页面加载时打印本地存储的userId（方便排查）
    console.log("页面加载-本地存储的userId：", wx.getStorageSync("userId"));
  },

  onUnload() {
    this._isDestroyed = true;
  },

  // 用户名输入（去空格）
  onUsernameInput(e) {
    this.setData({ username: e.detail.value.trim() });
  },

  // 密码输入（去空格）
  onPasswordInput(e) {
    this.setData({ password: e.detail.value.trim() });
  },

  // 登录核心逻辑
  onLogin() {
    if (this._isDestroyed) return;

    const { username, password } = this.data;
    // 1. 基础校验
    if (!username || !password) {
      wx.showToast({ title: "账号密码不能为空", icon: "none" });
      return;
    }

    // 2. 拼接登录接口地址（encodeURIComponent避免特殊字符问题）
    const loginUrl = `http://localhost:8080/api/user/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    console.log("登录请求地址：", loginUrl); // 调试日志

    // 3. 发起登录请求
    wx.request({
      url: loginUrl,
      method: "POST",
      timeout: 10000, // 超时时间10秒
      success: (res) => {
        if (this._isDestroyed) return;

        // 调试日志：打印接口返回的完整数据
        console.log("登录接口返回数据：", res.data);

        // 4. 空值校验（避免res.data为undefined报错）
        if (!res.data) {
          wx.showToast({ title: "接口返回异常", icon: "none" });
          return;
        }

        // 5. 登录成功逻辑
        if (res.data.code === 200) {
          // 校验userId是否存在
          if (!res.data.userId || res.data.userId === "") {
            wx.showToast({ title: "登录信息缺失（无userId）", icon: "none" });
            return;
          }

          // 6. 存储用户信息到本地
          wx.setStorageSync("userId", res.data.userId);
          wx.setStorageSync("user", { username: res.data.username });
          console.log("登录成功-存储的userId：", res.data.userId); // 调试日志

          // 7. 提示+跳转
          wx.showToast({ title: "登录成功", icon: "success", duration: 1500 });
          setTimeout(() => {
            if (!this._isDestroyed) {
              wx.redirectTo({
                url: "/pages/todoIndex/todoIndex",
                fail: (err) => {
                  console.error("跳转失败：", err);
                  wx.showToast({ title: "跳转失败，请手动返回首页", icon: "none" });
                }
              });
            }
          }, 1500);
        } else {
          // 登录失败（账号密码错误等）
          wx.showToast({ title: res.data.msg || "登录失败", icon: "none" });
        }
      },
      fail: (err) => {
        if (this._isDestroyed) return;
        console.error("登录请求失败：", err); // 调试日志
        wx.showToast({ title: "网络错误，请检查ngrok/后端是否运行", icon: "none" });
      }
    });
  },

  // 跳转到注册页
  toRegister() {
    if (!this._isDestroyed) {
      wx.navigateTo({
        url: "/pages/register/register",
        fail: () => {
          wx.showToast({ title: "跳转注册页失败", icon: "none" });
        }
      });
    }
  }
});