document.onreadystatechange = function() {
    "use strict";
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var libs = app.libs,
            f = libs.Funnel;
        // example queries...
        // 1) uses the elements with id "tape" and "file" as source points
        // 2) no filters are applied. therefore invoking getStack() will only
        //    return the provided source elements
        f("#tape", "#file")
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) of the descendants filter out any that contain the class "active"
        // 3) return the collection for use with getStack()
        f("#red:all")
            .classes("!active")
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) return the collection for use with getStack()
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) state(), in this case, will only return non visible elements
        // 5) return the collection for use with getStack()
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .state("visible", false)
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) state(), in this case, will only return visible elements
        // 5) return the collection for use with getStack()
        f("#red:all")
            .form(":checkbox")
            .state("checked", false)
            .state("visible", true)
            .getStack();
        // 1) uses the element with id "pink" as a source point.
        // 2) get the source point elements siblings
        // 3) return the collection for use with getStack()
        f("#pink")
            .siblings()
            .getStack();
        // 1) uses the element with id "red" as a source point.
        // 2) get the source points parent
        // 3) return the collection for use with getStack()
        f("#red")
            .parent()
            .getStack();
        // 1) uses the element with id "red" as a source point.
        // 2) get the source points parents
        // 3) return the collection for use with getStack()
        f("#red")
            .parents()
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) use the tag() filter to return elements of tag-type "input"
        // 3) return the collection for use with getStack()
        f("#red:all")
            .tags("input")
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) use the tag() filter to return elements of tag-type "form"
        // 3) get the children of the collection
        // 4) return the collection for use with getStack()
        f("#red:all")
            .tags("form")
            .children()
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get the children of the collection
        // 3) use the attrs() filter to return elements with the attribute "type=file"
        // 4) return the collection for use with getStack()
        f("#red:all")
            .children()
            .attrs("'type=file'")
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get the children of the collection
        // 3) use the attrs() filter to return elements with the attribute "class" (the attribute value in this query is not checked, simply checks if the element HAS the attribute)
        // 4) return the collection for use with getStack()
        f("#red:all")
            .children()
            .attrs("'class'")
            .getStack();
        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    element itself
        // 2) get the children of the collection
        // 3) use the tag() filter to return elements of tag-type "input" or "canvas"
        // 4) return the collection for use with getStack()
        f("#red:all")
            .children()
            .tags("input", "canvas")
            .getStack();
    }
};