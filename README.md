# funneljs

Simple, standalone, lightweight JavaScript selector engine.

##### Table of Contents

[What It Does](#what-it-does)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[How It Works](#how-it-works)  
* [What's A Source Point](#what-is-a-source-point)  
* [Source Point Examples](#source-point-examples)  

[API](#api)  
* [Instance](#instance-api)
    * [QuickTable](#instance-quicktable-reference)  
    * [Methods](#instance-methods-long) 

[Usage](#usage)  
* [Getting Elements](#getting-elements)  
* [Element Filtering](#element-filtering)  

[Contributing](#contributing)  <!-- [TODO](#todo)   -->  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

* Get and filter elements from the DOM.

<a name="add-to-project"></a>
### Add To Project

```html
<script src="path/to/lib.js"></script>
```

<a name="access-library"></a>
### Access Library

```js
var f = window.app.libs.Funnel;
```

<a name="how-it-works"></a>
### How It Works

funneljs works by using a broad collection of elements which are then subjected
to filters to get/exclude elements.

* Get elements from source points:

```js
f("#source_point_id", "#source_point_id_N")
```

* Chain filters to get/exclude elements:

```js
.filter1().filter2().filterN()
```

* Finally, return elements for use with `getStack()`:

```js
.getStack();
```

**Example**

```js
f("#aside:all").tags("span", "div").getStack();
```

**Explanation**

* Query uses element with the ID of `aside` as its source point. The `:all` attached to source point means to grab ALL its descendants.

* The `tags()` filter is then used on the elements collection to only get
  elements with the tags of `span` or `div`.

* Finally, the filtered collection is returned for use as an `array` with `getStack()`.

<a name="what-is-a-source-point"></a>
### What's A Source Point?

A source point is just an element. This element is used to grab all its descendants
to build the collection of elements we want to filter. Querying the DOM is an
expensive task as it searches the entire DOM for your wanted elements. Rather than
search the entire DOM, this method focuses its search on the descendants of the source
point elements.

<a name="source-point-examples"></a>
### Source Point Examples

**Things to note:**

1. Source point must be an element `ID` or a `DOMElement`
2. N number of source points is possible.

```js
// source point
f("#aside");

// equivalent Vanilla JavaScript
document.getElementById("aside");
```

```js
// source point
f("#aside:all");

// same as source point
f("#aside").all();

// equivalent Vanilla JavaScript
document.getElementById("aside").getElementsByTagName("*");
```

```js
// source point
f("#aside", "#footer:all");

// equivalent Vanilla JavaScript
document.getElementById("aside");
+
document.getElementById("footer").getElementsByTagName("*");
```

```js
// source point
f("#aside:all", "#footer:all");

// equivalent Vanilla JavaScript
document.getElementById("aside").getElementsByTagName("*");
+
document.getElementById("footer").getElementsByTagName("*");
```

<a name="api"></a>
### API

<a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-quicktable-reference"></a>
### Instance QuickTable Reference

Method | Function
------------ | -------------
**all** | Gets children + descendants of elements in last stack
**attrs** | Gets elements matching all supplied attributes
**children** | Gets element's children
**classes** | Gets elements matching any of the supplied classes
**form** | Selector.attr shorthand
**next** | Gets the next element sibling of elements in last stack
**only** | Filters out any element not in provided indices
**parent** | Gets element's parent
**parents** | Gets element's parents
**prev** | Gets the previous element sibling of elements in last stack
**range** | Gets elements at specified indice range
**siblings** | Gets siblings of elements
**skip** | Filters out element at provided indices
**state** | Gets elements with supplied state
**tags** | Gets elements matching any of the supplied tag types
**textNodes** | Gets the text nodes of elements in last stack
**getStack** | Returns the last element stack for use
**getElement** | Returns the first element of the last stack

<a name="instance-methods-long"></a>
### Instance Methods

**Funnel.all** &mdash; Gets children + descendants of elements in last stack.

```js
// can be combined with source element
var query = f("#aside:all");
// or used as a chained method
var query = f("#aside").all();
```

**Funnel.attrs** &mdash; Gets elements matching all supplied attributes.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// now we filter wanted elements...

// example 1: gets elements that HAVE a class attribute
var filtered = query.attrs("[class]");

// example 2: gets elements that DO NOT have a class attribute
var filtered = query.attrs("[!class]");
// **Note: not(!) only checks for absence of attribute

// example 3: gets elements with a type attribute AND value equal to text
var filtered = query.attrs("[type=text]");
```

**Funnel.children** &mdash; Gets element's children.

```js
// get aside element
var query = f("#aside");
// get children
var next = query.children();
```

**Funnel.classes** &mdash; Gets elements matching any of the supplied classes.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements with the classes active & nav-item
var filtered = query.classes("active", "nav-item");

// example 2: gets everything bu elements with the classes active and nav-item
var filtered = query.classes("!active", "!nav-item");
```

**Funnel.form** &mdash; Selector.attr shorthand.
(List of possible input types [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) and [here](http://www.w3schools.com/TAGS/att_input_type.asp))

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements that have a type attribute and value text => [type=text]
var filtered = query.form(":text");
// shorthand for...
var filtered = query.attrs("[type=text]");
```

**Funnel.next** &mdash; Gets the next element sibling of elements in last stack.

```js
// get aside element
var query = f("#aside1");
// get sibling to the right
var next = query.next(); // i.e. #aside2
// **Note: if no element exists null is substituted
```

**Funnel.only** &mdash; Filters out any element not in provided indices.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// only gets elements at indices 0, 1, 2 or the first 3 elements
var filtered = query.only([0, 1, 2]);
```

**Funnel.parent** &mdash; Gets element's parent.

```js
// get aside element
var query = f("#aside");
// get parent
var next = query.parent();
```

**Funnel.parents** &mdash; Gets element's parents.

```js
// get aside element
var query = f("#aside");
// get parents
var next = query.parents();
```

**Funnel.prev** &mdash; Gets the previous element sibling of elements in last stack.

```js
// get aside element
var query = f("#aside1");
// get sibling to the right
var prev = query.prev(); // i.e. #aside0
// **Note: if no element exists null is substituted
```

**Funnel.range** &mdash; Gets elements at specified indice range.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// range format --> [start_index, end_index, step]
// **Note: an end_index of -1 signals to use length of array

// even   range --> [0, -1, 2]
// odd    range --> [1, -1, 2]
// entire range --> [0, -1, 1]
// < 3    range --> [0, 3, 1]
// > 4    range --> [4, -1, 1]

// example 1
var filtered = query.range([0, 5, 1]); // gets first 5 elements
```

**Funnel.siblings** &mdash; Gets siblings of elements.

```js
// get aside element
var query = f("#aside");
// get siblings
var next = query.siblings();
```

**Funnel.skip** &mdash; Filters out element at provided indices.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// filter out the first and last elements
var filtered = query.skip([0, -1]);
```

**Funnel.state** &mdash; Gets elements with supplied state.

Possible states include <code>checked</code>, <code>selected</code>, <code>disabled</code>, <code>visible</code>, and <code>empty</code> (no elements or text nodes).

```js
// get all input elements of type checkbox contained in aside element
var query = f("#aside:all").tags("input").attrs("[type=checkbox]");

// example 1: gets checked elements
var checked = query.state("checked", true);

// example 2: gets nonchecked elements
var nonchecked = query.state("checked", false);
```

**Funnel.tags** &mdash; Gets elements matching any of the supplied tag types.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements of type input or canvas
var filtered = query.tags("input", "canvas");

// example 2: gets everything BUT input or canvas elements
var filtered = query.tags("!input", "!canvas");
```

**Funnel.textNodes** &mdash; Gets the text nodes of elements in last stack.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// filter all aside elements to get text nodes
var text_nodes = query.textNodes();
```

<a name="usage"></a>
### Usage

<a name="getting-elements"></a>
### Getting Elements

**Funnel.getStack** &mdash; Returns the last element stack for use.

```js
// The index is optional. Omitting it will return the last element stack.
// However, if a previous stack is needed provide the index of the stack
// to return. 
query.getStack([?index]);

// **Note: The initial elements that are passed to the Funnel() function make
// up the first stack. Each method (filter) used after that will create an 
// additional stack.
// For example:
f("#red", "#green") // first stack  (index:0) --> ["<#red>", "<#green>"]
 .attrs("[id=red]") // second stack (index:1) --> ["<#red>"]
// ...so...
f("#red", "#green").attrs("[id=red]").getStack() // will return --> ["<#red>"]
```

**Funnel.getElement** &mdash; Returns the first element of the last stack.

```js
// The index is optional. Omitting it will return the first element of the 
// last element stack. Providing an index will return the element at that index.
query.getElement([?index]);

// For example:
f("#red", "#green").getElement()  // will return --> <#red>
f("#red", "#green").getElement(0) // will return --> <#red>
f("#red", "#green").getElement(1) // will return --> <#green>
```

<a name="element-filtering"></a>
### Element Filtering

**Normal Filtering** &mdash; If `HTMLElements` are provided to FunnelJS, its methods can be used to filter
the said elements. This is very handy when using event delegation.

```html
<div id="cont">
    <input type="text">
    <input type="password">
    <input type="hidden">
    <input type="text">
</div>
```

```js
// get the element with an ID of #cont
var $cont = f("#cont").getElement();
// using the $cont element get all its ancestors and return 
// the ancestors that have the attribute type set to text
var text_inputs = f($cont).all().attrs("[type=text]").getStack();
```

**Event Delegation Filtering** &mdash; Filtering can also be very handy when
using event delegation.

```js
// click event listener
document.addEventListener("click", function(e) {
    
    // cache the target element
    var target = e.target;
    // filter element to see if it's the element we want
    var filtered = f(target).attrs("[id=cont]").getElement();

    if (filtered) {
        // handler logic
        console.log("Target element clicked! :)");
    }  // else ignore click 

});
```

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/funneljs/blob/master/CONTRIBUTING.md).

<!-- <a name="todo"></a>
### TODO -->

<!-- - [ ] Something TODO... -->

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/funneljs/blob/master/LICENSE.txt).
