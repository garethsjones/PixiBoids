/**
 * User: Shergar
 * Date: 26/10/2014
 * Time: 13:10
 */

$(document).ready(onReady)

$(window).resize(resize)
window.onorientationchange = resize;

var width = 480,
    height = 320,
    boidTexture,
    boids = [],
    maxX = width,
    minX = 0,
    maxY = height,
    minY = 0,
    initialBoidCount = 2,
    boidMinVelocity = 2,
    boidMaxVelocity = 6,
    count = 0,
    container,
    pixiLogo,
    clickImage,
    amount = 100;

var _360 = Math.PI * 2,
    _270 = Math.PI * 1.5,
    _180 = Math.PI,
    _90 = Math.PI * 0.5;

var canvas = document.createElement('canvas');
canvas.width = this.width;
canvas.height = this.height;

var interval = setInterval(function() {
    if (boids.length >= 200) {
        return clearInterval(interval);
    }
    addBoid();
}, 250)

PIXI.Texture.fromCanvas = function(canvas) {
    // give the canvas an id?
    var texture = PIXI.TextureCache[canvas];

    if (!texture) {
        var baseTexture = PIXI.BaseTextureCache[canvas];
        if(!baseTexture) baseTexture = new PIXI.BaseTexture(canvas);
        texture = new PIXI.Texture(baseTexture);
        PIXI.TextureCache[canvas] = texture;
    }

    return texture;
};

function onReady() {
    renderer = PIXI.autoDetectRenderer(800, 600);
    stage = new PIXI.Stage(0xFFFFFF);

    amount = (renderer instanceof PIXI.WebGLRenderer) ? 50 : 5;

    if (amount == 5) {
        renderer.context.mozImageSmoothingEnabled = false;
        renderer.context.webkitImageSmoothingEnabled = false;
    }

    document.body.appendChild(renderer.view);
    renderer.view.style.position = "absolute";
    stats = new Stats();

    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    requestAnimFrame(update);

    boidTexture = new PIXI.Texture.fromImage("bunny.png");
    pinkTexture = new PIXI.Texture.fromImage("pink-bunny.png");

    counter = document.createElement("div");
    counter.className = "counter";
    document.body.appendChild( counter);

    pixiLogo = document.getElementById("pixi");
    clickImage = document.getElementById("clickImage");

    container = new PIXI.SpriteBatch();
    stage.addChild(container);

    for (var i = 0; i < initialBoidCount; i++) {
        addBoid();
    }
    boids[0].texture = pinkTexture;

    $(renderer.view).mousedown(function(){
        onTouchStart()
    });

    document.addEventListener("touchstart", onTouchStart, true);
    //renderer.view.touchstart = onTouchStart();

    resize();
}

function onTouchStart(event)
{
    addBoid();
}

function resize()
{
    var width = $(window).width();
    var height = $(window).height();

    if (width > 800) width  = 800;
    if (height > 600) height = 600;

    maxX = width;
    minX = 0;
    maxY = height;
    minY = 0;

    var w = $(window).width() / 2 - width/2;
    var h = $(window).height() / 2 - height/2;

    renderer.view.style.left = $(window).width() / 2 - width/2 + "px";
    renderer.view.style.top = $(window).height() / 2 - height/2 + "px";

    stats.domElement.style.left = w + "px";
    stats.domElement.style.top = h + "px";

    counter.style.left = w + "px";
    counter.style.top = h + 49 + "px";

    clickImage.style.right = w + 108 + "px";
    clickImage.style.bottom = h + 17  + "px";

    renderer.resize(width, height);
}

function addBoid()
{
    var boid = new PIXI.Sprite(boidTexture);

    boid.position.x = (maxX + minX) / 2;
    boid.position.y = (maxY + minY) / 2;

    boid.velocity = (Math.random() * (boidMaxVelocity - boidMinVelocity)) + boidMinVelocity;
    boid.rotation = (Math.random() * _360);

    boid.anchor.x = 0.5;
    boid.anchor.y = 0.5;

    boids.push(boid);

    container.addChild(boid);

    count++;
    counter.innerHTML = count + " BOIDS";
}

