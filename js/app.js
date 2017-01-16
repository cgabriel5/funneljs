document.onreadystatechange = function() {

    "use strict";

    // all resources have loaded
    if (document.readyState == "complete") {

        // get/cache selector
        var f = window.funneljs;

        // use in the form of...
        // <source_point(s)>.<filter1>.<filter2>.<filtern>.<pop>;

        // example...
        // f("#aside:all").tags("span", "div").pop();

        // query explanation...
        // 1) query uses the element with the id of "aside" as its source point*
        //    the ":all" means to grab ALL its descendants elements
        // 2) now that we have all the descendants, we use the .tags() filter
        //    to only get elements with the tag-type of "span" and "div"
        // 3) finally, return the collection with the pop() method

        // *What is a source point?
        // A source point is a element in which the query will focus on.
        // As querying the DOM is an expensive task, a source point prevents
        // scanning the entire DOM in search of the your queried elements while
        // only focusing on a section of the page.

        // example queries...

        // 1) uses the elements with id "tape" and "file" as source points
        // 2) no filters are applied. therefore invoking pop() will only
        //    return the provided source elements
        f("#tape", "#file").pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) of the descendants filter out any that contain the class "active"
        // 3) return the collection for use with pop()
        f("#red:all").classes("!active").pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) return the collection for use with pop()
        f("#red:all").form(":checkbox").state("checked", false).pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) state(), in this case, will only return non visible elements
        // 5) return the collection for use with pop()
        f("#red:all").form(":checkbox").state("checked", false).state("visible", false).pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get form type elements of the type checkbox
        // 3) state(), in this case, will only return non checked elements
        // 4) state(), in this case, will only return visible elements
        // 5) return the collection for use with pop()
        f("#red:all").form(":checkbox").state("checked", false).state("visible", true).pop();

        // 1) uses the element with id "pink" as a source point.
        // 2) get the source point elements siblings
        // 3) return the collection for use with pop()
        f("#pink").siblings().pop();

        // 1) uses the element with id "red" as a source point.
        // 2) get the source points parent
        // 3) return the collection for use with pop()
        f("#red").parent().pop();

        // 1) uses the element with id "red" as a source point.
        // 2) get the source points parents
        // 3) return the collection for use with pop()
        f("#red").parents().pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) use the tag() filter to return elements of tag-type "input"
        // 3) return the collection for use with pop()
        f("#red:all").tags("input").pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) use the tag() filter to return elements of tag-type "form"
        // 3) get the children of the collection
        // 4) return the collection for use with pop()
        f("#red:all").tags("form").children().pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get the children of the collection
        // 3) use the attrs() filter to return elements with the attribute "type=file"
        // 4) return the collection for use with pop()
        f("#red:all").children().attrs("'type=file'").pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get the children of the collection
        // 3) use the attrs() filter to return elements with the attribute "class" (the attribute value in this query is not checked, simply checks if the element HAS the attribute)
        // 4) return the collection for use with pop()
        f("#red:all").children().attrs("'class'").pop();

        // 1) uses the element with id "tape" as a source point.
        //    using :all gets ALL the elements descendants rather than the
        //    the element itself
        // 2) get the children of the collection
        // 3) use the tag() filter to return elements of tag-type "input" or "canvas"
        // 4) return the collection for use with pop()
        f("#red:all").children().tags("input", "canvas").pop();

    }

};