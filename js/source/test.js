document.onreadystatechange = function() {
    "use strict";
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var libs = app.libs,
            f = libs.Funnel;
        // Examples...
        // - Uses the elements with id "tape" and "file" as source points.
        // - No filters are applied. Therefore invoking "getStack" will only return the provided source elements
        f("#tape", "#file")
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Of the descendants filter out any that contain the class "active".
        // - Return the collection for use with "getStack".
        f("#red:all")
            .classes("!active")
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get form type elements of the type checkbox.
        // - "state", in this case, will only return non checked elements.
        // - Return the collection for use with "getStack".
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get form type elements of the type checkbox.
        // - "state", in this case, will only return non checked elements.
        // - "state", in this case, will only return non visible elements.
        // - Return the collection for use with "getStack".
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .state("visible", false)
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get form type elements of the type checkbox.
        // - "state", in this case, will only return non checked elements.
        // - "state", in this case, will only return visible elements.
        // - Return the collection for use with "getStack".
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .state("visible", true)
            .getStack();
        // - Uses the element with id "pink" as a source point.
        // - Get the source point elements siblings.
        // - Return the collection for use with "getStack".
        f("#pink")
            .siblings()
            .getStack();
        // - Uses the element with id "red" as a source point.
        // - Get the source points parent.
        // - Return the collection for use with "getStack".
        f("#red")
            .parent()
            .getStack();
        // - Uses the element with id "red" as a source point.
        // - Get the source points parents.
        // - Return the collection for use with "getStack".
        f("#red")
            .parents()
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Use the "tag" filter to return elements of tag-type "input".
        // - Return the collection for use with "getStack".
        f("#red:all")
            .tags("input")
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Use the "tag" filter to return elements of tag-type "form".
        // - Get the children of the collection.
        // - Return the collection for use with "getStack".
        f("#red:all")
            .tags("form")
            .children()
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get the children of the collection.
        // - Use the "attrs" filter to return elements with the attribute "type=file".
        // - Return the collection for use with "getStack".
        f("#red:all")
            .children()
            .attrs("[type=file]")
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get the children of the collection.
        // - Use the "attrs" filter to return elements with the attribute "class" (the attribute value in this query is not checked, simply checks if the element HAS the attribute).
        // - Return the collection for use with "getStack".
        f("#red:all")
            .children()
            .attrs("[class]")
            .getStack();
        // - Uses the element with id "tape" as a source point. Using ":all" gets ALL the elements descendants rather than the element itself.
        // - Get the children of the collection.
        // - Use the "tag" filter to return elements of tag-type "input" or "canvas".
        // - Return the collection for use with "getStack".
        f("#red:all")
            .children()
            .tags("input", "canvas")
            .getStack();
    }
};