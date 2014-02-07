/** @jsx React.DOM */
//form.js
var initialize = React.createClass({displayName: 'initialize',
  getInitialState: function(){
    return{ data: data, title: 'hi'};

  },
  render: function() {
    var elements = this.state.data.map(function (element) {
      
      if(element.type == "textarea"){
        return generateTextarea( {label:element.label, name:element.name, placeholder:element.placeholder} );
      }
      else{
        return generateInputField( {type:element.type, label:element.label, name:element.name, placeholder:element.placeholder} );
      }
    });
    return(
      React.DOM.form(null, 
        elements
      )
    );
  }
});

var generateInputField = React.createClass({displayName: 'generateInputField',

  render: function(){
    return(
      React.DOM.div( {class:"element"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.input( {type:this.props.type, name:this.props.name, placeholder:this.props.placeholder})
      )
    );
  }
});

React.renderComponent(
  initialize(null ),
  document.body
  );