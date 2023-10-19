//Random Colors
//Obtain random numbers through the random function Math. random() of JavaScript, and obtain integers through Math. floor
function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return r + ',' + g + ',' + b
}

//Random width
//Obtain a random number through Math. random() and an integer through Math. floor. At this point, pass in a num parameter
//Here, you can control the basic size of the circle, which has a width of 50. This is the width range of 50+num
function randomWidth(num) {
    let width = Math.floor(Math.random() * num + 50);
    return width
}

// Generate Circle
function createEle(x, y) {
    // At this point, call to control the random size of the circle and obtain the dom of the body through document.querySelector
    // Create a dom element through document.createElement
    let boxWidth = randomWidth(100)
    let body = document.querySelector('body')
    // body.style.backgroundColor = 'rgb(' + bgColor + ',0.5)'
    let ele = document.createElement('div')
    // At this point, call randomColor() to obtain the random color
    let color = randomColor()
    // Add a class name through classList. add
    ele.classList.add('ele')
    // Modifying the CSS style of elements through JavaScript
    ele.style.width = boxWidth + 'px'
    ele.style.height = boxWidth + 'px'
    ele.style.left = x + 'px'
    ele.style.top = y + 'px'
    // Set the rgba color of the background color through JS splicing
    ele.style.backgroundColor = 'rgba(' + color + ',0.5)'
    // Set the border color of rgb through JS splicing
    ele.style.borderColor = 'rgb(' + color + ')'
    // Add elements to it through appendChild
    body.appendChild(ele)
    // Set the delay execution through setTimeout, because in order to match the transition effect of CSS, if the execution is not delayed, this effect cannot be loaded
    // And it needs to be executed after appending the dom. Previously, a virtual dom was created,
    // and effects cannot be added at this time. After appending, it is now a real dom. When the dom tree is drawn, CSS style can be used
    setTimeout(function () {
        ele.style.opacity = 0
        ele.style.width = '60vw'
        ele.style.height = '60vw'
    }, 20)
    // The animation execution time takes 2.5 seconds, so delete the dom after the animation execution is completed
    setTimeout(function () {
        body.removeChild(ele)
    }, 2500)
}

// Adding an event in the binding click event can obtain the coordinate position of the mouse click. At this point, the coordinate position is passed into the creation function to generate the dom
document.onclick = function (e) {

}


function getstyle(obj, attr) {
    if (window.getComputedStyle) { //标准
        return getComputedStyle(obj)[attr];
    } else { //IE
        return obj.currentStyle[attr];
    }
}

function buffermove(obj, json, fn) {
    var speed = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var bstop = true;
        for (var attr in json) {
            var currentvalue = 0;
            if (attr === 'opacity') {
                currentvalue = Math.round(getstyle(obj, attr) * 100);
            } else {
                currentvalue = parseInt(getstyle(obj, attr));
            }
            speed = (json[attr] - currentvalue) / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (currentvalue != json[attr]) {
                if (attr === 'opacity') {
                    obj.style.opacity = (currentvalue + speed) / 100;
                    obj.style.filter = 'alpha(opacity:' + (currentvalue + speed) + ')';
                } else {
                    obj.style[attr] = currentvalue + speed + 'px';
                }
                bstop = false;
            }
        }

        if (bstop) {
            clearInterval(obj.timer);
            fn && fn();
        }

    }, 5);
}

//The properties bound to this can be used within the entire constructor, while variables can only be used within the function.
function Fireworks(x, y) {//x. Y Mouse position
    this.x = x;
    this.y = y;
    var that = this;
    //1.Create fireworks.
    this.ceratefirework = function () {
        this.firework = document.createElement('div');//The entire constructor can be used internally
        this.firework.style.cssText = `width:5px;height:5px;background:#fff;position:absolute;left:${this.x}px;top:${document.documentElement.clientHeight}px;`;
        document.body.appendChild(this.firework);
        this.fireworkmove();
    };
    //2. Fireworks Movement and Disappearance
    this.fireworkmove = function () {
        buffermove(this.firework, {top: this.y}, function () {
            document.body.removeChild(that.firework);//Fireworks disappear and fragments are generated
            that.fireworkfragment();
        });
    };
    //3.Create fragments of fireworks
    this.fireworkfragment = function () {
        for (var i = 0; i < this.ranNum(30, 60); i++) {
            this.fragment = document.createElement('div');
            this.fragment.style.cssText = `width:5px;height:5px;background:rgb(${this.ranNum(0, 255)},${this.ranNum(0, 255)},${this.ranNum(0, 255)});position:absolute;left:${this.x}px;top:${this.y}px;`;
            document.body.appendChild(this.fragment);
            this.fireworkboom(this.fragment);//Transfer the currently created fragments to facilitate movement and deletion
        }
    }


    //4.Debris movement
    this.fireworkboom = function (obj) {//obj:Fragments created


        //Set point speed (with different values and positive and negative symbols)
        var speedx = parseInt((Math.random() > 0.5 ? '-' : '') + this.ranNum(1, 15));
        var speedy = parseInt((Math.random() > 0.5 ? '-' : '') + this.ranNum(1, 15));


        //initial speed
        var initx = this.x;
        var inity = this.y;
        obj.timer = setInterval(function () {//A Box Movement
            initx += speedx;
            inity += speedy;
            if (inity >= document.documentElement.clientHeight || inity <= 0) {
                clearInterval(obj.timer);
                document.body.removeChild(obj);
            }
            if (initx >= document.documentElement.clientWidth || initx <= 0) {
                clearInterval(obj.timer);
                document.body.removeChild(obj);
            }
            obj.style.left = initx + 'px';
            obj.style.top = inity + 'px';
        }, 20);

    }


    //randomization method
    this.ranNum = function (min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    };
}


document.onclick = function (ev) {
    var ev = ev || window.event;
    createEle(ev.x, ev.y)
    new Fireworks(ev.clientX, ev.clientY).ceratefirework();
}
