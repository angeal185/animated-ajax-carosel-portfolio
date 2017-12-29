$.getJSON("app/data/data.json", function(t) {
  var e = '<canvas id="' + t.cnv + '"></canvas>',
    a = "<header><h2>" + t.title + "</h2></header>",
    i = '<div id="' + t.container + '" class="trans3d"><section id="' + t.carousel + '" class="trans3d"></section></div>',
    n = '<footer><div id="' + t.fps + '">Framerate: 0/60 FPS</div></footer>';
  $("body").prepend(i).prepend(a).prepend(e), $.each(t.items, function(e, a) {
    $("#" + t.carousel).append('<figure id="item1" class="' + t.item + ' trans3d"><img src="' + a.img + '"><a href="' + a.href + '" target="_blank" class="' + t.inner + ' trans3d">' + a.title + "</a></figure>")
  }), $.getJSON("app/data/config.json", function(e) {
    function a() {
      this.colors = e.colors, this.blurry = e.blurry, this.border = e.border, this.minRadius = e.minRadius, this.maxRadius = e.maxRadius, this.minOpacity = e.minOpacity, this.maxOpacity = e.maxOpacity, this.minSpeed = e.minSpeed, this.maxSpeed = e.maxSpeed, this.fps = e.fps.fps, this.numParticles = e.numParticles, this.canvas = document.getElementById(t.cnv), this.ctx = this.canvas.getContext("2d")
    }

    function i() {
      c = $(window), h = $("#" + t.container), p = $("#" + t.carousel), l = $("." + t.item), f = $("." + t.item).length, v = $("#" + t.fps), m = 360 / f, u = Math.round(250 / Math.tan(Math.PI / f)), TweenMax.set(h, {
        perspective: e.perspective
      }), TweenMax.set(p, {
        z: -u
      });
      for (var a = 0; f > a; a++) {
        var i = l.eq(a),
          n = i.find("." + t.inner);
        TweenMax.set(i, {
          rotationY: m * a,
          z: u,
          transformOrigin: "50% 50% " + -u + "px"
        }), r(i, n)
      }
      window.addEventListener("mousemove", s, !1), y = setInterval(o, e.fps.time / e.fps.fps)
    }

    function r(t, a) {
      var i = 360 * d(2),
        n = 360 * d(2),
        r = -2e3 + d(4e3),
        s = -2e3 + d(4e3),
        o = -4e3 + d(4e3),
        c = e.frame.start + d(10) * e.frame.delay,
        h = e.init.start - d(8) * e.init.delay;
      TweenMax.set(t, {
        autoAlpha: 1,
        delay: h
      }), TweenMax.set(a, {
        z: o,
        rotationY: n,
        rotationX: i,
        x: r,
        y: s,
        autoAlpha: 0
      }), TweenMax.to(a, c, {
        delay: h,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        ease: Expo.easeInOut
      }), TweenMax.to(a, c - .5, {
        delay: h,
        x: 0,
        y: 0,
        autoAlpha: 1,
        ease: Expo.easeInOut
      })
    }

    function s(t) {
      x = .0025 * -(-(.5 * window.innerWidth) + t.pageX), w = .01 * -(-(.5 * window.innerHeight) + t.pageY), g = -u - (Math.abs(-(.5 * window.innerHeight) + t.pageY) - e.mouse.size)
    }

    function o() {
      P += x, TweenMax.to(p, 1, {
        rotationY: P,
        rotationX: w,
        ease: Quint.easeOut
      }), TweenMax.set(p, {
        z: g
      }), t.counter && v.text("Framerate: " + S.tick() + "/" + e.fps.fps + " FPS")
    }

    function d(t) {
      return Math.floor(Math.random() * t + 1)
    }
    a.prototype.init = function() {
      this.render(), this.createCircle()
    }, a.prototype._rand = function(t, e) {
      return Math.random() * (e - t) + t
    }, a.prototype.render = function() {
      var t = this,
        e = $(window).height(),
        a = $(window).width();
      t.canvas.width = a, t.canvas.height = e, $(window).on("resize", t.render)
    }, a.prototype.createCircle = function() {
      for (var t = [], e = 0; e < this.numParticles; e++) {
        var a = this,
          i = a.colors[~~a._rand(0, a.colors.length)];
        t[e] = {
          radius: a._rand(a.minRadius, a.maxRadius),
          xPos: a._rand(0, canvas.width),
          yPos: a._rand(0, canvas.height),
          xVelocity: a._rand(a.minSpeed, a.maxSpeed),
          yVelocity: a._rand(a.minSpeed, a.maxSpeed),
          color: "rgba(" + i + "," + a._rand(a.minOpacity, a.maxOpacity) + ")"
        }, a.draw(t, e)
      }
      a.animate(t)
    }, a.prototype.draw = function(t, a) {
      var i = this,
        n = i.ctx;
      if (i.blurry === !0) {
        var r = n.createRadialGradient(t[a].xPos, t[a].yPos, t[a].radius, t[a].xPos, t[a].yPos, t[a].radius / 1.25);
        r.addColorStop(1, t[a].color), r.addColorStop(0, "rgba(" + e.dotBorder + ")"), n.fillStyle = r
      } else n.fillStyle = t[a].color;
      i.border === !0 && (n.strokeStyle = e.strokeStyle, n.stroke()), n.beginPath(), n.arc(t[a].xPos, t[a].yPos, t[a].radius, 0, 2 * Math.PI, !1), n.fill()
    }, a.prototype.animate = function(t) {
      var a = this;
      a.ctx;
      setInterval(function() {
        a.clearCanvas();
        for (var e = 0; e < a.numParticles; e++) t[e].xPos += t[e].xVelocity, t[e].yPos -= t[e].yVelocity, t[e].xPos > a.canvas.width + t[e].radius || t[e].yPos > a.canvas.height + t[e].radius ? a.resetParticle(t, e) : a.draw(t, e)
      }, e.fps.time / a.fps)
    }, a.prototype.resetParticle = function(t, e) {
      var a = this,
        i = a._rand(0, 1);
      i > .5 ? (t[e].xPos = -t[e].radius, t[e].yPos = a._rand(0, canvas.height)) : (t[e].xPos = a._rand(0, canvas.width), t[e].yPos = canvas.height + t[e].radius), a.draw(t, e)
    }, a.prototype.clearCanvas = function() {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    };
    var c, h, p, l, u, f, m, y, v, x = ((new a).init(), 0),
      w = 0,
      g = 0,
      P = 0;
    if (t.counter) {
      $("body").append(n);
      var M = {
          tick: function() {
            this.times = this.times.concat(+new Date);
            var t, a = this.times;
            return a.length > this.span + 1 ? (a.shift(), t = (a[a.length - 1] - a[0]) / e.fps.time, Math.round(this.span / t)) : null
          },
          times: [],
          span: 20
        },
        S = Object.create(M)
    }
    $(document).ready(i)
  })
});
