Page({
    data: {
        username: "",
        password: ""
    },
    onUsernameInput(e) {
        this.setData({ username: e.detail.value.trim() }); // 去除空格
    },
    onPasswordInput(e) {
        this.setData({ password: e.detail.value.trim() }); // 去除空格
    },
    onRegister() {
        const { username, password } = this.data;

        // 1. 严格校验输入
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

        // 2. 显示加载中，提升体验
        wx.showLoading({ title: "注册中..." });

        // 3. 接口请求（域名不变，新增 fail 回调排查错误）
        wx.request({
            url: "http://10.32.108.92:8080/api/user/register",
            method: "POST",
            data: { username, password },
            header: {
                "Content-Type": "application/x-www-form-urlencoded" // 适配后端 @RequestParam 接收
            },
            success: (res) => {
                wx.hideLoading();
                if (res.data?.code === 200) {
                    wx.showToast({ title: "注册成功", icon: "success", duration: 1500 });
                    setTimeout(() => {
                        wx.navigateTo({ url: "/pages/login/login" });
                    }, 1500);
                } else {
                    wx.showToast({ title: res.data?.msg || "注册失败", icon: "none", duration: 1500 });
                }
            },
            fail: (err) => {
                wx.hideLoading();
                console.log("注册接口失败：", err); // 打开控制台查看具体错误
                wx.showToast({
                    title: "网络异常，请检查连接",
                    icon: "none",
                    duration: 2000
                });
            }
        });
    },
    toLogin() {
        wx.navigateTo({ url: "/pages/login/login" });
    }
});