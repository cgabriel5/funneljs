# funneljs

Simple, standalone, lightweight JavaScript selector engine.

### How It Works

funneljs works by using a broad collection of elements which are then subjected
to filters to get/exclude elements.

```js
// 1. Get elements from source points
funneljs("source_point1", "source_pointN")
// 2. chain filters to get/exclude elements
.filter1().filter2().filterN()
// 3. finally, return elements for use with pop()
.pop();

// example
funneljs("#aside:all").tags("span", "div").pop();
// explanation...
// 1) query uses element with the ID of "aside" as its source point
//    the ":all" attached to source point means to grab ALL its descendants
// 2) the tags() filter is then used on the elements collection to only get
//    elements of tags "span" or "div"
// 3) finally, the filtered collection is returned for use with pop()
```

### What's a source point?

A source point is just an element. This element is used to grab all its descendants
to build the collection of elements we want to filter. Querying the DOM is an
expensive task as it searches the entire DOM for your wanted elements. Rather than
search the entire DOM, this method focuses its search on the descendants of the source
point elements.

### Source Point Examples

Things to note:

1. Source point must be an element ID
2. N number of source points is possible.

```js
// source point
funneljs("#aside");

// equivalent Vanilla JavaScript
document.getElementById("aside");
```

```js
// source point
funneljs("#aside:all");

// same as source point
funneljs("#aside").all();

// equivalent Vanilla JavaScript
document.getElementById("aside").getElementsByTagName("*");
```

```js
// source point
funneljs("#aside", "#footer:all");

// equivalent Vanilla JavaScript
document.getElementById("aside");
+
document.getElementById("footer").getElementsByTagName("*");
```

```js
// source point
funneljs("#aside:all", "#footer:all");

// equivalent Vanilla JavaScript
document.getElementById("aside").getElementsByTagName("*");
+
document.getElementById("footer").getElementsByTagName("*");
```

### Add to project

```html
<script src="my_js_directory_path/funnel.js"></script>
```

### Access selector

```js
var f = funneljs;
// or
var f = window.funneljs;
```

### Selector Methods

**Selector.all** &mdash; gets children + descendants of elements in last stack.

```js
// can be combined with source element
var query = f("#aside:all");
// or used as a chained method
var query = f("#aside").all();
```

**Selector.attrs** &mdash; gets elements matching all supplied attributes.

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

**Selector.children** &mdash; gets element's children.

```js
// get aside element
var query = f("#aside");
// get children
var next = query.children();
```

**Selector.classes** &mdash; gets elements matching any of the supplied classes.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements with the classes active & nav-item
var filtered = query.classes("active", "nav-item");

// example 2: gets everything bu elements with the classes active and nav-item
var filtered = query.classes("!active", "!nav-item");
```

**Selector.form** &mdash; Selector.attr shorthand.
(List of possible input types [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) and [here](http://www.w3schools.com/TAGS/att_input_type.asp))

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements that have a type attribute and value text => [type=text]
var filtered = query.form(":text");
// shorthand for...
var filtered = query.attrs("[type=text]");
```

**Selector.next** &mdash; gets the next element sibling of elements in last stack.

```js
// get aside element
var query = f("#aside1");
// get sibling to the right
var next = query.next(); // i.e. #aside2
// **Note: if no element exists null is substituted
```

**Selector.only** &mdash; filters out any element not in provided indices.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// only gets elements at indices 0, 1, 2 or the first 3 elements
var filtered = query.only([0, 1, 2]);
```

**Selector.parent** &mdash; gets element's parent.

```js
// get aside element
var query = f("#aside");
// get parent
var next = query.parent();
```

**Selector.parents** &mdash; gets element's parents.

```js
// get aside element
var query = f("#aside");
// get parents
var next = query.parents();
```

**Selector.pop** &mdash; returns elements for use.

```js
query.pop(); // returns elements are contained in an array
```

**Selector.prev** &mdash; gets the previous element sibling of elements in last stack.

```js
// get aside element
var query = f("#aside1");
// get sibling to the right
var prev = query.prev(); // i.e. #aside0
// **Note: if no element exists null is substituted
```

**Selector.range** &mdash; gets elements at specified indice range.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// range format => [start_index, end_index, step]
// **Note: an end_index of -1 signals to use length of array

// even   range => [0, -1, 2]
// odd    range => [1, -1, 2]
// entire range => [0, -1, 1]
// < 3    range => [0, 3, 1]
// > 4    range => [4, -1, 1]

// example 1
var filtered = query.range([0, 5, 1]); // gets first 5 elements
```

**Selector.siblings** &mdash; gets siblings of elements.

```js
// get aside element
var query = f("#aside");
// get siblings
var next = query.siblings();
```

**Selector.skip** &mdash; filters out element at provided indices.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// filter out the first and last elements
var filtered = query.skip([0, -1]);
```

**Selector.state** &mdash; gets elements with supplied state.

Possible states include <code>checked</code>, <code>selected</code>, <code>disabled</code>, <code>visible</code>, and <code>empty</code> (no elements or text nodes).

```js
// get all input elements of type checkbox contained in aside element
var query = f("#aside:all").tags("input").attrs("[type=checkbox]");

// example 1: gets checked elements
var checked = query.state("checked", true);

// example 2: gets nonchecked elements
var nonchecked = query.state("checked", false);
```

**Selector.tags** &mdash; gets elements matching any of the supplied tag types.

```js
// get all elements contained in aside element
var query = f("#aside:all");

// example 1: gets elements of type input or canvas
var filtered = query.tags("input", "canvas");

// example 2: gets everything BUT input or canvas elements
var filtered = query.tags("!input", "!canvas");
```

**Selector.text_nodes** &mdash; gets the text nodes of elements in last stack.

```js
// get all elements contained in aside element
var query = f("#aside:all");
// filter all aside elements to get text nodes
var text_nodes = query.text_nodes();
```

### TODO

- [ ] Improve performance and cut down repetitive code

### License

This project uses the [MIT License](https://github.com/cgabriel5/funneljs/blob/master/LICENSE.txt).
