// =============================== Core Library Functions
// /**
//  * @description [Checks if the supplied arrays have any items in common, or intersect.]
//  * @param  {Array}   array1 [The first array to perform comparison with.]
//  * @param  {Array}   array2 [The second array to perform comparison with.]
//  * @return {Boolean}        [description]
//  */
// function intersect(array1, array2) {
//     // define vars
//     var short_array = array1,
//         long_array = array2,
//         i = 0,
//         l, a1_len = array1.length,
//         a2_len = array2.length;
//     // reset short and long arrays if arrays are equal in...
//     // ...length or if length of first array is less than that...
//     // ...of the second one.
//     if (a1_len === a2_len || a1_len < a2_len) {
//         short_array = array2;
//         long_array = array1;
//     }
//     // use length of short array as the last iteration stop.
//     // finally, check if arrays have anything in common.
//     // returning true if a commonality is found. otherwise return false
//     l = short_array.length;
//     for (; i < l; i++)
//         if (includes(long_array, short_array[i])) return true;
//     return false;
// }
/**
 * @description [Internal helper function. Is used when the "tags", "classes", or "text" filters are invoked.]
 * @param  {Array}          this_ [The Library object.]
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
            return {
                "has": has,
                "not": not
            };
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
            "tags": function(element, has_not, reverse) {
                var check = includes(has_not, element.tagName.toLowerCase());
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
            "text": function(element, has_not, reverse) {
                for (var current_text, i = 0, l = has_not.length; i < l; i++) {
                    current_text = has_not[i];
                    var text_content = element.textContent.trim();
                    // text content must not be empty
                    if (text_content === "") continue;
                    var check = includes(text_content, current_text);
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
            "classes": function(element, has_not, reverse) {
                for (var current_class, i = 0, l = has_not.length; i < l; i++) {
                    current_class = has_not[i];
                    var check = includes((" " + element.className + " "), (" " + current_class + " "));
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
