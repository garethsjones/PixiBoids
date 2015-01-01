PixiBoids
=========

Gutted a Pixi.js example and turned it into a simple boid flocking app.

See the BunnyMark example @ http://www.pixijs.com/examples/

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.3.min.js"><\/script>')</script>
<script src="js/stats.min.js"></script>
<script src="js/pixi.dev.js"></script>
<script src="js/Math2.js"></script>

<script src="js/boids.js"></script>

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>

    /**
     * Provides bind in a cross browser way.
     */
    if (typeof Function.prototype.bind != 'function') {
        Function.prototype.bind = (function () {
            var slice = Array.prototype.slice;
            return function (thisArg) {
                var target = this, boundArgs = slice.call(arguments, 1);

                if (typeof target != 'function') throw new TypeError();

                function bound() {
                    var args = boundArgs.concat(slice.call(arguments));
                    target.apply(this instanceof bound ? this : thisArg, args);
                }

                bound.prototype = (function F(proto) {
                    proto && (F.prototype = proto);
                    if (!(this instanceof F)) return new F;
                })(target.prototype);

                return bound;
            };
        })();
    }
</script>