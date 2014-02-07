/** @jsx React.DOM */
//form.js
var initialize = React.createClass({displayName: 'initialize',
  updateValues: function(element){
    var currentValues = this.state.values;
    currentValues[element.id] = {name: element.name, value: element.value};
    this.setState({values: currentValues});
    console.log(currentValues);
    return false;
  },
  handleSubmit: function() {
  $.ajax({
      url: this.state.form.action,
      dataType: 'json',
      data: this.state.values,
      type: this.state.form.type,
      success: function(data) {
        //this.setState({data: data});
      }.bind(this)
    });
    return false;
  },
  getInitialState: function(){
    return{ data: this.props.fields, form: this.props.formInfo,values: []};

  },
  render: function() {
    var updateValues = this.updateValues;
    var id = 0;
    var elements = this.state.data.map(function (element) {
      id++;
      if(element.type == "textarea"){
        return generateTextarea( 
        {label:         element.label, 
        name:          element.name, 
        placeholder:   element.placeholder, 
        value:         element.value, 
        updateValues:  updateValues, 
        id:            id} );
      }
      else if(element.type == "select"){
        return generateSelectbox( 
        {name:          element.name, 
        options:       element.options,
        updateValues:  updateValues, 
        id:            id} );
      }
      else{
        return generateInputField( 
        {type:          element.type, 
        label:         element.label, 
        name:          element.name, 
        placeholder:   element.placeholder, 
        value:         element.value, 
        updateValues:  updateValues,
        id:            id} );
      }
    });
    return(
      React.DOM.form( {ref:"form", onSubmit:this.handleSubmit}, 
        elements,
        React.DOM.input( {type:"submit", value:this.state.form.submitText} )
      )
    );
  }
});
//regular input fields

var generateInputField = React.createClass({displayName: 'generateInputField',
  getInitialState: function() {
    return {value: this.props.value};
  },
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    console.log(value);
    this.props.updateValues({id: this.props.id, name: name, value: value});
    this.setState({value: value});
  },
  render: function(){
    return(
      React.DOM.div( {className:"element textfield"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.input( {type:this.props.type, placeholder:this.props.placeholder, value:this.state.value, onChange:this.handleChange})
      )
    );
  }
});
//textarea

var generateTextarea = React.createClass({displayName: 'generateTextarea',
  getInitialState: function() {
    return {value: this.props.value};
  },
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, name: name, value: value});
    this.setState({value: value});
  },
  render: function(){
    return(
      React.DOM.div( {className:"element textarea"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.textarea( {placeholder:this.props.placeholder, onChange:this.handleChange}, this.state.value)
      )
    );
  }
});
//select box
var generateSelectbox = React.createClass({displayName: 'generateSelectbox',
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, name: name, value: value});
  },
  render: function(){
    var options = this.props.options.map(function (option) {
      return  React.DOM.option( {value:option.value}, option.text)
    });
    return(
      React.DOM.div( {className:"element select"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.select( {onChange:this.handleChange}, 
      options
      )
      )
    );
  }
});