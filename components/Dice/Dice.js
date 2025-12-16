Component({
    data: {
        point: 1,
        rotate: 0
    },
    methods: {
        roll() {
            let timer = setInterval(() => {
                this.setData({
                    point: Math.floor(Math.random() * 6) + 1,
                    rotate: this.data.rotate + 30
                });
            }, 50);
            setTimeout(() => {
                clearInterval(timer);
                const point = Math.floor(Math.random() * 6) + 1;
                this.setData({ point, rotate: 0 });
                this.triggerEvent("rollEnd", { point });
            }, 1000);
        }
    }
});