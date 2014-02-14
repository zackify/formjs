Formjs - ReactJS Forms
=========

Formjs generates HTML5 forms using [JSON Schema] data

  - Utilizes [Underscore] for object to array mapping, will possibly be turned into a standalone function to remove unneeded dependencies

Installation
--------------
The library itself is very simple. All you need to do is include it in your header along with the dependencies:
```
<script src="build/react.min.js"></script>
<script src="underscore-min.js"></script>
```

Supported Form Elements and their Markup
--
Formjs is still a work in progress but should be completed before the end of February, then this section will be completed.

**Form Elements**

- Any text based field (text,password,url,etc)
- select boxes
- the rest are coming shortly

Passing Form Information
--
*Update 2/13/14* you can now pass multiple forms as demonstrated in the index.html file

All you need to do is create a new variable called *json*, but this can be changed. Here's an example way to pass the json schema data to formjs
```
<script type="text/javascript">
      var json = {
        "description": null, 
        "title": "Site Detail",
        "ux-submit-text" : "submit form", 
        "schema": {
            "type": "object", 
            "properties": {
                "name": {
                    "type": "string", 
                    "description": "\n        Your Site Name will appear in the title bar of the browser. It tells\n        users and search engines what your site is about.\n    ", 
                    "title": "Site name"
                }, 
                "domain": {
                    "type": "string", 
                    "description": "html can go here", 
                    "title": "Domain"
                }, 
                "google_analytics_id": {
                    "type": "number", 
                    "title": "google analytics",
                    "ux-placeholder": "ex. 2342342"
                }, 
                "admin_email": {
                    "type": "string",
                    "format": "email",
                    "ux-placeholder": "Email"
                },
                "slug": {
                    "type": "string", 
                    "description": "", 
                    "title": "Subdomain"
                }
            }
        }
    };
    </script>

```

The variables passed through json are very self explanatory. More information on the different types of things you can pass to formjs will be released when the first version is finished in the next week or so.

Retrieving Form data
--
There's two neat callback functions that you must make in order to recieve data from formjs. You can see them both in the index.html file, but I'll put it here too:

```
function currentState(data){
        console.log('current state:');
        console.log(data);
}
function submitState(data){
        console.log('submit state:');
        console.log(data);
}

```
The current state function will be called as the user changes any form fields, the submit state one will only be called once the submit button is pressed. This way, you can do whatever you want with your data. You'll recieve an array that can be passed to an ajax call using jQuery or really, whatever you want.
Version
----
- **Februrary 13th:** Multiple form support - still only text inputs
- **Februrary 11th:** Prerelease documentaion


Adding Your Own Features
--------------

Extending Formjs is very simple. There's a great article on compiling ReactJS using the JSX compiler [here](http://facebook.github.io/react/docs/getting-started.html#offline-transform). Then you can simply edit src/forms.js and output your compiled changes to the build directory.

Current To-do List
---
   - Finish Formjs
   - Remove the need for Underscore


License
----

MIT

**Free Software, Hell Yeah!**

Leave a comment with any cool things you build using my library :)

[underscore]:http://underscorejs.org/
[JSON Schema]:http://json-schema.org/