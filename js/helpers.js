/**
 * @description [A class wrapper. Creates a class based on provided object containing class constructor__ and methods__.
 *               If class needs to extend another, provide it under the extend__ property.]
 * @param  {Object} cobject [The class object containg three properties: constructor__, methods__, and extend__.
 *                           .constructor__ {Function}       [The class constructor]
 *                           .methods__     {Object}         [Object containing class methods.]
 *                           .extend__      {Boolean|Object} [Set to false if does not need to extend. Otherwise, provide the
 *                                                            class to extend.]
 *                           ]
 * @return {Function}         [Returns class constructor.]
 */
function class__(cobject) {

    // cache class data
    var constructor = cobject.constructor__,
        methods = cobject.methods__,
        parent = cobject.extend__;

    // extend if parent class provided
    if (parent) {
        constructor.prototype = Object.create(parent.prototype);
        constructor.prototype.constructor = constructor;
    }

    // cache prototype
    var prototype = constructor.prototype;

    // add class methods to prototype
    for (var method in methods) {
        if (methods.hasOwnProperty(method)) {
            prototype[method] = methods[method];
        }
    }

    return constructor;

}
