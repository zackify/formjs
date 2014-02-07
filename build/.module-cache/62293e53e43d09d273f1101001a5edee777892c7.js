/** @jsx React.DOM */
//form.js
var initialize = React.createClass({displayName: 'initialize',
  getInitialState: function(){
    return{ data: elements, form: form,submit_text: '', action: '', method: ''};

  },
  componentWillMount: function(){
    var setup = this.state.form.map(function (setup) {
      this.setState({submitText: setup.submitText, action: action, method: method});
    });
  },
  render: function() {
    var elements = this.state.data.map(function (element) {
      
      if(element.type == "textarea"){
        return generateTextarea( {label:element.label, name:element.name, placeholder:element.placeholder, value:element.value} );
      }
      else if(element.type == "select"){
        return generateSelectbox( {name:element.name, options:element.options} );
      }
      else{
        return generateInputField( {type:element.type, label:element.label, name:element.name, placeholder:element.placeholder, value:element.value} );
      }
    });
    return(
      React.DOM.form(null, 
      this.state.submitText,
        elements
      )
    );
  }
});
//regular input fields

var generateInputField = React.createClass({displayName: 'generateInputField',

  render: function(){
    return(
      React.DOM.div( {class:"element textfield"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.input( {type:this.props.type, name:this.props.name, placeholder:this.props.placeholder, value:this.props.value})
      )
    );
  }
});
//textarea

var generateTextarea = React.createClass({displayName: 'generateTextarea',

  render: function(){
    return(
      React.DOM.div( {class:"element textarea"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.textarea( {name:this.props.name, placeholder:this.props.placeholder}, this.props.value)
      )
    );
  }
});
//select box
var generateSelectbox = React.createClass({displayName: 'generateSelectbox',

  render: function(){
    var options = this.props.options.map(function (option) {
      return  React.DOM.option( {value:option.value}, option.text)
    });
    return(
      React.DOM.div( {class:"element select"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.select( {name:this.props.name}, 
      options
      )
      )
    );
  }
});
React.renderComponent(
  initialize(null ),
  document.body
  );