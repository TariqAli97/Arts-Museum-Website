

 // Variables
    var radius = screen.width < 768 ? 145 : 290;
    var autoRotate = true;
    var rotateSpeed = -60;
    var imgWidth = screen.width < 768 ? 108 : 200;
    var imgHeight = screen.width < 768 ? 108 : 300;

    // DOM elements
    var odrag = document.querySelector('#drag-container');
    var ospin = document.querySelector('#spin-container');
    var aImg = ospin.getElementsByTagName('img');
    var aEle = [...aImg];

    // set width/height
    ospin.style.width = imgWidth + 'px';
    ospin.style.height = imgHeight + 'px';

    var ground = document.querySelector('#ground');
    ground.style.width = radius * 3 + 'px';
    ground.style.height = radius * 3 + 'px';

    // init rotation
    setTimeout(init, 1000);
    function init(delayTime) {
      for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = 'transform 1s';
        aEle[i].style.transitionDelay = delayTime || ((aEle.length - i) / 4) + 's';
      }
    }

    // manual rotation variables
    var tX = 0;
    var tY = 10;
    var desX = 0;
    var desY = 0;

    // autoplay rotation
    if (autoRotate) {
      var animationName = (rotateSpeed > 0 ? 'spin' : 'spinReverse');
      ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    }

    // drag mouse/touch support
    document.onpointerdown = function (e) {
      clearInterval(odrag.timer);
      var sX = e.clientX, sY = e.clientY;

      this.onpointermove = function (e) {
        var nX = e.clientX, nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
      };

      this.onpointerup = function () {
        this.onpointermove = null;
        odrag.timer = setInterval(() => {
          desX *= 0.95;
          desY *= 0.95;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTransform(odrag);
          if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) clearInterval(odrag.timer);
        }, 17);
      };
      return false;
    };

    function applyTransform(obj) {
      if (tY > 180) tY = 180;
      if (tY < 0) tY = 0;
      obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
    }

    // pause carousel on hover
    ospin.addEventListener('mouseenter', () => {
      ospin.style.animationPlayState = 'paused';
    });
    ospin.addEventListener('mouseleave', () => {
      ospin.style.animationPlayState = 'running';
    });

    // reverse animation keyframes
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`@keyframes spinReverse {
      from { transform: translate(-50%, -50%) rotateY(360deg); }
      to { transform: translate(-50%, -50%) rotateY(0deg); }
    }`, styleSheet.cssRules.length);