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
    onRegister() {
        const { username, password } = this.data;
        if (!username || !password) {
            wx.showToast({ title: "账号密码不能为空", icon: "none" });
            return;
        }
        if (password.length < 6) {
            wx.showToast({ title: "密码至少6位", icon: "none" });
            return;
        }
        wx.request({
            url: "http://localhost:8080/api/user/register",
            method: "POST",
            data: { username, password },
            success: (res) => {
                if (res.data.code === 200) {
                    wx.showToast({ title: "注册成功" });
                    setTimeout(() => {
                        wx.navigateTo({ url: "/pages/login/login" });
                    }, 1500);
                } else {
                    wx.showToast({ title: res.data.msg, icon: "none" });
                }
            }
        });
    },
    toLogin() {
        wx.navigateTo({ url: "/pages/login/login" });
    }
});