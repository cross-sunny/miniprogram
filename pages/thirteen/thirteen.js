Page({
    data: { currentCard: "", punish: "" },
    punishList: [
        "1：喝1杯",
        "2：喝2杯",
        "3：指定1人喝1杯",
        "4：所有人喝1杯",
        "5：自己喝半杯",
        "6：和左边的人碰杯",
        "7：讲笑话，不好笑喝1杯",
        "8：表演节目",
        "9：喝3杯",
        "10：指定2人喝2杯",
        "J：喝1杯+说秘密",
        "Q：喝2杯+模仿动物",
        "K：喝5杯"
    ],
    drawCard() {
        const idx = Math.floor(Math.random() * 13);
        const [card, punish] = this.punishList[idx].split("：");
        this.setData({ currentCard: card, punish });
    }
});