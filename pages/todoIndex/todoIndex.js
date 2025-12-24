Page({
    data: {
        todoList: [], // 任务列表
        userId: null  // 当前用户ID（初始化为null）
    },

    onLoad() {
        // 1. 获取并验证本地存储的userId
        const storedUserId = wx.getStorageSync("userId");
        console.log("【onLoad】本地存储的userId原始值：", storedUserId);

        // 强制转换为数字类型（避免字符串类型导致后端接收异常）
        const userId = Number(storedUserId);
        if (isNaN(userId) || userId <= 0) {
            console.error("【onLoad】userId无效，跳转到登录页");
            wx.redirectTo({ url: "/pages/login/login" });
            return;
        }

        // 2. 存储有效的userId
        this.setData({ userId });
        console.log("【onLoad】最终使用的userId（数字类型）：", userId);

        // 3. 触发任务列表请求
        this.getTodoList();
    },

    // 获取任务列表核心方法（全量日志+错误处理）
    getTodoList() {
        const { userId } = this.data;
        console.log("【getTodoList】准备请求任务列表，userId：", userId);

        // 构造请求参数
        const requestParams = {
            url: 'http://localhost:8080/todo/list',
            method: 'GET', // 明确指定GET方法（后端接口是@GetMapping）
            data: { userId },
            timeout: 10000, // 10秒超时
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 适配后端GET请求
            },
            success: (res) => {
                console.log("【getTodoList-success】后端返回完整响应：", res);
                console.log("【getTodoList-success】res.data内容：", res.data);

                // 兜底处理：确保res.data存在
                if (!res.data) {
                    wx.showToast({ title: "接口无返回数据", icon: "none" });
                    return;
                }

                // 处理后端返回的状态码
                if (res.data.code === 200) {
                    const taskList = res.data.data || [];
                    console.log("【getTodoList-success】最终渲染的任务列表：", taskList);
                    this.setData({ todoList: taskList });
                    // 空列表提示（可选）
                    if (taskList.length === 0) {
                        wx.showToast({ title: "暂无任务", icon: "none" });
                    }
                } else {
                    wx.showToast({ title: `加载失败：${res.data.msg || "未知错误"}`, icon: "none" });
                }
            },
            fail: (err) => {
                console.error("【getTodoList-fail】请求失败详情：", err);
                // 根据错误类型给出具体提示
                const errMsg = err.errMsg || "网络异常";
                wx.showToast({ title: `请求失败：${errMsg}`, icon: "none" });
            },
            complete: () => {
                console.log("【getTodoList-complete】请求流程结束");
            }
        };

        // 发起请求
        wx.request(requestParams);
    },

    // 跳转到新增任务页
    toAddTodo() {
        wx.navigateTo({ url: "/pages/addtodo/addtodo" });
    },

    // 标记任务为完成
    completeTodo(e) {
        const id = e.detail.id;
        // 关键：把id和isDone拼到URL参数中
        const url = `http://localhost:8080/todo/updateStatus?id=${id}&isDone=1`;
        wx.request({
            url: url,
            method: 'PUT',
            // 移除原来的data字段（参数已在URL中）
            success: (res) => {
                if (res.data?.code === 200) {
                    this.getTodoList(); // 刷新列表
                } else {
                    wx.showToast({ title: res.data?.msg || "操作失败", icon: "none" });
                }
            },
            fail: (err) => {
                console.error("完成任务失败：", err);
                wx.showToast({ title: "网络错误", icon: "none" });
            }
        });
    },

    // 删除任务
    deleteTodo(e) {
        const id = e.detail.id;
        wx.showModal({
            title: "确认删除",
            content: "是否删除该任务？",
            success: (modalRes) => {
                if (modalRes.confirm) {
                    // 关键：把id拼到URL参数中
                    const url = `http://localhost:8080/todo/delete?id=${id}`;
                    wx.request({
                        url: url,
                        method: 'DELETE',
                        // 移除原来的data字段（参数已在URL中）
                        success: (res) => {
                            if (res.data?.code === 200) {
                                this.getTodoList(); // 刷新列表
                            } else {
                                wx.showToast({ title: res.data?.msg || "删除失败", icon: "none" });
                            }
                        },
                        fail: (err) => {
                            console.error("删除任务失败：", err);
                            wx.showToast({ title: "网络错误", icon: "none" });
                        }
                    });
                }
            }
        });
    }
});