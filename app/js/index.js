
$.getJSON('app/data/data.json', function(obj) {
	$(document).ready( function() {
	var I = '#',
	C = '.',
	cnv = '<canvas id="'+obj.cnv+'"></canvas>',
	header = '<header><h2>'+obj.title+'</h2></header>',
	main = '<div id="'+obj.container+'" class="trans3d"><section id="'+obj.carousel+'" class="trans3d"></section></div>',
	footer = '<footer><div id="'+obj.fps.name+'">Framerate: 0/60 FPS</div></footer>';
	$('body').prepend(main).prepend(header).prepend(cnv);


	$.each(obj.items, function(i, val) {
	  $(I+obj.carousel).append('<figure id="item1" class="'+obj.item+' trans3d"><img src="'+val.img+'"><a href="'+val.href+'" target="_blank" class="'+obj.inner+' trans3d">'+val.title+'</a></figure>');
	});

	function Particles(){
	  this.colors = obj.colors;
	  this.blurry = obj.blurry;
	  this.border = obj.border;
	  this.minRadius = obj.minRadius;
	  this.maxRadius = obj.maxRadius;
	  this.minOpacity = obj.minOpacity;
	  this.maxOpacity = obj.maxOpacity;
	  this.minSpeed = obj.minSpeed;
	  this.maxSpeed = obj.maxSpeed;
	  this.fps = obj.fps.fps;
	  this.numParticles = obj.numParticles;
	  this.canvas = document.getElementById(obj.cnv);
	  this.ctx = this.canvas.getContext('2d');
	}

	Particles.prototype.init = function(){
	  this.render();
	  this.createCircle();
	}

	Particles.prototype._rand = function(min, max){
	  return Math.random() * (max - min) + min;
	}

	Particles.prototype.render = function(){
	  var self = this,
		  wHeight = $(window).height(),
		  wWidth = $(window).width();

	  self.canvas.width = wWidth;
	  self.canvas.height = wHeight;

	  $(window).on('resize', self.render);
	}

	Particles.prototype.createCircle = function(){
	  var particle = [];

	  for (var i = 0; i < this.numParticles; i++) {
		var self = this,
			color = self.colors[~~(self._rand(0, self.colors.length))];

		particle[i] = {
		  radius    : self._rand(self.minRadius, self.maxRadius),
		  xPos      : self._rand(0, canvas.width),
		  yPos      : self._rand(0, canvas.height),
		  xVelocity : self._rand(self.minSpeed, self.maxSpeed),
		  yVelocity : self._rand(self.minSpeed, self.maxSpeed),
		  color     : 'rgba(' + color + ',' + self._rand(self.minOpacity, self.maxOpacity) + ')'
		}
		self.draw(particle, i);
	  }
	  self.animate(particle);
	}

	Particles.prototype.draw = function(particle, i){
	  var self = this,
		  ctx = self.ctx;
	  if (self.blurry === true ) {
		var grd = ctx.createRadialGradient(particle[i].xPos, particle[i].yPos, particle[i].radius, particle[i].xPos, particle[i].yPos, particle[i].radius/1.25);
		grd.addColorStop(1.000, particle[i].color);
		grd.addColorStop(0.000, 'rgba(' + obj.dotBorder + ')');
		ctx.fillStyle = grd;
	  } else {
		ctx.fillStyle = particle[i].color;
	  }
	  if (self.border === true) {
		ctx.strokeStyle = obj.strokeStyle;
		ctx.stroke();
	  }
	  ctx.beginPath();
	  ctx.arc(particle[i].xPos, particle[i].yPos, particle[i].radius, 0, 2 * Math.PI, false);
	  ctx.fill();
	}

	Particles.prototype.animate = function(particle){
	  var self = this,
			  ctx = self.ctx;
	  setInterval(function(){
		self.clearCanvas();
		for (var i = 0; i < self.numParticles; i++) {
		  particle[i].xPos += particle[i].xVelocity;
		  particle[i].yPos -= particle[i].yVelocity;
		  if (particle[i].xPos > self.canvas.width + particle[i].radius || particle[i].yPos > self.canvas.height + particle[i].radius) {
			self.resetParticle(particle, i);
		  } else {
			self.draw(particle, i);
		  }
		}
	  }, obj.fps.time/self.fps);
	}

	Particles.prototype.resetParticle = function(particle, i){
	  var self = this;
	  var random = self._rand(0, 1);
	  if (random > .5) {
		particle[i].xPos = -particle[i].radius;
		particle[i].yPos = self._rand(0, canvas.height);
	  } else {
		particle[i].xPos = self._rand(0, canvas.width);
		particle[i].yPos = canvas.height + particle[i].radius;
	  }
	  self.draw(particle, i);
	}

	Particles.prototype.clearCanvas = function(){
	  this.ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	var particle = new Particles().init();

	var w, container, carousel, item, radius, itemLength, rY, ticker, fps;
	var mouseX = 0;
	var mouseY = 0;
	var mouseZ = 0;
	var addX = 0;

	if (obj.counter) {
		$(I + obj.container).after(footer);
		var fps_counter = {
			tick: function ()
			{
				this.times = this.times.concat(+new Date());
				var seconds, times = this.times;

				if (times.length > this.span + 1)
				{
					times.shift();
					seconds = (times[times.length - 1] - times[0]) / obj.fps.time;
					return Math.round(this.span / seconds);
				}
				else return null;
			},

			times: [],
			span: 20
		};
		var counter = Object.create(fps_counter);
	}

	$(document).ready(init)

	function init() {
		w = $(window);
		container = $(I + obj.container);
		carousel = $(I + obj.carousel);
		item = $(C + obj.item);
		itemLength = $(C + obj.item).length;
		fps = $(I + obj.fps.name);
		rY = 360 / itemLength;
		radius = Math.round( (250) / Math.tan( Math.PI / itemLength ) );
		TweenMax.set(container, {perspective:obj.perspective})
		TweenMax.set(carousel, {z:-(radius)})

		for ( var i = 0; i < itemLength; i++ )
		{
			var $item = item.eq(i);
			var $block = $item.find(C+obj.inner);

	TweenMax.set($item, {rotationY:rY * i, z:radius, transformOrigin:"50% 50% " + -radius + "px"})
			animateIn( $item, $block );
		}

		window.addEventListener( "mousemove", onMouseMove, false );
		ticker = setInterval( looper, obj.fps.time/obj.fps.fps );
	}

	function animateIn( $item, $block ) {
		var $nrX = 360 * getRandomInt(2),
		$nrY = 360 * getRandomInt(2),
		$nx = -(2000) + getRandomInt( 4000 ),
		$ny = -(2000) + getRandomInt( 4000 ),
		$nz = -4000 +  getRandomInt( 4000 ),
		$s = obj.frame.start + (getRandomInt(obj.frame.RandomInt) * obj.frame.delay),
		$d = obj.init.start - (getRandomInt(obj.init.RandomInt) * obj.init.delay);

		TweenMax.set( $item, { autoAlpha:1, delay:$d } )
		TweenMax.set( $block, { z:$nz, rotationY:$nrY, rotationX:$nrX, x:$nx, y:$ny, autoAlpha:0} )
		TweenMax.to( $block, $s, { delay:$d, rotationY:0, rotationX:0, z:0,  ease:Expo.easeInOut} )
		TweenMax.to( $block, $s-.5, { delay:$d, x:0, y:0, autoAlpha:1, ease:Expo.easeInOut} )
	}

	function onMouseMove(event) {
		mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0025;
		mouseY = -(-(window.innerHeight * .5) + event.pageY ) * .01;
		mouseZ = -(radius) - (Math.abs(-(window.innerHeight * .5) + event.pageY ) - obj.mouse.size);
	}

	function looper() {
		addX += mouseX
		TweenMax.to( carousel, 1, { rotationY:addX, rotationX:mouseY, ease:Quint.easeOut } )
		TweenMax.set( carousel, {z:mouseZ } )
		if (obj.counter) {
			fps.text( 'Framerate: ' + counter.tick() + '/' + obj.fps.fps + ' FPS' )
		}
	}

	function getRandomInt( $n ) {
		return Math.floor((Math.random()*$n)+1);
	}

});});
