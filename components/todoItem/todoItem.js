Component({
    properties: {
        todo: { // 接收父组件传入的任务数据
            type: Object,
            value: {}
        }
    },
    data: {
        slideX: 0,  // 左滑距离
        startX: 0   // 触摸起始X坐标
    },
    methods: {
        // 触摸开始：记录起始位置
        touchStart(e) {
            this.setData({ startX: e.changedTouches[0].clientX });
        },
        // 触摸结束：判断左滑距离
        touchEnd(e) {
            const endX = e.changedTouches[0].clientX;
            const slideX = endX - this.data.startX;
            this.setData({ slideX: slideX < -50 ? -180 : 0 });
        },
        // 触发“完成”事件
        handleComplete() {
            this.triggerEvent('complete', { id: this.data.todo.id });
            this.setData({ slideX: 0 }); // 左滑复位
        },
        // 触发“删除”事件
        handleDelete() {
            this.triggerEvent('delete', { id: this.data.todo.id });
            this.setData({ slideX: 0 }); // 左滑复位
        }
    }
});