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
