Page({
    data: { result: "" },
    rollDice() {
        this.setData({ result: "" });
        this.selectComponent("#dice").roll();
    },
    onRollEnd(e) {
        this.setData({ result: `你的点数：${e.detail.point}` });
    }
});