
(function (Raphael) {
    Raphael.colorbar = function(x, y, size, initcolor, element) {
      return new Colorbar(x, y, size, initcolor, element);
    };
    var pi = Math.PI,
        doc = document,
        win = window,
        Colorbar = function (x, y, size, initcolor, element) {
            size = size || 200;
            var w3 = 2 * size / 200;
                w1 = size / 300,
                fi = 1.6180339887,
                segments = size / 5,
                size50 = size / 50,
                size2 = size / 2,
                padding = 20,
                t = this;

            var H = 1, S = 1, B = 1, s = size - (size50 * 4);
            var r = element ? Raphael(element, size, size) : Raphael(x, y, size, size),
                xy = s / 6 + size50 * 2 + padding,
                wh = s * 2 / 3 - padding * 2;
            if (w1 < 1)
                w1 = 1;
            if(w3 < 1)
                w3 = 1;

            // ring drawing
            var a = pi / 2 - pi * 2 / segments * 1.3,
                R = size2 - padding,
                R2 = size2 - padding - size50 * 2;
                //カラーバーの形状定義
                //path = ["M", size2, padding, "A", R, R, 0, 0, 1, R * Math.cos(a) + R + padding, R - R * Math.sin(a) + padding, "L", R2 * Math.cos(a) + R + padding, R - R2 * Math.sin(a) + padding, "A", R2, R2, 0, 0, 0, size2, padding + size20 * 2, "z"].join();
            for (var i = 0; i < segments; i++) {
                //カラーバーの色変化定義
                //r.path(path).attr({
                //    stroke: "none",
                //    fill: "hsb(" + i * (255 / segments) / 255 + ", 1, 0.78)",
                //    transform: "r" + [(360 / segments) * i, size2, size2]
                //});
                r.rect(0, padding, 10, 20).attr({
                  stroke: "none",
                  fill: "hsb(" + i * (125 / segments) / 255 + ", 1, 0.90)",
                  transform: "t" + [5 * i, 0]
                });
            }
            //輪郭
            //r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0", "M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
            //  "stroke-width": w3,
            //  stroke: "#fff"
            //});
            //カラーバー上のインジケーター
            t.cursorhsb = r.set();
            var h = size50 * 2 + 2;
            t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding, h / fi, h, 3 * size / 200).attr({
                stroke: "#000",
                opacity: .5,
                "stroke-width": w3
            }));
            t.cursorhsb.push(t.cursorhsb[0].clone().attr({
                stroke: "#fff",
                opacity: 1,
                "stroke-width": w1
            }));
            t.ring = r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0M", size2, padding + size50 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size50 * 2, "l1,0"]).attr({
                fill: "#000",
                opacity: 0,
                stroke: "none"
            });

            // events
            t.ring.drag(function (dx, dy, x, y) {
                t.docOnMove(dx, dy, x, y);
            }, function (x, y) {
                t.hsbOnTheMove = true;
                t.setH(x - t.x - t.size2, y - t.y - t.size2);
            }, function () {
                t.hsbOnTheMove = false;
            });
        }
    Colorbar.prototype.setH = function (x, y) {
        var d = Raphael.angle(x, y, 0, 0),
            rd = Raphael.rad(d);
        this.cursorhsb.attr({transform: "r" + [d + 90, this.size2, this.size2]});
        this.H = (d + 90) / 360;
        this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
        this.onchange && this.onchange(this.color());
    };
    Colorbar.prototype.docOnMove = function (dx, dy, x, y) {
        if (this.hsbOnTheMove) {
            this.setH(x - this.x - this.size2, y - this.y - this.size2);
        }
    };
    Colorbar.prototype.remove = function () {
        this.raphael.remove();
        this.color = function () {
            return false;
        };
    };
    Colorbar.prototype.color = function (color) {
        if (color) {
            color = Raphael.color(color);
            var d = color.h * 360;
            this.H = color.h;
            this.S = color.s;
            this.B = color.v;
            this.cursorhsb.attr({transform: "r" + [d, this.size2, this.size2]});
            this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
            var x = this.S * this.wh + this.xy,
                y = (1 - this.B) * this.wh + this.xy;
            this.cursor.attr({cx: x, cy: y});
            return this;
        } else {
            return Raphael.hsb2rgb(this.H, this.S, this.B).hex;
        }
    };
})(window.Raphael);
