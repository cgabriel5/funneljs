/*
 * Copyright 2015 Anthony Gabriel
 * Released under the MIT license
 * @description "a simple js selector engine"
 * @name "funnel.js"
 * @version "0.0.1"
 * @notes "not production ready. just a personal project for now. :)"
 */
(function() {
    "use strict";
    var main = (function() {
        // Library Helper Methods
        /**
         * @description [Returns index of given value in provided array.]
         * @param  {Array}    array [The array to check against.]
         * @param  {Integer}  value [The value to check.]
         * @return {Integer}        [Returns the index value. -1 if not in array.]
         */
        var index = function(array, value) {
            return array.indexOf(value);
        };
        /**
         * @description [Checks if the given value is in provided array.]
         * @param  {Array}   array [The array to check against.]
         * @param  {Integer} value [The value to check.]
         * @return {Boolean}       [description]
         * @source [https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/]
         */
        var in_array = function(array, value) {
            return -~index(array, value);
        };
        /**
         * @description [Creates an array from an array like object.]
         * @param  {ArrayLikeObject} object [Object to make real array from.]
         * @return {Array}                  [The newly created array.]
         */
        var to_array = function(object) {
            // define vars
            var i = 0,
                l = object.length,
                true_array = [];
            // loop through array like object, pushing items into...
            // ...true_array var
            for (; i < l; i++) true_array.push(object[i]);
            return true_array;
        };
        /**
         * @description [Checks if the supplied arrays have any items in common, or intersect.]
         * @param  {Array}   array1 [The first array to perform comparison with.]
         * @param  {Array}   array2 [The second array to perform comparison with.]
         * @return {Boolean}        [description]
         */
        var intersect = function(array1, array2) {
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
        };
        /**
         * @description [Internal helper function. Is used when the "tags", "classes", or "text" filters are invoked.]
         * @param  {Array}          _    [The internal element collection stack.]
         * @param  {String}         type [The name of the filter being passed. (i.e. tags|classes|text)]
         * @param  {ArgumentsArray} a    [The passed in arguments object.]
         * @return {Array}               [Returns the filtered element collection stack.]
         */
        var helper_one = function(_, type, a) {
            /**
             * @description [Cleans the provided tags into has and nothas arrays]
             * @param  {Array}  args [The array of tags provided, both has and nothas]
             * @return {Object}      [An object containing the cleaned tags]
             */
            var input = function(args) {
                    if (!args.length) return {
                        has: [],
                        not: []
                    };
                    for (var has = [], not = [], c, i = 0, l = args.length; i < l; i++) {
                        c = args[i];
                        if (in_array(c, "|")) {
                            has.push(c.split("|"));
                            continue;
                        }
                        if (c.charCodeAt(0) !== 33) has.push(c);
                        else not.push(c.substring(1));
                    }
                    return {
                        has: (has.length) ? has : [],
                        not: (not.length) ? not : []
                    };
                },
                has = function(elements, type, has_not, fn, not) {
                    var f, func, screened = [],
                        i = 0,
                        l = elements.length,
                        c;
                    if (type === "tags") {
                        for (; i < l; i++) {
                            c = elements[i];
                            f = fn(c, has_not);
                            // if the not parameter is supplied we need to return the opposite of the function
                            func = (!not) ? f : !f;
                            if (func) screened.push(c);
                        }
                    } else if (type === "text") {
                        for (; i < l; i++) {
                            c = elements[i];
                            if (fn(c, has_not, not)) screened.push(c);
                        }
                    } else { // classes
                        for (var ll = elements.length; i < ll; i++) {
                            c = elements[i];
                            if (fn(c, has_not, not)) screened.push(c);
                        }
                    }
                    return screened;
                },
                elements,
                array = get_stack(_),
                args = input(a),
                types = {
                    tags: function(element, has_not) {
                        return in_array(has_not, element.tagName.toLowerCase());
                    },
                    text: function(element, has_not, not) {
                        var cc, j = 0,
                            ll = has_not.length,
                            f, func;
                        for (; j < ll; j++) {
                            cc = has_not[j];
                            f = in_array(element.textContent, cc);
                            // if the not parameter is supplied we need to return the opposite of the function
                            func = (not) ? f : !f;
                            if (func) return;
                            if (j === ll - 1) return element;
                        }
                    },
                    classes: function(element, has_not, not) {
                        var cc, j = 0,
                            l = has_not.length,
                            f, func, class_list = " " + element.className + " ";
                        for (; j < l; j++) {
                            cc = has_not[j];
                            if (typeof cc === "object") { // for has only
                                if (class_list === "  ") return;
                                if (!intersect(class_list.trim().split(" "), cc, element)) return;
                            } else {
                                f = in_array(class_list, " " + cc + " ");
                                // if the not parameter is supplied we need to return the opposite of the function
                                func = (not) ? f : !f;
                                if (func) return;
                            }
                            if (j === l - 1) return element;
                        }
                    }
                };
            if (args.has.length) elements = has(array, type, args.has, types[type]);
            if (args.not.length) elements = has((elements || array), type, args.not, types[type], true /*to reverse function*/ );
            return elements;
        };
        var next_or_prev = function(_, type, source) {
            // Define the variables. Cache the "this" keyword.
            var elements = [],
                // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                l = (source) ? source.length : _.length,
                array = (source) ? source : get_stack(_);
            // Loop through the elements getting all the current element's right adjacent element.
            for (var i = 0; i < l; i++) {
                elements.push(array[i][type]);
            }
            return elements;
        };
        /**
         * @description [Update the objects element stack by appending the provided set to the end of the stack]
         * @param  {Object} object   [Interal App object to update.]
         * @param  {Array}  elements [Array of elements to add to the app object.]
         * @return {Null}
         */
        var update_stack = function(object, elements) {
            // If no elements are passed set the length to 0 and push an empty array into the element stack.
            if (!elements) {
                object.stack.push([]);
                object.length = 0;
                return;
            }
            // Pushes the provided collection of elements to the objects element stack.
            object.stack.push(elements);
            // Reset the objects length to the length of the supplied collection of elements.
            object.length = elements.length || 0;
        };
        /**
         * @description [Returns the last element collection stack.]
         * @param  {Object} object [Internal App object.]
         * @return {Array}         [The last element collection stack.]
         */
        var get_stack = function(object) {
            return object.stack[object.stack.length - 1];
        };

        // Main Initiation Function

        var main = function() {};
        /**
         * @description [Initiation function that creates the new object and gets the source point collections.]
         * @param  {String} source_points [The id of the element that will be used as the source.]
         * @param  {String} filter        [Used internally for another project.]
         * @return {Object}               [An array like object containing the source element and the core methods]
         */
        main["funnel"] = function(source_points, filter) {
            // Checks if the user used the "new" keyword. If they didn't we..
            // return, making it a recursive function. This time calling...
            // it with the "new" keyword
            if (!this instanceof main) return new main(source_points, filter);
            // Split the provided string containing the source points to..
            // turn it into an array.
            var methods = main.methods;
            // Create a new object that will contain the element stack...
            // and object methods. Its length is defaulted to one as...
            // there is only one source point during this time.
            var _ = {
                "stack": [],
                length: 1
            };
            // Apply the useable methods to the newly created object.
            for (var method_name in methods) _[method_name] = methods[method_name];
            // Loop through each source point. Within the loop we split the...
            // point into parts; the id and the base method type. Next we get...
            // the element from the dom. If it doesn't exist we skip the...
            // iteration. If it does exist we apply the base method and concat...
            // the returned element to the elements array.
            if (typeof source_points === "string") {
                var source_points = source_points.split(" ");
                for (var elements = [], parts, cid, i = 0, l = source_points.length; i < l; i++) {
                    parts = source_points[i].split(":");
                    cid = document.getElementById(parts[0].substring(1));
                    if (!cid) continue;
                    if (!parts[1]) elements = elements.concat(to_array([cid]));
                    else elements = elements.concat(to_array(_[parts[1]].call(_, [cid])));
                }
            } else {
                var elements = (!filter && Object.prototype.toString.call(source_points) === "[object Array]") ? source_points : [source_points]; // path check:events system
            }
            // Finally, once looped we update the objects element stack...
            // and reset its length. At the end we return the object[_]...
            // to allow for method chaining.
            update_stack(_, elements);
            return _;
        };
        // Usable Core Methods
        main.methods = {
            /**
             * @description [Gets all the elements from the source point.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            all: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base...
                    // buildup from the main(); function and no where else.
                    // Therefore, depenging on whether this is supplied or...
                    // not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements getting all their descendants and...
                // concatinating them into the elements array.
                for (var i = 0; i < l; i++) {
                    elements = elements.concat(to_array(array[i].getElementsByTagName("*")));
                }
                // If the source vairable is present simply return to the main()...
                // function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain...
                // method so we update the element stack and reset the its...
                // length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Gets the text nodes within the provided elements.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            text_nodes: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements. Within, we get the current elements children and screen for the text nodes.
                for (var c, cc, i = 0; i < l; i++) {
                    c = array[i];
                    cc = c.childNodes;
                    for (var j = 0, ll = cc.length; j < ll; j++) {
                        if (cc[j].nodeType === 3 && cc[j].textContent.trim().length) elements.push(cc[j]);
                    }
                }
                // If the source vairable is present simply return to the main(); function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Get the parent nodes of all the elements provided.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            parent: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements getting their parents. Only the first parent is gotten.
                for (var i = 0; i < l; i++) {
                    elements.push(array[i].parentNode);
                }
                // If the source vairable is present simply return to the main(); function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Get all the parent nodes of all the elements provided.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            parents: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements getting all their parents.
                for (var c, i = 0; i < l; i++) {
                    c = array[i];
                    while (c) {
                        c = c.parentNode;
                        if (c) elements.push(c);
                    }
                }
                // If the source vairable is present simply return to the main(); function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Get all the children of the elements provided.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            children: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements getting all their children.
                for (var i = 0; i < l; i++) {
                    elements = elements.concat(to_array(array[i].children));
                }
                // If the source vairable is present simply return to the main(); function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Get all the siblings of the provided elements.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            siblings: function(source) {
                // Define the variables. Cache the "this" keyword.
                var elements = [],
                    _ = this,
                    // **Note: the source variable supplied during the inital base buildup from the main(); function and no where else. Therefore, depenging on whether this is supplied or not the length[l] and array values will vary.
                    l = (source) ? source.length : _.length,
                    array = (source) ? source : get_stack(_);
                // Loop through the elements getting the current elements siblings. The current element is skipped and not pushed into the set of screened elements.
                for (var first, c, i = 0; i < l; i++) {
                    c = array[i];
                    first = c.parentNode.firstChild;
                    while (first) {
                        first = first.nextElementSibling;
                        if (first !== c && first) elements.push(first);
                    }
                }
                // If the source vairable is present simply return to the main(); function to continue building the base collection.
                if (source) return elements;
                // If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Gets the element to the right, or next, of the provided elements.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            next: function(source) {
                var _ = this,
                    elements = next_or_prev(_, "nextElementSibling", source);
                // If the source vairable is present simply return to the main() function to continue building the base collection. If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                if (source) return elements;
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Gets the element to the left, or previous, of the provided elements.]
             * @param  {Array}  source [A source point element contained in an array. **Only used internally**.]
             * @return {Object}        [Return self[_] for method chaining.]
             */
            prev: function(source) {
                var _ = this,
                    elements = next_or_prev(_, "previousElementSibling", source);
                // If the source vairable is present simply return to the main(); function to continue building the base collection. If source is not present the method is being used a chain methos so we update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                if (source) return elements;
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Screens collection of elements against provided tags.]
             * @return {Object} [Return self[_] for method chaining.]
             */
            tags: function() {
                var _ = this;
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, helper_one(_, "tags", arguments));
                return _;
            },
            /**
             * @description [Screens collection of elements against provided classes.]
             * @return {Object} [Return self[_] for method chaining.]
             */
            classes: function() {
                var _ = this;
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, helper_one(_, "classes", arguments));
                return _;
            },
            /**
             * @description [Screens collection of elements against provided attrs.]
             * @return {Object} [Return self[_] for method chaining.]
             */
            attrs: function() {
                // Define the variables. Cache the "this" keyword.
                var _ = this;
                var func = {
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
                            return !in_array(value, pav) || !in_array(value, pav + "-");
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
                            return in_array(value, pav);
                        }
                    },
                    /**
                     * @description [Cleans the set of elements based on the attrs provided.]
                     * @param {Array} elements [The array of attributes provided.]
                     * @param {Array} attrs    [Array of screened elements.]
                     */
                    set = function(elements, attrs) {
                        loop1: for (var screened = [], c, i = 0, ll = elements.length; i < ll; i++) {
                            c = elements[i];
                            for (var cc, j = 0, l = attrs.length; j < l; j++) {
                                cc = attrs[j];
                                if (!func[cc[1]](cc[2], c.getAttribute(cc[0]), c)) continue loop1;
                                if (j === l - 1) screened.push(c);
                            }
                        }
                        return screened;
                    },
                    /**
                     * @description [Cleans the provided attrs into has and nothas arrays.]
                     * @param  {Array} attrs [The array of attributes provided, both has and nothas.]
                     * @return {Array}       [An array containing the cleaned attributes.]
                     */
                    input = function(attrs) {
                        if (!attrs.length) return [];
                        var type = Object.keys(func);
                        loop1: for (var screened = [], c, t, check, parts, i = 0, l = attrs.length; i < l; i++) {
                            c = attrs[i].slice(0, -1).substring(1);
                            for (var j = 7; j > 0; j--) {
                                t = type[j];
                                check = in_array(c, t);
                                if (check) {
                                    parts = c.split(t);
                                    screened.push([parts[0], t, parts[1]]);
                                    continue loop1;
                                } else if (!check && j === 1) {
                                    if (c.charCodeAt(0) === 33) screened.push([false, "!", c.substring(1)]);
                                    else screened.push([true, " ", c]);
                                    continue loop1;
                                }
                            }
                        }
                        return screened;
                    };
                update_stack(_, set(get_stack(_), input(arguments)));
                return _;
            },
            /**
             * @description [Screens elements based on their property state, disabled, selected, and checked.]
             * @param  {String} property [The property to check against.]
             * @param  {Bool} state    [Provided boolean to check property against.]
             * @return {Object}          [Return self[_] for method chaining.]
             */
            state: function(property, state) {
                // Define the variables. Cache the "this" keyword. Get the last element stack. The states contains the 3 possible methods to which to filter by; empty or visible.
                var elements = [],
                    _ = this,
                    array = get_stack(_),
                    i = 0,
                    l = array.length,
                    c,
                    states = {
                        empty: function(element, bool) {
                            return !element.childNodes.length === bool;
                        },
                        visible: function(element, bool) {
                            return (((element.offsetHeight >= 1) ? 1 : 0) == bool);
                        }
                    },
                    check = states[property],
                    // If the property provided is not empty or visible we change the filter function to the other property provided. e.g. "checked".
                    // [http://stackoverflow.com/questions/7851868/whats-the-proper-value-for-a-checked-attribute-of-an-html-checkbox]
                    func = (check) ? check : function(element, bool, property) {
                        return element[property] == bool;
                    };
                // Loop through elements and screen to see if they have the property set to the provided state of either true or false.
                for (; i < l; i++) {
                    c = array[i];
                    if (func(c, state, property)) elements.push(c);
                }
                // Finally, update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Shorthand for attribute methods, e.g. form(":text").]
             * @return {Object} [Return self[_] for method chaining.]
             */
            form: function() {
                // Cache the "this" keyword.
                var _ = this;
                // Clean the provided arguments and pass it to the attr(); function. This is basically a shorthand for the attr(); method.
                // Modify the arguments object...
                for (var args = arguments, i = 0, l = args.length; i < l; i++) args[i] = "[type=" + args[i].substring(1) + "]";
                _.attrs.apply(_, args);
                // At the end we return the object[_] to allow for method chaining.
                return _;
            },
            /**
             * @description [Screens collection of elements against provided text.]
             * @return {Object} Return self[_] for method chaining.
             */
            text: function() {
                var _ = this;
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, helper_one(_, "text", arguments));
                return _;
            },
            /**
             * @description [Positional screen skips elements at provided indices.]
             * @param  {Array}  indices_to_skip [Indices to be skipped.]
             * @return {Object}                 [Return self[_] for method chaining.]
             */
            skip: function(indices_to_skip) {
                // Define the variables, cache the "this" keyword, and clean the arguments provided.
                var elements = [],
                    _ = this,
                    array = get_stack(_),
                    i = 0,
                    l = array.length;
                // Check to see if the user has provided the index of -1. If they have they want to skip the last one so we simply pop it off before we hit the loop.
                if (in_array(indices_to_skip, -1)) array.pop();
                // Loop through and only adding to the screened array indices not found in the indices_to_skip array.
                for (; i < l; i++) {
                    if (!in_array(indices_to_skip, i)) elements.push(array[i]);
                }
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Positional screen only gets elements at provided indices.]
             * @param  {Array}  wanted_indices [Indices to be skipped.]
             * @return {Object}                [Return self[_] for method chaining.]
             */
            only: function(wanted_indices) {
                // Define the variables, cache the "this" keyword, and clean the arguments provided.
                var elements = [],
                    _ = this,
                    array = get_stack(_),
                    i = 0,
                    l = wanted_indices.length,
                    ll = array.length,
                    c;
                // Loop through and only add elements that match indices found in the provided wanted_indices array. **Note: if the current wanted index is negative we simply count backwards. e.g. array[ll + c].
                for (; i < l; i++) {
                    c = wanted_indices[i];
                    if (c < ll) elements.push((c < 0) ? array[ll + c] : array[c]);
                }
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Positional screens elements based on a provided range.]
             * @param  {Array}  range [The provided range to work with. e.g. [start, stop, step].]
             * @return {Object}       [Return self[_] for method chaining.]
             * @example :even range => [0, -1, 2]
             * @example :odd range => [1, -1, 2]
             * @example :entire range => [0, -1, 1]
             * @example :< 3 range => [0, 3, 1]
             * @example :> 4 range => [4, -1, 1]
             */
            range: function(range) {
                // Define the variables, cache the "this" keyword, and element stack, and set the start, stop, step variables.
                var _ = this,
                    array = get_stack(_),
                    start = range[0],
                    stop = range[1] + 1,
                    step = (range[2] || 1),
                    l = array.length;
                // If the stop is set to -1 or the range provided is larger than the length of the elements array we need to reset the stop from -1 to the length of the elements array. [v1] The user wants to cycle through all the elements. [v2] Range exceeds length of the elements array.
                if ( /*[v1]*/ !~range[1] || /*[v2]*/ stop > l) stop = l;
                // If the provided start is larger than the elements array we reset it to 0.
                if (start > l) start = 0;
                // Loop through using the provided start, stop, and step values.
                for (var elements = [], i = start; i < stop;) {
                    elements.push(array[i]);
                    i = i + step;
                }
                // Update the element stack and reset the its length. At the end we return the object[_] to allow for method chaining.
                update_stack(_, elements);
                return _;
            },
            /**
             * @description [Empty method; added to make the object look like an array in chrome.]
             * @return {Null}
             */
            splice: function() {},
            /**
             * @description [Return the last collection set of elements.]
             * @return {Array} [Returns the last collections of elements in the collection stack.]
             */
            pop: function() {
                var _ = this.stack;
                return _[_.length - 1];
            }
        };
        return main;
    })();
    // add the variable to the window
    window.app = main;
})();