function update()
{
    stats.begin();

    for (var i = 0; i < boids.length; i++)
    {
        var boid = boids[i];

        var neighbours = [boid],
            flockRotation = 0,
            flockVelocity = boid.velocity,
            flockX = boid.x,
            flockY = boid.y,
            desiredVelocity = boid.velocity,
            desiredRotation = boid.rotation;

        boid.alpha = 1;

        for (var j = 0; j < boids.length; j++) {
            if (i == j) {
                continue;
            }
            if (isWithinRadius(boid, boids[j], 50)) {
                neighbours.push(boids[j]);
                flockVelocity += boids[j].velocity;
                flockRotation += rotationDiff(boid, boids[j]);
                if (j == 0) {
                    boid.alpha = 0.5;
                }
            }
        }

        flockVelocity = flockVelocity / neighbours.length;
        flockX = flockX / neighbours.length;
        flockY = flockY / neighbours.length;

        if (flockVelocity > boid.velocity) {
            desiredVelocity += 0.2;
        } else if (flockVelocity < boid.velocity) {
            desiredVelocity -= 0.2;
        }

        if (flockRotation > 0) {
            desiredRotation += 0.1;
        } else if (flockRotation < 0) {
            desiredRotation -= 0.1;
        }

        if (boid.rotation > _270 || boid.rotation < _90) {
            if (flockX < boid.x) {
                desiredRotation += 0.1;
            } else if (flockX > boid.x) {
                desiredRotation -= 0.1;
            }
        } else {
            if (flockX > boid.x) {
                desiredRotation += 0.1;
            } else if (flockX < boid.x) {
                desiredRotation -= 0.1;
            }
        }

        if (boid.rotation > 0 && boid.rotation < _180) {
            if (flockY < boid.y) {
                desiredRotation -= 0.1;
            } else if (flockY > boid.y) {
                desiredRotation += 0.1;
            }
        } else {
            if (flockY > boid.y) {
                desiredRotation -= 0.1;
            } else if (flockY < boid.y) {
                desiredRotation += 0.1;
            }
        }

        // Spin
        boid.rotation = desiredRotation;

        // Move
        boid.velocity = desiredVelocity;
        dx = Math.sin(-boid.rotation) * boid.velocity;
        dy = Math.cos(-boid.rotation) * boid.velocity;

        boid.position.x += dx;
        boid.position.y += dy;

        // Wrap
        if (boid.position.x > maxX) {
            boid.position.x = minX - maxX + boid.position.x;
        } else if (boid.position.x < minX) {
            boid.position.x = maxX + boid.position.x;
        }

        if (boid.position.y > maxY) {
            boid.position.y = minY - maxY + boid.position.y;
        } else if (boid.position.y < minY) {
            boid.position.y = maxY + boid.position.y;
        }

        // Randomise
        if (Math.random() > 0.9) boid.rotation += (Math.random() - 0.5) / 20;
        boid.velocity += (Math.random() - 0.5) / 10;

        // Speed limit
        if (boid.velocity > boidMaxVelocity) {
            boid.velocity = boidMaxVelocity;
        } else if (boid.velocity < boidMinVelocity) {
            boid.velocity = boidMinVelocity;
        }

        if (boid.rotation > _360) {
            boid.rotation -= _360;
        }
    }

    renderer.render(stage);
    requestAnimFrame(update);
    stats.end();
}

function rotationDiff(boid1, boid2) {
    var diff = boid2.rotation - boid1.rotation;
    if (diff > _180) {
        diff -= _180;
        return -diff;
    } else if (diff < -_180) {
        diff += _180;
        return -diff;
    }

    return diff;
}

function isWithinRadius(boid1, boid2, radius) {
    return Math.abs(boid1.x - boid2.x) < radius &&
        Math.abs(boid1.y - boid2.y) < radius;
}