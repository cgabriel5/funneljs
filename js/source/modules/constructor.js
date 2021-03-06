// =============================== Library Class
var Library = class__({
    // class constructor
    "constructor__": function() {
        // cache arguments object
        var args = arguments;
        // not source points give warning and return
        if (!args) return console.warn("No source point(s) provided.");
        // if user does not invoke library with new keyword we use it for them by
        // returning a new instance of the library with the new keyword.
        if (!(this instanceof Library)) return new Library(true, args);
        // check if new keywords applied recursively:
        // when the new keywords is not used the arguments get passed into a new Library object.
        // this, the next time around, puts the arguments inside an array and therefore the following
        // time the arguments are accesses they are messed up. This check looks to find whether the
        // new keyword was recursively used. If so, the true arguments are reset to args[1].
        var is_recursive = (args[0] === true && dtype(args[1], "arguments"));
        // get elements from source points
        var points = to_array(is_recursive ? args[1] : args),
            elements = [],
            data_type,
            point, parts, cid;
        // loop over all source points, get descendants is :all is supplied
        for (var i = 0, l = points.length; i < l; i++) {
            // cache the current source point, i.e. -> #red:all or DOMElement
            point = points[i];
            // get the data type of the point
            data_type = dtype(point);
            // check whether the point is a string or an element
            if (data_type === "string") {
                point = point.trim();
                parts = point.split(":"); // -> ["#red", "all"]
                cid = document.getElementById(parts[0].replace(/^\#/, ""));
                if (!cid) continue; // no element with ID found...skip iteration
                // part[1] is the filer. when no filter is applied we add the
                // source point directly to elements array
                if (!parts[1]) elements = elements.concat([cid]);
                // else apply the filter and add all returned (filtered) elements to array
                else elements = elements.concat(to_array(this[parts[1]]([cid]))); // i.e. -> this.all()
            } else if (/^(html|text|comment)/.test(data_type)) { // HTMLElement/TextNode/Comment
                // **Note**: possibly use the element.nodeType attribute to determine
                // whether an element, text, comment, or the document was passed in instead?
                // [https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType]
                // For now only HTMLElements, Text/Comments nodes can be passed in.
                //
                // **Note: the selector can also take in raw element nodes (elements)
                // it can take N amount of DOM nodes. for example, using
                // Google Chrome's console this is a valid use case:
                // var a = Funnel($0, $1); Where $<number> represents an element from
                // the DOM. what is $0? => {https://willd.me/posts/0-in-chrome-dev-tools}
                // add the element point to the elements array
                elements = elements.concat([point]);
            }
        }
        // add object properties
        this.stack = [elements]; // add elements to the object
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
            // add elements to the object
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
        "textNodes": function(source) {
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
                    if (child_nodes[j].nodeType === 3 && child_nodes[j].textContent.trim()
                        .length) elements.push(child_nodes[j]);
                }
            }
            // only returns for constructor
            if (source) return elements;
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
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
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Screens collection of elements against provided attrs.]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "attrs": function() {
            // define vars
            var elements = [],
                this_ = this;
            // attribute filters
            var filters = {
                    /**
                     * @description [Checks that the element does not have the provided attribute.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @param  {Object} element [The element to check against.]
                     * @return {Bool}
                     */
                    "!": function(pav, value, element) {
                        return !(element.hasAttribute(pav));
                    },
                    /**
                     * @description [Checks if the element has the provided attribute.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @param  {Object} element [The element to check against.]
                     * @return {Bool}
                     */
                    " ": function(pav, value, element) {
                        return element.hasAttribute(pav);
                    },
                    /**
                     * @description [Checks if pav and the current set value match.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @param  {Object} element [The element to check against.]
                     * @return {Bool}
                     */
                    "=": function(pav, value) {
                        return pav === value;
                    },
                    /**
                     * @description [Checks to see if the pav and current set value do not match.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "!=": function(pav, value) {
                        return pav !== value;
                    },
                    /**
                     * @description [Checks whether the attr value ends with the provided string.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "$=": function(pav, value) {
                        return value.length - value.lastIndexOf(pav) === pav.length;
                    },
                    /**
                     * @description [Checks whether the attr value equals the provided value or starts with the provided string and a hyphen.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "|=": function(pav, value) {
                        /* ! is used to check if the value is at the zero index */
                        return !includes(value, pav) || !includes(value, pav + "-");
                    },
                    /**
                     * @description [Checks to see if the attr value starts with the provided string.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "^=": function(pav, value) {
                        /* ! is used to check if the value is at the zero index */
                        return !index(value, pav);
                    },
                    /**
                     * @description [Checks to see if the attr value contains the specific value provided; allowing for edge white spaces.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "~=": function(pav, value) {
                        return value.trim() === pav;
                    },
                    /**
                     * @description [Checks if the attr contains the value provided.]
                     * @param  {String} pav     [Provided attr value to check against.]
                     * @param  {String} value   [Currently set attribute value.]
                     * @return {Bool}
                     */
                    "*=": function(pav, value) {
                        return includes(value, pav);
                    }
                },
                /**
                 * @description [Filters element stack based on the attrs provided.]
                 * @param {Array} elements [The array of attributes provided.]
                 * @param {Array} attrs    [Array of screened elements.]
                 */
                set = function(elements, attrs) {
                    // define vars
                    var screened = [];
                    loop1: for (var current_element, i = 0, l = elements.length; i < l; i++) {
                        current_element = elements[i];
                        for (var current_attr, j = 0, ll = attrs.length; j < ll; j++) {
                            current_attr = attrs[j]; // i.e. -> ["type", "=", "file"] or [true, " " , type] or [false, "!", "value"]
                            if (!filters[current_attr[1]](current_attr[2], current_element.getAttribute(current_attr[0]), current_element)) continue loop1;
                            if (j === ll - 1) screened.push(current_element);
                        }
                    }
                    return screened;
                },
                /**
                 * @description [Parses paorived attrs.]
                 * @param  {Array} attrs [The array of attributes provided, both has and nothas.]
                 * @return {Array}       [An array containing the cleaned attributes.]
                 */
                input = function(attrs) {
                    // define vars
                    var types = Object.keys(filters),
                        ll = types.length,
                        screened = [];
                    loop1: for (var current_attr, i = 0, l = attrs.length; i < l; i++) {
                        current_attr = attrs[i].replace(/^\[|\]$/g, ""); // [type=file] -> type=file
                        for (var j = ll - 1; j > -1; j--) {
                            var type = types[j];
                            var check = includes(current_attr, type);
                            if (check) { // type found
                                var parts = current_attr.split(type);
                                screened.push([parts[0], type, parts[1]]);
                                continue loop1; // continue w/ next attribute check
                            } else if (!check && j === 1) { // when no value is supplied
                                // case [!type] -> checks that element does not have type attribute
                                if (current_attr.charCodeAt(0) === 33) screened.push([false, "!", current_attr.substring(1)]);
                                // else just checking if attribute is present -> [type]
                                else screened.push([true, " ", current_attr]);
                                continue loop1; // continue w/ next attribute check
                            }
                        }
                    }
                    return screened;
                };
            elements = set(this_.stack[this_.stack.length - 1], input(arguments));
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Shorthand for attribute methods, e.g. Library.form(":text").]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "form": function() {
            // define vars
            var this_ = this;
            // clean the provided arguments and pass it to the attr() function.
            // modify the arguments object...
            for (var args = arguments, i = 0, l = args.length; i < l; i++) {
                args[i] = "[type=" + args[i].replace(/^\:/, "") + "]";
            }
            // invoke the attr() method.
            this_.attrs.apply(this_, args);
            // no need to update just return self as the updating is done above when
            // attrs() method is invoked.
            return this_;
        },
        /**
         * @description [Screens stack based on their property state, disabled,
         *               selected, and checked.]
         * @param  {String} property [The property to check against.]
         * @param  {Bool} state    [Provided boolean to check property against.]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "state": function(property, state) {
            // define vars
            var elements = [],
                this_ = this,
                array = this_.stack[this_.stack.length - 1];
            // the states contains the 3 possible methods in whick to
            // filter by; empty, visible, and default property check (checked,
            // selected, etc.).
            var states = {
                // this takes into account both child elements and text nodes
                "empty": function(element, bool) {
                    return !element.childNodes.length === bool;
                },
                "visible": function(element, bool) {
                    return (((element.offsetHeight >= 1) ? 1 : 0) == bool);
                }
            };
            // If the property provided is not empty or visible we set filter function
            // to the other property provided. e.g. "checked".
            // [http://stackoverflow.com/questions/7851868/whats-the-proper-value-for-a-checked-attribute-of-an-html-checkbox]
            var filter = states[property] || function(element, bool, property) {
                return element[property] == bool;
            };
            // loop through elements and screen to see if they have the property set to the provided state of either true or false.
            for (var current_element, i = 0, l = array.length; i < l; i++) {
                current_element = array[i];
                if (filter(current_element, state, property)) elements.push(current_element);
            }
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Positional filter which skips elements at provided indices.]
         * @param  {Array}  indices_to_skip [Indices to be skipped.]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "skip": function(indices_to_skip) {
            // define vars
            var elements = [],
                this_ = this,
                array = this_.stack[this_.stack.length - 1],
                // if -1 is a provided index we shorten the length by 1. This means
                // the user wants to skip the last item.
                l = (includes(indices_to_skip, -1)) ? (array.length - 1) : array.length;
            // loop through and only adding to the screened array indices not found in the
            // indices_to_skip array.
            for (var i = 0; i < l; i++) {
                if (!includes(indices_to_skip, i)) elements.push(array[i]);
            }
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Positional filter which only gets elements at provided indices.]
         * @param  {Array}  wanted_indices [Indices where elements are wanted.]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "only": function(wanted_indices) {
            // define vars
            var elements = [],
                this_ = this,
                array = this_.stack[this_.stack.length - 1];
            // loop through and only add elements that match indices found in the provided
            // wanted_indices array. **Note: if the current wanted index is negative we simply
            // count backwards. e.g. array[l + current_windex].
            for (var current_windex, l = array.length, i = 0, ll = wanted_indices.length; i < ll; i++) {
                current_windex = wanted_indices[i];
                if (current_windex < l) elements.push((current_windex < 0) ? array[l + current_windex] : array[current_windex]);
            }
            // add elements to the object
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
            // (tilde-explanation)[http://stackoverflow.com/questions/12299665/what-does-a-tilde-do-when-it-
            // precedes-an-expression/12299717#12299717]
            if ( /*[1]*/ !~range[1] || /*[2]*/ stop > l) stop = l;
            // if provided start is larger than the elements array we reset it to 0.
            if (start > l) start = 0;
            // Loop through using the provided start, stop, and step values.
            for (var i = start; i < stop;) {
                elements.push(array[i]);
                i = i + step;
            }
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Returns last element collection stack. If an index is provided
         *               the element stack at that index is provided.]
         * @param  {Number} index [The element stack index to return.]
         * @return {Array} [Last element collection.]
         */
        "getStack": function(index) {
            // define vars
            var this_ = this,
                stacks = this_.stack;
            // reverse the stacks. the stack needs to be reversed because every
            // time a new stack is added to the stack it gets appended to the
            // stack. therefore, the the latest stack is the last one, but to
            // make it easier to get the wanted stack the stacks are reversed
            // to make the latest stack be at the 0th index.
            stacks.reverse();
            // default the index if not provided
            if (typeof index !== "number") index = 0;
            // reset the index if provided index is negative
            if (index < 0) index = (stacks.length + index);
            // get the wanted element stack
            var stack = stacks[index] || [];
            // unreverse array stack to revert it to its normal state
            stacks.reverse();
            // return the appropriate stack
            return stack;
        },
        /**
         * @description [Returns the first element of the last collection stack. If an
         *               index is provided that element at that index is returned.]
         * @param  {Number} index [The element stack index to return.]
         * @return {HTMLElement} [The needed element.]
         */
        "getElement": function(index) {
            // define vars
            var this_ = this,
                stack = this_.getStack.call(this_, index);
            // default the index if not provided
            if (typeof index !== "number") index = 0;
            // reset the index if provided index is negative
            if (index < 0) index = (stack.length + index);
            // get the wanted element
            var element = (stack[index] || null);
            // return the first element of the last stack,
            // or the element at the index provided
            return element;
        },
        /**
         * @status [No longer supported but kept for any possible future breakage.]
         * @description [Returns last element collection stack.]
         * @return {Array} [Last element collection.]
         */
        // "pop": function() {
        //     var this_ = this;
        //     return this_.stack[this_.stack.length - 1];
        // },
        /**
         * @description [Combines (concats) provided array of elements with the current
         *               stack of elements.]
         * @param  {Array} new_elements [The array of elements to concats initial array with.]
         * @return {Object}  [Return self to allow method chaining.]
         */
        "concat": function(new_elements) {
            // define vars
            var this_ = this,
                // the last stack
                array = this_.stack[this_.stack.length - 1],
                elements;
            // combine the last stack with the provided elements array
            elements = array.concat(new_elements || []);
            // add elements to the object
            this_.stack.push(elements);
            this_.length = elements.length;
            return this_;
        },
        /**
         * @description [Checks whether the last stack of is not empty.]
         * @param  {Array} new_elements [The array of elements to concats initial array with.]
         * @return {Boolean}  [True for non empty stack. Otherwise, false.]
         */
        "iterable": function() {
            // check for elements in the last stack
            // define vars
            var this_ = this,
                // the last stack
                array = this_.stack[this_.stack.length - 1];
            // check if the last stack is not empty
            return (array.length ? true : false);
        },
        /** @description [Empty method; added to mask object as an array.] */
        "splice": function() { /* noop */ },
    },
    // class to extend
    "extend__": false
});