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

All you need to do is create a new variable called *json*, but this can be changed.

Here's an example way to pass the json schema data to formjs
```
<script type="text/javascript">
      var json = {
        "description": null, 
        "schema": {
            "type": "object", 
            "properties": {
                "name": {
                    "type": "string", 
                    "description": "\n        Your Site Name will appear in the title bar of the browser. It tells\n        users and search engines what your site is about.\n    ", 
                    "title": "Site name"
                },  
                "bullets": {
                    "items": {
                        "type": "object", 
                        "properties": {
                            "text": {
                                "type": "string", 
                                "description": null, 
                                "title": "text"
                            },
                            "score": {
                                "type": "number",
                                "title": "score",
                                "enum": [1.5, 5.5, 9.5]
                            },
                            "score2": {
                                "type": "number",
                                "title": "score2",
                                "enum": [1.5, 5.5, 9.5]
                            }
                        }
                    },
                    "type": "array", 
                        "description": "", 
                        "title": "Bullets"
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
As you can see you can add a section called bullets. These will show as many times as there are fields. 
If you have two bullet fields, it'll show twice. These are cool because an add button will be displayed below them. 
The user can add as many of these as they need.
You can also add values to fields as demonstrated below.

```
var values = [{
    "title": "Hello world",
    "bullets": [
        {
            "text": "hello",
            "score": 5.5
        },
        {
            "text": "world",
            "score": 9.5
        }
    ],
    "are_you_awesome": true,
    "chromosome_configuration": "male",
    "age": 21,
    "birthday": "1970-01-01",
    "email": "thedude@gmail.com"
}];


```
Retrieving Form data
--
There's four awesome callback functions that you can make in order to recieve data from formjs. You can see them in the index.html file, but I'll put it here too:

```
function formjsCurrent(data){
        console.log(data);
}
function formjsSubmit(data){
    //console.log(data);
}
function formjsFilesOnSubmit(data){
    console.log(data);
}
function formjsFilesOnSelect(data){
    console.log(data);
}

```
The `formjsCurrent` function will be called as the user changes any form fields, and `formjsSubmit` will only be called once the submit button is pressed. This way, you can do whatever you want with your data. You'll recieve a json object that you can do whatever you want with. The last two are in case you want file uploads. In order to keep the library small, I don't handle uploads natively. With these functions you will get an array with each files object from your form.

Version
----
- **March 6th:** the first actually usable version is here! Most form inputs work, you can extend by adding your own form components and send a pull request if you want to help!
- **Februrary 13th:** Multiple form support - still only text inputs
- **Februrary 11th:** Prerelease documentaion


Adding Your Own Features
--------------

Extending Formjs is very simple. There's a great article on compiling ReactJS using the JSX compiler [here](http://facebook.github.io/react/docs/getting-started.html#offline-transform). Then you can simply edit src/forms.js and output your compiled changes to the build directory. If you would like to create a new form element you only need to edit one section, and make a new component. In the `generateField` component add another `else if` for the new property type. Then you can reference one of the form components for an idea on what you can do. Take a look at the generic input field component:

```

var genericField = React.createClass({
  render: function(){
    return(
      <div className="element inputfield">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label>
        <input type = {this.props.type}
        placeholder = {this.props.placeholder}
        value       = {this.props.value}
        required    = {this.props.required}
        min         = {this.props.minimum}
        max         = {this.props.maximum}
        step        = {this.props.step}
        onChange    = {this.props.change}/>
      </div>
    );
  }
});



```

Current To-do List
---
   - Add more fields
   - Remove the need for Underscore


License
----

MIT

**Free Software, Hell Yeah!**

Leave a comment with any cool things you build using my library :)

[underscore]:http://underscorejs.org/
[JSON Schema]:http://json-schema.org/