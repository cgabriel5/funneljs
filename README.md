# funneljs

Simple, standalone, lightweight JavaScript selector engine.

##### Table of Contents

- [Project Setup](#project-setup)
- [What It Does](#what-it-does)
- [Add To Project](#add-to-project)
- [How It Works](#how-it-works)
- [API](#api)
    - [Instance](#instance-api)
- [Usage](#usage)
    - [General Filtering](#filtering-general)
    - [Event Delegation Filtering](#filtering-event-delegation)
- [Contributing](#contributing)  
- [License](#license)

<a name="project-setup"></a>
### Project Setup

Project uses [this](https://github.com/cgabriel5/snippets/tree/master/boilerplate/application) boilerplate. Its [README.md](https://github.com/cgabriel5/snippets/blob/master/boilerplate/application/README.md#-read-before-use) contains instructions for `Yarn` and `Gulp`.

<a name="what-it-does"></a>
### What It Does

* Get and filter elements from the DOM.

<a name="add-to-project"></a>
### Add To Project

**Note**: The library, both minimized and unminimized, is located in `lib/`.

```html
<script src="path/to/lib.js"></script>
<script>
document.onreadystatechange = function() {
    "use strict";
    // once all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var f = window.app.libs.Funnel;
        // logic...
    }
});
</script>
```

<a name="how-it-works"></a>
### How It Works

funneljs works by using a broad collection of elements which are then subjected
to filters to get/exclude elements.

- General Overview:
    - **Step 1** &mdash; Get elements from source points:
        - `f("#source_point_id", "#source_point_id_N")`
    - **Step 2** &mdash; Chain filters to get/exclude elements:
        - `.filter1().filter2().filterN()`
    - **Step 3** &mdash; Finally, return element(s) via: 
        - `getStack` or `getElement`:
    - **Example** &mdash; `f("#aside:all").tags("span", "div").getStack();`
    - **Explanation** &mdash; Query uses the element with the ID of `aside` as its source point. The inline `:all` means to grab _ALL_ its descendants. The `tags()` filter is then used on the elements collection to only get elements with the tags of `span` or `div`. Finally, the filtered collection is returned for use as an `Array` with `getStack()`.

<a name="api"></a>
## API

<a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-methods-toc"></a>

- [Instance](#instance-creation)
    - [What's A Source Point?](#what-is-a-source-point)
    - [Source Point Comparisons](#source-point-comparisons)
    - [The Stack](#the-stack)
    - [➜ instance.all()](#instance-methods-all)
    - [➜ instance.attrs()](#instance-methods-attrs)
    - [➜ instance.children()](#instance-methods-children)
    - [➜ instance.classes()](#instance-methods-classes)
    - [➜ instance.form()](#instance-methods-form)
    - [➜ instance.next()](#instance-methods-next)
    - [➜ instance.only()](#instance-methods-only)
    - [➜ instance.parent()](#instance-methods-parent)
    - [➜ instance.parents()](#instance-methods-parents)
    - [➜ instance.prev()](#instance-methods-prev)
    - [➜ instance.range()](#instance-methods-range)
    - [➜ instance.siblings()](#instance-methods-siblings)
    - [➜ instance.skip()](#instance-methods-skip)
    - [➜ instance.state()](#instance-methods-state)
    - [➜ instance.tags()](#instance-methods-tags)
    - [➜ instance.textNodes()](#instance-methods-textnodes)
    - [➜ instance.getStack()](#instance-methods-getstack)
    - [➜ instance.getElement()](#instance-methods-getelement)
    - [➜ instance.concat()](#instance-methods-concat)
    - [➜ instance.iterable()](#instance-methods-iterable)

<a name="instance-creation"></a>
### Instance Creation

- `sourcePoint` (`String|HTMLElement`, _Required_) The source point to use.
    - **Note**: `n` amount of `sourcePoint`s may be passed.
- **Returns** instance.

**Note**: Using the `new` keyword is not necessary. The library will make sure to use it for when when you don't.

```js
// this...
var query = new Funnel("#container", "#sidebar");
// is the same as this
var query = Funnel("#container", "#sidebar");
```

<a name="what-is-a-source-point"></a>
### What's A Source Point?

A source point is just an element. This element is used to grab all its descendants
to build the collection of elements wanted to filter. Querying the DOM is an
expensive task as it searches the entire DOM for your wanted elements. Rather than
search the entire DOM, this method pin-points its search on the descendants of selected source
point elements.

<a name="source-point-comparisons"></a>
### Source Point Comparisons

```js
// this...
f("#aside"); 
// is essentially...
document.getElementById("aside");
```

```js
// this...
f("#aside:all"); 
// or...
f("#aside").all();
// is essentially this...
document.getElementById("aside").getElementsByTagName("*");
```

```js
// this...
f("#aside", "#footer:all");
// is the essentially both this...
document.getElementById("aside");
// and this...
document.getElementById("footer").getElementsByTagName("*");
```

```js
// this...
f("#aside:all", "#footer:all");
// is the essentially both this...
document.getElementById("aside").getElementsByTagName("*");
// and this...
document.getElementById("footer").getElementsByTagName("*");
```

<a name="the-stack"></a>
### The Stack

The initial elements that are passed to the `Funnel` instance make up the first stack. Each method (filter) used after that will create an additional element stack. Therefore, the `getStack` method will always return a stack, or element collection. By default it returns the last stack but can return any of the previous stacks. The `getElement` method will always return the _first_ element of the _last_ stack.

```js
// For example, the following contains 2 stacks...
f("#red", "#green").attrs("[id=red]") 

// first stack  (index:0) --> ["<#red>", "<#green>"]
// second stack (index:1) --> ["<#red>"]

// Therefore...

f("#red", "#green").attrs("[id=red]").getStack() 
// will return the last (most current) stack --> ["<#red>"]
```

<a name="instance-methods-long"></a>
### Instance Methods

<a name="instance-methods-all"></a>
➜ **instance.all** &mdash; Gets children and descendants of elements in last stack.

- **No Parameters**
- **Returns** instance.

```js
// can be combined with source element
var query = f("#aside:all");
// or used as a chained method
var query = f("#aside").all();
```

<a name="instance-methods-attrs"></a>
➜ **instance.attrs(`attribute`, `attributeN...`)** &mdash; Gets elements matching all supplied attributes.

- `attribute` (`String`, _Required_)
    - **Note**: `n` amount of attributes may be passed.
- **Returns** instance.

```js
// Example 1: gets elements that HAVE a class attribute
query.attrs("[class]");

// Example 2: gets elements that DO NOT have a class attribute
query.attrs("[!class]");

// Example 3: gets elements with a type attribute AND value equal to text
query.attrs("[type=text]");
```

<a name="instance-methods-children"></a>
➜ **instance.children** &mdash; Gets element's children.

- **No Parameters**
- **Returns** instance.

```js
query.children();
```

<a name="instance-methods-classes"></a>
➜ **instance.classes(`className`)** &mdash; Gets elements matching any of the supplied classes.

- `className` (`String`, _Required_)
    - **Note**: `n` amount of classNames may be passed.
- **Returns** instance.

```js
// Example 1: gets elements with the classes active & nav-item
query.classes("active", "nav-item");

// Example 2: gets everything but elements with the classes active and nav-item
query.classes("!active", "!nav-item");
```

<a name="instance-methods-form"></a>
➜ **instance.form(`inputType`)** &mdash; Selector.attr shorthand.
(List of possible input types [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) and [here](http://www.w3schools.com/TAGS/att_input_type.asp))

- `inputType` (`String`, _Required_)
    - **Note**: `n` amount of inputTypes may be passed.
- **Returns** instance.

```js
// Example 1: gets elements that have a type attribute and value text => [type=text]
query.form(":text");
// shorthand for...
query.attrs("[type=text]");
```

<a name="instance-methods-next"></a>
➜ **instance.next** &mdash; Gets the next element sibling of elements in last stack.

- **No Parameters**
- **Returns** instance.

**Note**: If no element exists `null` is returned.

```js
f("#aside1").next(); // <#aside2>
```

<a name="instance-methods-only"></a>
➜ **instance.only(`indices`)** &mdash; Filters out any element not in provided indices.

- `indices` (`Array`, _Required_)
- **Returns** instance.

```js
query.only([0, 1, 2]); // elements at indices 0-2 (first 3 elements)
```

<a name="instance-methods-parent"></a>
➜ **instance.parent** &mdash; Gets element's parent.

- **No Parameters**
- **Returns** instance.

```js
query.parent();
```

<a name="instance-methods-parents"></a>
➜ **instance.parents** &mdash; Gets element's parents.

- **No Parameters**
- **Returns** instance.

```js
query.parents();
```

<a name="instance-methods-prev"></a>
➜ **instance.prev** &mdash; Gets the previous element sibling of elements in last stack.

- **No Parameters**
- **Returns** instance.

**Note**: If no element exists `null` is returned.

```js
f("#aside1").prev(); // <#aside0>
```

<a name="instance-methods-range"></a>
➜ **instance.range(`range`)** &mdash; Gets elements at specified indice range.

- `range` (`Array`, _Required_)
    - `0` (`Number`, _Default_: 0) `start_index`: Where to start range.
    - `1` (`Number`, _Default_: -1) `end_index`: Where to end range.
        - `-1` means to stop and include the last element. Essentially use the length of the array.
    - `2` (`Number`, _Default_: 1) `step`: Increase step by.
- **Returns** instance.

```js
query.range([0, -1, 2]); // even   
query.range([1, -1, 2]); // odd    
query.range([0, -1, 1]); // entire 
query.range([0, 3, 1]);  // < 3    
query.range([4, -1, 1]); // > 4    
query.range([0, 5, 1]);  // first 5 elements
```

<a name="instance-methods-siblings"></a>
➜ **instance.siblings** &mdash; Gets siblings of elements.

- **No Parameters**
- **Returns** instance.

```js
query.siblings();
```

<a name="instance-methods-skip"></a>
➜ **instance.skip(`indices`)** &mdash; Filters out element at provided indices.

- `indices` (`Array`, _Required_) Indices to skip.
- **Returns** instance.

```js
query.skip([0, -1]); // filter out the first and last elements
```

<a name="instance-methods-state"></a>
➜ **instance.state(`stateType`, `state`)** &mdash; Gets elements with supplied state.


- `stateType` (`String`, _Required_)
    - Possible states:
        - `checked` 
        - `selected` 
        - `disabled` 
        - `visible`
        - `empty` (no elements or text nodes).
- `state` (`Boolean`, _Required_)
- **Returns** instance.

```js
// Example 1: gets checked input elements
query.state("checked", true);

// Example 2: gets nonchecked input elements
query.state("checked", false);
```

<a name="instance-methods-tags"></a>
➜ **instance.tags(`tag`, `tagN...`)** &mdash; Gets elements matching any of the supplied tag types.

- `tag` (`String`, _Required_)
    - **Note**: `n` amount of tags may be passed.
- **Returns** instance.

```js
// Example 1: gets elements of type input or canvas
query.tags("input", "canvas");

// Example 2: gets everything BUT input or canvas elements
query.tags("!input", "!canvas");
```

<a name="instance-methods-textnodes"></a>
➜ **instance.textNodes** &mdash; Gets the text nodes of elements in last stack.

- **No Parameters**
- **Returns** instance.

```js
query.textNodes(); // filter all aside elements to get text nodes
```

<a name="instance-methods-getstack"></a>
➜ **instance.getStack(`index`)** &mdash; Return the last element stack for use.

- `index` (`Number`, _Optional_, _Default_: `0`) Index stack to return.
    - The index is optional. Omitting it will return the last element stack. However, if a previous stack is needed provide the index of the stack to return.
- **Returns** instance.

```js
query.getStack(); // use elements for whatever...
```

<a name="instance-methods-getelement"></a>
➜ **instance.getElement(`index`)** &mdash; Return the first element of the last stack for use.

- `index` (`Number`, _Optional_, _Default_: `0`) Index of element in stack to return.
    - The index is optional. Omitting it will return the first element of the last element stack. Providing an index will return the element at that index.
- **Returns** instance.

```js
f("#red", "#green").getElement()  // will return --> <#red>
f("#red", "#green").getElement(0) // will return --> <#red>
f("#red", "#green").getElement(1) // will return --> <#green>
```

<a name="instance-methods-concat"></a>
➜ **instance.concat(`stack`)** &mdash; Combines two stacks into one.

- `stack` (`ElementStack`, _Required_) 
- **Returns** instance.

```js
var sidebar = f("#sidebar");
var container = f("#container");
var elements = sidebar.concat(container); // combined element collection
```

<a name="instance-methods-iterable"></a>
➜ **instance.iterable** &mdash; Property indicating whether the last element stack contains elements.

- **No Parameters**
- **Returns** Nothing.

```js
document.addEventListener("click", function(e) {

    // cache the target element
    var target = e.target;

    // get the targets parents
    var parents = f(target).parents().getStack();
    // combine the parents with the target to return elements 
    // that contain the class green
    var filtered = f(target).concat(parents).classes("green");

    // if there are elements in the last filtered stack...
    if (filtered.iterable) {
        var delegate = filtered.getElement();
        // do something with delegate...
    }

}, false);

// ...or use it this way as it's the same thing

document.addEventListener("click", function(e) {

    // cache the target element
    var target = e.target;

    // get the targets parents
    var parents = f(target).parents().getStack();
    // combine the parents with the target to return elements 
    // that contain the class green
    var delegate = f(target).concat(parents).classes("green").getElement();

    // if there are elements in the last filtered stack...
    if (delegate) {
        // do something with delegate...
    }

}, false);
```

<a name="usage"></a>
### Usage

<a name="element-filtering"></a>
### Element Filtering

<a name="filtering-general"></a>
**General Filtering** &mdash; If `HTMLElements` are provided to FunnelJS, its methods can be used to filter
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

<a name="filtering-event-delegation"></a>
**Event Delegation Filtering** &mdash; Filtering for event delegation is also made easy.

```js
// click event listener
document.addEventListener("click", function(e) {
    
    // cache the target element
    var target = e.target;
    // filter element to see if it's the element we want
    var filtered = f(target).attrs("[id=cont]").getElement();

    if (filtered) { // handler logic
        console.log("Target element clicked! :)");
    }  // else ignore click 

}, false);
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
