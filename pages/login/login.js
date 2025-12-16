Page({
    data: {
        username: "",
        password: ""
    },
    onUsernameInput(e) {
        this.setData({ username: e.detail.value });
    },
    onPasswordInput(e) {
        this.setData({ password: e.detail.value });
    },
    onLogin() {
        const { username, password } = this.data;
        if (!username || !password) {
            wx.showToast({ title: "账号密码不能为空", icon: "none" });
            return;
        }
        wx.request({
           url: "http://10.32.108.92:8080/api/user/login",
           //url: "http://192.168.14.1:8080/api/user/login",
            method: "POST",
            data: { username, password },
            success: (res) => {
                if (res.data.code === 200) {
                    wx.setStorageSync("user", { username: res.data.username });
                    wx.showToast({ title: "登录成功" });
                    setTimeout(() => {
                        wx.switchTab({ url: "/pages/gameIndex/gameIndex" });
                    }, 1500);
                } else {
                    wx.showToast({ title: res.data.msg, icon: "none" });
                }
            }
        });
    },
    toRegister() {
        wx.navigateTo({ url: "/pages/register/register" });
    }
});