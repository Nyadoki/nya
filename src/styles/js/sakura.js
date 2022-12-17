
(function() {

    function getRandomNum(min, max) {
        var range = max - min;
        var rand = Math.random();
        return(min + Math.round(rand * range));
    }

    function Sakura() {

        this.img = document.createElement('img');
        this.img.src = '../assets/sakura.png';
        this.img.style.position = 'fixed';
        this.img.height = getRandomNum(32, 48);
        this.x = getRandomNum(-this.img.height, window.innerWidth + window.innerHeight);
        this.y = -this.img.height;
        this.moveSpeed = getRandomNum(1, 3);
        this.angle = 0;
        this.turn = 0;
        this.shaft = getRandomNum(0, 1) === 0 ? 'x' : 'y';
        this.rotateSpeed = getRandomNum(-100, 100) / 100 * 4;
        this.overturnSpeed = getRandomNum(-100, 100) / 100 * 8;
        this.img.style.left = this.x + 'px';
        this.img.style.top = this.y + 'px';
        this.img.style.opacity = 0.8.toString();
        document.body.appendChild(this.img);

        this.update = function(dt) {
            this.x -= this.moveSpeed;
            this.y += this.moveSpeed;
            this.img.style.left = this.x + 'px';
            this.img.style.top = this.y + 'px';
            this.angle += this.rotateSpeed;
            this.turn += this.overturnSpeed;
            if (this.shaft === 'x') {
                this.img.style.transform = 'rotateX(' + this.turn + 'deg) rotate(' + this.angle + 'deg)';
            } else {
                this.img.style.transform = 'rotateY(' + this.turn + 'deg) rotate(' + this.angle + 'deg)';
            }
        };

        this.isOutOfWindow = function() {
            return this.y > window.innerHeight + this.img.height || this.x < -this.img.height;
        };

        this.delete = function() {
            document.body.removeChild(this.img);
        };

    }

    var sakuras = [];

    function load() {
    }

    function update(dt) {

        if (getRandomNum(0, 5) === 0) {
            sakuras.push(new Sakura());
        }

        sakuras.forEach(function (sakura) {
            sakura.update(dt);
        });

        for (var n = 0; n < sakuras.length; n++) {
            if (sakuras[n].isOutOfWindow()) {
                sakuras[n].delete();
                sakuras.splice(n, 1);
                break;
            }
        }

        console.debug('sakura count : ' + sakuras.length);
    }

    function start() {

        var fps = 60;
        var lastTime = new Date().getTime();
        var loop = function() {
            var nowTime = new Date().getTime();
            var deltaTime = nowTime - lastTime;
            if (deltaTime - 1000 / fps >= 0) {
                lastTime = nowTime;
                update(deltaTime / 1000);
            }
        };

        load();

        window.setInterval(loop, 1);
    }
    start();
})();
