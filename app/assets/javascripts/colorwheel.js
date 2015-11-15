
(function (Raphael) {
    Raphael.colorwheel = function(x, y, size, initcolor, element) {
      return new Colorwheel(x, y, size, initcolor, element);
    };
    var pi = Math.PI,
        doc = document,
        win = window,
        Colorwheel = function (x, y, size, initcolor, element) {
            size = size || 200;
            var w3 = 3 * size / 200,
                w1 = size / 200,
                fi = 1.6180339887,
                segments = pi * size / 5,
                size20 = size / 14,
                size2 = size / 2,
                padding = 2 * size / 200,
                t = this;

            var H = 1, S = 1, B = 1, s = size - (size20 * 4);
            var r = element ? Raphael(element, size, size) : Raphael(x, y, size, size),
                xy = s / 6 + size20 * 2 + padding,
                wh = s * 2 / 3 - padding * 2;
            if(w1 < 1)
                w1 = 1;
            if(w3 < 1)
                w3 = 1;

            // ring drawing
            var a = pi / 2 - pi * 2 / segments * 1.3,
                //outer radius
                R = size2 - padding,
                //inner radius
                R2 = R - size20 * 2,
                path = ["M", size2, padding, "A", R, R, 0, 0, 1, R * Math.cos(a) + R + padding, R - R * Math.sin(a) + padding, "L", R2 * Math.cos(a) + R + padding, R - R2 * Math.sin(a) + padding, "A", R2, R2, 0, 0, 0, size2, padding + size20 * 2, "z"].join();
            for (var i = 0; i < segments; i++) {
                r.path(path).attr({
                    stroke: "none",
                    fill: "hsb(" + i * (255 / segments) / 255 + ", 1, 0.90)",
                    transform: "r" + [(360 / segments) * i, size2, size2]
                });
            }
            // ring outline drawing
            r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0", "M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                "stroke-width": w3,
                stroke: "#fff"
            });
            t.cursorhsb = r.set();
            var h = size20 * 2 + 2;
            //t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding - 1, h / fi, h, 3 * size / 200).attr({
            //    stroke: "#000",
            //    opacity: .5,
            //    "stroke-width": w3
            //}));
            t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding - 1, h / fi, h, 3 * size / 200).attr({
                stroke: "#000",
                opacity: 1,
                "stroke-width": w1
            }));
            t.ring = r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                fill: "#000",
                opacity: 0,
                stroke: "none"
            });

            t.H = t.S = t.B = 1;
            t.raphael = r;
            t.size2 = size2;
            t.wh = wh;
            t.x = x;
            t.xy = xy;
            t.y = y;

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
    Colorwheel.prototype.setH = function (x, y) {
        var d = Raphael.angle(x, y, 0, 0),
            rd = Raphael.rad(d);
        this.cursorhsb.attr({transform: "r" + [d + 90, this.size2, this.size2]});
        this.H = (d + 90) / 360;
        //this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
        this.onchange && this.onchange(this.color());
    };
    Colorwheel.prototype.docOnMove = function (dx, dy, x, y) {
        if (this.hsbOnTheMove) {
            this.setH(x - this.x - this.size2, y - this.y - this.size2);
        }
    };
    Colorwheel.prototype.remove = function () {
        this.raphael.remove();
        this.color = function () {
            return false;
        };
    };
    Colorwheel.prototype.color = function (color) {
        if (color) {
            color = Raphael.color(color);
            var d = color.h * 360;
            this.H = color.h;
            this.S = color.s;
            this.B = color.v;
            this.cursorhsb.attr({transform: "r" + [d, this.size2, this.size2]});
            //this.main.attr({fill: "hsb(" + this.H + ",1,1)"});
            var x = this.S * this.wh + this.xy,
                y = (1 - this.B) * this.wh + this.xy;
            this.cursor.attr({cx: x, cy: y});
            return this;
        } else {
            return Raphael.hsb2rgb(this.H, this.S, this.B).hex;
        }
    };
})(window.Raphael);
