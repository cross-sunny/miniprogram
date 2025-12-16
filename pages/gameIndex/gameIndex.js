Page({
    onShow() {
        if (!wx.getStorageSync("user")) {
            wx.navigateTo({ url: "/pages/login/login" });
        }
    },
    toDice() {
        wx.navigateTo({ url: "/pages/diceGame/diceGame" });
    },
    toThirteen() {
        wx.navigateTo({ url: "/pages/thirteen/thirteen" });
    }
});