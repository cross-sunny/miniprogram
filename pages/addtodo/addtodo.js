Page({
    data: {
        content: "",    // 任务内容
        deadline: "",   // 截止时间（必须初始化空字符串）
        userId: ""      // 当前用户ID
    },

    onLoad() {
        const userId = wx.getStorageSync("userId");
        if (!userId) {
            wx.redirectTo({ url: "/pages/login/login" });
            return;
        }
        this.setData({ userId });
    },

    onContentInput(e) {
        this.setData({ content: e.detail.value.trim() });
    },

    // 必须确保这个方法名和wxml里的bindchange一致！
    onDeadlineChange(e) {
        // 打印日志，验证点击是否触发
        console.log("选择的时间：", e.detail.value);
        this.setData({ deadline: e.detail.value });
    },

    submitTodo() {
        if (!this.data.content) {
            wx.showToast({ title: "任务内容不能为空", icon: "none" });
            return;
        }
        wx.request({
            url: 'http://localhost:8080/todo/add',
            method: 'POST',
            data: {
                userId: this.data.userId,
                content: this.data.content,
                deadline: this.data.deadline
            },
            success: (res) => {
                if (res.data.code === 200) {
                    wx.showToast({ title: "新增成功", icon: "success" });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1000);
                } else {
                    wx.showToast({ title: res.data.msg || "新增失败", icon: "none" });
                }
            },
            fail: (err) => {
                console.error("新增任务失败：", err);
                wx.showToast({ title: "网络错误", icon: "none" });
            }
        });
    }
});