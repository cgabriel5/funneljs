(function() {
    "use strict";

    var funneljs = (function() {

        // =============================== Helper Functions

        /**
         * @description [Returns index of given value in provided array.]
         * @param  {Array}    array [The array to check against.]
         * @param  {Integer}  value [The value to check.]
         * @return {Integer}        [Returns the index value. -1 if not in array.]
         */
        function index(array, value) {
            return array.indexOf(value);
        }
        /**
         * @description [Checks if the given value is in provided array.]
         * @param  {Array}   array [The array to check against.]
         * @param  {Integer} value [The value to check.]
         * @return {Boolean}       [description]
         * @source [https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/]
         */
        function in_array(array, value) {
            return -~index(array, value);
        }
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
        /**
         * @description [Checks if the supplied arrays have any items in common, or intersect.]
         * @param  {Array}   array1 [The first array to perform comparison with.]
         * @param  {Array}   array2 [The second array to perform comparison with.]
         * @return {Boolean}        [description]
         */
        function intersect(array1, array2) {
            // define vars
            var short_array = array1,
                long_array = array2,
                i = 0,
                l, a1_len = array1.length,
                a2_len = array2.length;
            // reset short and long arrays if arrays are equal in...
            // ...length or if length of first array is less than that...
            // ...of the second one.
            if (a1_len === a2_len || a1_len < a2_len) {
                short_array = array2;
                long_array = array1;
            }
            // use length of short array as the last iteration stop.
            // finally, check if arrays have anything in common.
            // returning true if a commonality is found. otherwise return false
            l = short_array.length;
            for (; i < l; i++)
                if (in_array(long_array, short_array[i])) return true;
            return false;
        }
        /**
         * @description [Internal helper function. Is used when the "tags", "classes", or "text" filters are invoked.]
         * @param  {Array}          this_ [The Selector object.]
         * @param  {String}         type  [The name of the filter being passed. (i.e. tags|classes|text)]
         * @param  {ArgumentsArray} args  [The passed in arguments object.]
         * @return {Array}                [Returns the filtered element collection stack.]
         */
        var helper_one = function(this_, type, args) {

            var elements,
                array = this_.stack[this_.stack.length - 1],
                /**
                 * @description [Cleans the provided tags into has and nothas arrays]
                 * @param  {Array}  args [The array of tags provided, both has and nothas]
                 * @return {Object}      [An object containing the cleaned tags]
                 */
                input = function(args) {

                    // loop through arguments and seprate between has and nots
                    // i.e. -> ["!input", "canvas"] -> has:["canvas"], not:["input"]
                    for (var has = [], not = [], current_item, i = 0, l = args.length; i < l; i++) {
                        current_item = args[i];
                        (current_item.charCodeAt(0) !== 33) ? has.push(current_item): not.push(current_item.substring(1));
                    }
                    return { "has": has, "not": not };

                },
                /**
                 * @description [Filters element stack with either tags|text|classes filters.]
                 * @param  {Array}    elements [The elements stack to filter.]
                 * @param  {Array}    has_not  [The array of tags|text|classes to filter against.]
                 * @param  {Function} filter   [The filter function to use.]
                 * @param  {Boolean}  reverse  [Reverse for not use (!).]
                 * @return {Array}             [The filtered elements.]
                 */
                has = function(elements, has_not, filter, reverse) {
                    for (var current_element, filtered = [], i = 0, l = elements.length; i < l; i++) {
                        current_element = elements[i];
                        if (filter(current_element, has_not, reverse)) filtered.push(current_element);
                    }
                    return filtered;
                },
                filters = {
                    /**
                     * @description [Checks whether element is of the wanted tag type.]
                     * @param  {Element}  element [The element to check.]
                     * @param  {Array} has_not [The array of tags to check with.]
                     * @param  {Boolean}  reverse [If provided, reverses check. Used for not (!).]
                     * @return {Boolean|Undefined}
                     */
                    tags: function(element, has_not, reverse) {
                        var check = in_array(has_not, element.tagName.toLowerCase());
                        // reverse for the not checks
                        if (reverse) check = !check;
                        if (check) return true;
                    },
                    /**
                     * @description [Checks whether element contains provided text(s) (substrings).]
                     * @param  {Element}  element [The element to check.]
                     * @param  {Array} has_not [The array of substrings to check with.]
                     * @param  {Boolean}  reverse [If provided, reverses check. Used for not (!).]
                     * @return {Boolean|Undefined}
                     */
                    text: function(element, has_not, reverse) {
                        for (var current_text, i = 0, l = has_not.length; i < l; i++) {
                            current_text = has_not[i];
                            var text_content = element.textContent.trim();
                            // text content must not be empty
                            if (text_content === "") continue;
                            var check = in_array(text_content, current_text);
                            // reverse for the not checks
                            if (reverse) check = !check;
                            if (!check) return; // fails to have a class we return
                            if (i === l - 1) return true; // must have all substrings provided,
                        }
                    },
                    /**
                     * @description [Checks whether element has wanted classes.]
                     * @param  {Element}  element [The element to check.]
                     * @param  {Array} has_not [The array of classes to check with.]
                     * @param  {Boolean}  reverse [If provided, reverses check. Used for not (!).]
                     * @return {Boolean|Undefined}
                     */
                    classes: function(element, has_not, reverse) {
                        for (var current_class, i = 0, l = has_not.length; i < l; i++) {
                            current_class = has_not[i];
                            var check = in_array((" " + element.className + " "), (" " + current_class + " "));
                            // reverse for the not checks
                            if (reverse) check = !check;
                            if (!check) return; // fails to have a class we return
                            if (i === l - 1) return true; // must have all classes provided,
                            // if last check and has class
                        }
                    }
                };

            // clean arguments
            var cleaned_input = input(args);
            // filter elements
            if (cleaned_input.has.length) elements = has(array, cleaned_input.has, filters[type]);
            if (cleaned_input.not.length) elements = has((elements || array), cleaned_input.not, filters[type], true /*reverse check*/ );
            return elements;
        };

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
            "methods__": {
                /**
                 * @description [Gets all elements from source point.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                 *                          self to allow method chaining.]
                 */
                "all": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through source and get all its elements
                    for (var i = 0; i < l; i++) {
                        elements = elements.concat(to_array(array[i].getElementsByTagName("*")));
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Gets text node elements of current stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "text_nodes": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements and get the current element's children while screening only for text nodes.
                    for (var current_element, child_nodes, i = 0; i < l; i++) {
                        current_element = array[i];
                        child_nodes = current_element.childNodes;
                        for (var j = 0, ll = child_nodes.length; j < ll; j++) {
                            if (child_nodes[j].nodeType === 3 && child_nodes[j].textContent.trim().length) elements.push(child_nodes[j]);
                        }
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Get the parent node of all elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "parent": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting their parents. only the first parent is gotten.
                    for (var i = 0; i < l; i++) {
                        elements.push(array[i].parentNode);
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Get all parent nodes of all elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "parents": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting all their parents.
                    for (var current_element, i = 0; i < l; i++) {
                        current_element = array[i];
                        while (current_element) {
                            current_element = current_element.parentNode;
                            if (current_element) elements.push(current_element);
                        }
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Get all the children of elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "children": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting all their children.
                    for (var i = 0; i < l; i++) {
                        elements = elements.concat(to_array(array[i].children));
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Get all the siblings of elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "siblings": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting the current elements siblings.
                    // the current element is skipped and not pushed into the set of screened elements.
                    for (var first_element, current_element, i = 0; i < l; i++) {
                        current_element = array[i];
                        first_element = current_element.parentNode.firstChild;
                        while (first_element) {
                            first_element = first_element.nextElementSibling;
                            if (first_element !== current_element && first_element) elements.push(first_element);
                        }
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Gets the element to the right, or next, of elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "next": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting all the current element's right adjacent element.
                    for (var i = 0; i < l; i++) {
                        elements.push(array[i].nextElementSibling);
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Gets the element to the left, or previous, of elements in stack.]
                 * @param  {Array}  source [A source point element contained in an array. **Source parameter
                 *                          is only present when running the constructor. Chaining methods
                 *                          does not provide the source parameter. Thus allowing the method to
                 *                          be chainable.]
                 * @return {Array|Object}  [Return elements array if invoked from constructor. Otherwise return
                                            self to allow method chaining.]
                 */
                "prev": function(source) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        l = (source) ? source.length : this_.length,
                        array = (source) ? source : this_.stack[this_.stack.length - 1];

                    // loop through the elements getting all the current element's right adjacent element.
                    for (var i = 0; i < l; i++) {
                        elements.push(array[i].previousElementSibling);
                    }

                    // only returns for constructor
                    if (source) return elements;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Screens collection of elements against provided tags.]
                 * @param  {Strings}  source [N amount of tag names in the form of strings.]
                 * @return {Object}  [Return self to allow method chaining.]
                 */
                "tags": function() {

                    // define vars
                    var elements = helper_one(this, "tags", arguments),
                        this_ = this;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Screens collection of elements against provided classes.]
                 * @param  {Strings}  source [N amount of classes in the form of strings.]
                 * @return {Object}  [Return self to allow method chaining.]
                 */
                "classes": function() {

                    // define vars
                    var elements = helper_one(this, "classes", arguments),
                        this_ = this;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Screens collection of elements against provided text(s).]
                 * @param  {Strings}  source [N amount of text (substrings).]
                 * @return {Object}  [Return self to allow method chaining.]
                 */
                "text": function() {

                    // define vars
                    var elements = helper_one(this, "text", arguments),
                        this_ = this;

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /**
                 * @description [Positional filter which screens elements based on a provided range.]
                 * @param  {Array}  range [The provided range to work with in the form [start, stop, step].]
                 * @return {Object}  [Return self to allow method chaining.]
                 * @example :even range => [0, -1, 2]
                 * @example :odd range => [1, -1, 2]
                 * @example :entire range => [0, -1, 1]
                 * @example :< 3 range => [0, 3, 1]
                 * @example :> 4 range => [4, -1, 1]
                 */
                "range": function(range) {

                    // define vars
                    var elements = [],
                        this_ = this,
                        array = this_.stack[this_.stack.length - 1],
                        l = array.length;
                    // cache range parts
                    var start = range[0],
                        stop = range[1] + 1,
                        step = (range[2] || 1);

                    // if the stop is set to -1 or the range provided is larger than the length of the
                    // elements array we need to reset the stop from -1 to the length of the elements array.
                    // [1] The user wants to cycle through all the elements.
                    // [2] Range exceeds length of the elements array.
                    if ( /*[1]*/ !~range[1] || /*[2]*/ stop > l) stop = l;

                    // if provided start is larger than the elements array we reset it to 0.
                    if (start > l) start = 0;

                    // Loop through using the provided start, stop, and step values.
                    for (var elements = [], i = start; i < stop;) {
                        elements.push(array[i]);
                        i = i + step;
                    }

                    // add elements to selector object
                    this_.stack.push(elements);
                    this_.length = elements.length;
                    return this_;

                },
                /** @description [Empty method; added to mask object as an array.] */
                // splice: function() { /* noop */ },
            },

            // class to extend
            "extend__": false

        });

        // return selector to add to glocal scope later...
        return Selector;

    })();

    // add to global scope for ease of use
    window.funneljs = funneljs;

})();
