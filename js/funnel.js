(function() {
    "use strict";

    var funneljs = (function() {

        // =============================== Helper Functions

        /**
         * @description [Makes an Array from an array like object (ALO). ALO must have a length property
         *               for it to work.]
         * @param  {ALO} alo [The ALO.]
         * @return {Array}   [The created array.]
         */
        function to_array(alo) {
            // vars
            var true_array = [];
            // loop through ALO and pushing items into true_array
            for (var i = 0, l = alo.length; i < l; i++) true_array.push(alo[i]);
            return true_array;
        }

        // =============================== Selector Class

        var Selector = class__({

            // class constructor
            "constructor__": function(source_points) {

                // not source points give warning and return
                if (!source_points) return console.warn("No source point(s) provided.");

                // if user does not inoke query with new keyword we use it for them by
                // returning a new instance of the selector with the new keyword.
                if (!(this instanceof Selector)) return new Selector(source_points);

                // properties
                this.stack = [];
                this.length = 0;

                // get elements from source points
                var points = source_points.replace(/\s+/g, "").split(/,/g),
                    elements = [],
                    point, parts, cid;

                for (var i = 0, l = points.length; i < l; i++) {
                    // cache the current source point, i.e. -> #red:all
                    point = points[i].trim();
                    parts = point.split(":"); // -> ["#red", "all"]
                    cid = document.getElementById(parts[0].replace(/^\#/, ""));
                    if (!cid) continue; // no element with ID found...skip iteration
                    // part[1] is the filer. when no filter is applied we add the
                    // source point directly to elements array
                    if (!parts[1]) elements = elements.concat([cid]);
                    // else apply the filter and add all returned (filtered) elements to array
                    else elements = elements.concat(to_array(this[parts[1]]([cid]))); // i.e. -> this.all()
                }

                // add elements to selector object
                this.stack.push(elements);
                this.length = elements.length;

            },

            // class methods
            "methods__": {},

            // class to extend
            "extend__": false

        });

        // return selector to add to glocal scope later...
        return Selector;

    })();

    // add to global scope for ease of use
    window.funneljs = funneljs;

})();
