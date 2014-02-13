/** @jsx React.DOM */
//form.js
var formjs = React.createClass({displayName: 'formjs',
  updateValues: function(element){
    var currentValues = this.state.values;
    if(element.childId){
      if(!currentValues[element.id]) currentValues[element.id] = [];
      currentValues[element.id][element.childId] = {name: element.name, value: element.value};
    }
    else{
      currentValues[element.id] = {name: element.name, value: element.value};
    }
    this.setState({values: currentValues});
    this.props.currentState(this.state.values);
    return false;
  },
  handleSubmit: function() {
    this.props.submitState(this.state.values);
    return false;
  },
  getInitialState: function(){
    return{ data: this.props.data,properties: this.props.data.schema.properties, values: []};

  },
  render: function() {
    var updateValues = this.updateValues;
    var id = 0;
    var elements = _.map(this.state.properties, function (property,name) {
      id++;
      if(property.type == "array"){
        if(property.items.properties){
          var childId = 0;
          var childElements = _.map(property.items.properties, function (property,name) {
            childId++;
            var fieldType = "text";
            return generateInputField( 
            {type:          fieldType, 
            label:         property.title, 
            name:          name, 
            placeholder:   property['ux-placeholder'], 
            value:         property.value,
            required:      property.required,
            description:   property.description,
            updateValues:  updateValues,
            child:         "true",
            id:            id,
            childId:       childId} );
          });
          return childElements;
        }
      }
      else{
        if(property.type == "string" || property.type == "number"){
          var fieldType = "text";
          if (property.type == "number") fieldType = "number";
          if (property.format) fieldType = property.format;
          if (!property.title) property.title = name;
          return generateInputField( 
          {type:          fieldType, 
          label:         property.title, 
          name:          name, 
          placeholder:   property['ux-placeholder'], 
          value:         property.value,
          required:      property.required,
          description:   property.description,
          updateValues:  updateValues,
          id:            id} );
        }
      }
    });
    return(
      React.DOM.form( {encType:"multipart/form-data", onSubmit:this.handleSubmit}, 
        elements,
        React.DOM.input( {type:"submit", value:this.state.data['ux-submit-text']} )
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
    this.props.updateValues({id: this.props.id, name: name, value: value,child: this.props.child,childId: this.props.childId});
    this.setState({value: value});
  },
  render: function(){
    return(
      React.DOM.div( {className:"element textfield"}, 
      React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
      React.DOM.label(null, this.props.label),
      React.DOM.input( {type:  this.props.type,
      placeholder:  this.props.placeholder,
      value:        this.state.value,
      required:     this.props.required,
      onChange:     this.handleChange})
      )
    );
  }
});
var forms = [];
for (var i = 0; i < json.length; i++) {
    forms.push(formjs( {data:json[i], submitState:submitState, currentState:currentState} ));
}
React.renderComponent(
  React.DOM.div(null, forms),
  document.body
);