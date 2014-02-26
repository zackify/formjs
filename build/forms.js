/** @jsx React.DOM */
//form.js
var formjs = React.createClass({displayName: 'formjs',
  updateValues: function(element){
    var currentValues = this.state.values;
    if(element.childId){
      if(!currentValues[element.id]) currentValues[element.id] = [];
      currentValues[element.id][element.childId] = {name: element.name, title: element.title, value: element.value};
    }
    else if(element.bulletId){
      if(!currentValues[element.id]['bullets']) currentValues[element.id]['bullets'] = [];
      currentValues[element.id]['bullets'][element.bulletId] = {name: element.name, title: element.title, value: element.value};
    }
    else{
      currentValues[element.id] = {name: element.name, title: element.title, value: element.value};
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
          var fixedProps = {};
          var i = 0;
          var count= 0;
          var bulletCount = 0;
          for(var prop in property.items.properties) {
            if(property.items.properties.hasOwnProperty(prop))
            ++count;
          }
          for(var prop in values.bullets) {
            if(values.bullets.hasOwnProperty(prop))
            ++bulletCount;
          }
          if(count >= 2){
            arrayNum = 0;
            for (var key in property.items.properties) {
             if(i == count) break;
             fixedProps[key] = property.items.properties[key];
             fixedProps[i] = property.items.properties[key];
             if(count > 2){
               var amount = count - 2;
               _(amount).times(function (n){
                var num = n + 1;
                fixedProps[i+50*num] = property.items.properties[key];
               });
             }
             i++;
            }
            arrayNum++;
          }
          var stop = 0;
          var test = -1;
          var check = 0;
          var valueKey = 0;
          var amount = count;
          var childElements = _.map(fixedProps, function (property,name) {
            property.value = '';
            if(check == count){
              if(childId != 3) amount = amount + count;
              stop = amount + count;
              check = 0;
              valueKey++;
            }
            if(values['bullets'][valueKey]){
              if(childId < amount) property.value = values['bullets'][valueKey][property.title];
              if(childId >= amount && childId < stop) property.value = values['bullets'][valueKey][property.title];
            }
            childId++;
            check++;
            var fieldType = "text";
            if (property.type == "number") fieldType = "number";
            if (property.format) fieldType = property.format;
            if (!property.title) property.title = name;
            if(property.enum && property.enum.length > 2) fieldType = "select";
            if(property.enum && property.enum.length == 2) fieldType = "radio";
            var fields = [];
            fields.push(generateField( 
              {type:          fieldType,
              items:         property.enum,
              values:        values.bullets,
              label:         property.title, 
              name:          name, 
              placeholder:   property['ux-placeholder'], 
              value:         property.value,
              required:      property.required,
              description:   property.description,
              updateValues:  updateValues,
              child:         "true",
              id:            id,
              childId:       childId} ));
            return fields;
          });
          
          return React.DOM.div( {className:"child"}, React.DOM.p(null, property.title),childElements, addField( {fields:property.items.properties, updateValues:updateValues, id:id, fieldCount:count} ));
        }
      }
      else{
        if(property.type == "string" || property.type == "number"){
          var fieldType = "text";
          if (property.type == "number") fieldType = "number";
          if (property.format) fieldType = property.format;
          if (!property.title) property.title = name;

          if(property.enum && property.enum.length > 2) fieldType = "select";
          if(property.enum && property.enum.length == 2) fieldType = "radio";
          return generateField( 
          {type:          fieldType, 
          items:         property.enum,
          label:         property.title, 
          name:          name, 
          placeholder:   property['ux-placeholder'], 
          value:         values[name],
          required:      property.required,
          description:   property.description,
          updateValues:  updateValues,
          id:            id} );
        }
      }
    });
    var formDescription;
    if(this.state.data.description){
      formDescription = React.DOM.p( {dangerouslySetInnerHTML:{__html: this.state.data.description}} );
    }

    return(
      React.DOM.div(null, 
      formDescription,
      React.DOM.form( {encType:"multipart/form-data", onSubmit:this.handleSubmit}, 
        elements,
        React.DOM.input( {type:"submit", value:this.state.data['ux-submit-text']} )
      )
      )
    );
    
  }
});

var addField = React.createClass({displayName: 'addField',
 getInitialState: function() {
    return {fields: this.props.fields, generatedFields: []};
  },
  handleClick: function(event) {
    var bulletId = this.state.generatedFields.length * this.props.fieldCount;
    var updateValues = this.props.updateValues;
    var id = this.props.id;
    var generatedFields = _.map(this.state.fields, function (property,name) {
        var fieldType = "text";
        if (property.type == "number") fieldType = "number";
        if (property.format) fieldType = property.format;
        if (!property.title) property.title = name;
        if(property.enum && property.enum.length > 2) fieldType = "select";
        if(property.enum && property.enum.length == 2) fieldType = "radio";
        bulletId++;
        return generateField( 
        {type:          fieldType, 
        items:         property.enum,
        label:         property.title, 
        name:          name, 
        placeholder:   property['ux-placeholder'], 
        value:         values[name],
        required:      property.required,
        updateValues:  updateValues,
        description:   property.description,
        id:            id,
        bulletId:      bulletId} );
    });
    this.state.generatedFields.push(generatedFields);
    this.forceUpdate();
  },
  render: function() {
    var fields = this.state.generatedFields;
    return (
      React.DOM.div( {className:"extraBullets"}, 
        fields,
        React.DOM.div( {className:"button", onClick:this.handleClick}, "Add")
      )
    );
  }
});
var generateField = React.createClass({displayName: 'generateField',
  getInitialState: function() {
    return {value: this.props.value};
  },
  componentDidMount: function(){
    this.props.updateValues({id: this.props.id, name: this.props.name, title: this.props.label, value: this.props.value,child: this.props.child,childId: this.props.childId, bulletId: this.props.bulletId});
  },
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, name: name, title: this.props.label, value: value,child: this.props.child, childId: this.props.childId, bulletId: this.props.bulletId});
    this.setState({value: value});
  },
  render: function(){
    if(this.props.type == "select"){
      var name = this.props.name;
      var selected = '';
      var options = this.props.items.map(function (option) {
        return  React.DOM.option( {value:option}, option)
      });
      return(
        React.DOM.div( {className:"element select"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),
        React.DOM.select( {value:this.props.value, onChange:this.handleChange}, 
        options
        )
        )
      );
    }
    if(this.props.type == "radio"){
      if(this.props.value == this.props.items[0]) var selectedFirst = "checked";
      if(this.props.value == this.props.items[1]) var selectedSecond = "checked";
      return(
        React.DOM.div( {className:"element radio"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),React.DOM.br(null ),
        React.DOM.label(null, this.props.items[0]),
        React.DOM.input( {type:  this.props.type,
        value:        this.props.items[0],
        required:     this.props.required,
        name:         this.props.name,
        checked:      selectedFirst,
        onChange:     this.handleChange}),
        React.DOM.label(null, this.props.items[1]),
        React.DOM.input( {type:  this.props.type,
        value:        this.props.items[1],
        required:     this.props.required,
        name:         this.props.name,
        checked:     selectedSecond,
        onChange:     this.handleChange})
        )
      );
    }
    else{
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
  }
});
var forms = [];
for (var i = 0; i < json.length; i++) {
    forms.push(formjs( {data:json[i], values:values[i], number:i, submitState:submitState, currentState:currentState} ));
}
React.renderComponent(
  React.DOM.div(null, forms),
  document.body
);