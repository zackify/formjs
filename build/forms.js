/** @jsx React.DOM */
//form.js

var CreateFieldsMixin = {
  generateComponent: function(property,name,updateValues,id,childId,child,bulletId,bulletGroup){
      var fieldType = "text";
      var value = property.value;
      var bullets = null;
      if(this.state.values) bullets = this.state.values.bullets;
      if (property.type == "number" || property.type == "integer") fieldType = "number";
      else if (property.type == "boolean"){
        fieldType = "checkbox";
        if(!value) value = false;
      }
      if (property['ux-widget']) fieldType = property['ux-widget'];
      if (property.format){
        fieldType = property.format;
        if(property.format == "uri") fieldType = "file";
      }
      if(property.enum){
        if(property.enum.length == 2) fieldType = "radio";
        else fieldType = "select";
      }
      if (!property.title) property.title = name;
      if(bulletId >= 0) value = "";
      return generateField(
        {type:          fieldType,
        items:         property.enum,
        values:        bullets,
        label:         property.title, 
        name:          name, 
        placeholder:   property['ux-placeholder'], 
        value:         value,
        required:      property.required,
        description:   property.description,
        updateValues:  updateValues,
        child:         child,
        id:            id,
        groupId:       property.groupId,
        childId:       childId, 
        bulletId:      bulletId,
        bulletGroup:   bulletGroup,
        minimum:       property.minimum,
        maximum:       property.maximum,
        step:          property.step,
        fileUpload:    this.fileUpload} );

  },
  fileUpload: function(files){
    if(this.props.filesOnSelect) this.props.filesOnSelect(files);
    this.state.files.push(files);
  }
};
var formjs = React.createClass({displayName: 'formjs',
  mixins: [CreateFieldsMixin],
  updateValues: function(element){
    var currentValues = {};
    var parentValues = this.state.parentValues;
    var childValues = this.state.childValues;
    if(!element.value) element.value = '';
    if(element.bulletGroup){
      if(!childValues[element.bulletGroup]) childValues[element.bulletGroup] = {};
      childValues[element.bulletGroup][element.name] = element.value;
    }
    else if(element.child){
      if(!childValues[element.groupId]) childValues[element.groupId] = {};
      childValues[element.groupId][element.name] = element.value;
    }
    else{
      parentValues[element.name] = element.value;
    }
   this.setState({parentValues: parentValues});
   this.setState({childValues: childValues});
   parentValues['bullets'] = childValues;
   if(element.initial === true) return false;
   if(this.props.currentState) this.props.currentState(JSON.stringify(parentValues));

   return false;
  },
  getValues: function() {
    var parentValues = this.state.parentValues;
    parentValues['bullets'] = this.state.childValues;
    return JSON.stringify(parentValues);
  },
  getFiles: function() {
    return JSON.stringify(this.state.files);
  },
  handleSubmit: function() {
    var currentValues = this.state.parentValues;
    if(this.props.submitState) this.props.submitState(JSON.stringify(currentValues));
    if(this.state.files != '' && this.props.filesOnSubmit) this.props.filesOnSubmit(this.state.files);
    return false;
  },
  getInitialState: function(){
    return{ data: this.props.data, values: this.props.values, properties: this.props.data.schema.properties, iteration: this.props.iteration, parentValues: {}, childValues: {}, files: []};

  },
  generateChildComponent: function(fixedProps,iteration,count,id,updateValues) {
    var stop, check, valueKey, childId;
    stop = check = valueKey = childId = 0;
    var amount = count;
    var generateComponent = this.generateComponent;
    var values = this.state.values;
    var childElements = _.map(fixedProps, function (property,name) {
      property.value = null;
      if(check == count){
        if(childId != 3) amount += count;
        stop = amount + count;
        check = 0;
        valueKey++;
      }
      if(values){
        if(values['bullets'][valueKey]){
          if(childId < amount) property.value = values['bullets'][valueKey][property.title];
          if(childId >= amount && childId < stop) property.value = values['bullets'][valueKey][property.title];
        }
      }
      property.groupId = valueKey;
      childId++;
      check++;
      return generateComponent(property,name,updateValues,id,childId,true);
    });
    return childElements;
  },
  render: function() {
    var id = 0;
    var updateValues           = this.updateValues;
    var iteration              = this.state.iteration;
    var generateChildComponent = this.generateChildComponent;
    var generateComponent      = this.generateComponent
    var values                 = this.state.values;
    var elements = _.map(this.state.properties, function (property,name) {
      id++;
      if(property.type == "array"){
        if(property.items.properties){
          var fixedProps = {};
          var i, count, bulletCount;
          i = count = bulletCount = 0;
          for(var prop in property.items.properties) {
            if(property.items.properties.hasOwnProperty(prop))
            ++count;
          }
          if(values){
            for(var prop in values.bullets) {
              if(values.bullets.hasOwnProperty(prop))
              ++bulletCount;
            }
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
          var childElements =  generateChildComponent(fixedProps,iteration,count,id,updateValues);
          return React.DOM.div( {className:"child"}, 
          React.DOM.p(null, property.title),
          childElements,
          addField( {fields:property.items.properties, updateValues:updateValues, fieldCount:count} )
          );
        }
      }
      else{
          property.value = null;
          if(values) property.value = values[name];
          return generateComponent(property,name,updateValues,id);
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
  mixins: [CreateFieldsMixin],
 getInitialState: function() {
    return {fields: this.props.fields, generatedFields: [], bulletGroup: this.props.fieldCount};
  },
  generateFields: function(fields,bulletGroup){
    var bulletId     = this.state.generatedFields.length * this.props.fieldCount;
    var updateValues = this.props.updateValues;
    var id = this.props.id;
    var generateComponent = this.generateComponent;
    var generatedFields = _.map(fields, function (property,name) {
       return generateComponent(property,name,updateValues,id,null,null,bulletId,bulletGroup);
    });
  return generatedFields;
  },
  handleClick: function(event) {
    this.state.generatedFields.push(this.generateFields(this.state.fields,this.state.bulletGroup));
    this.forceUpdate();
    this.setState({bulletGroup: this.state.bulletGroup + 1});
  },
  render: function() {
    return (
      React.DOM.div( {className:"extraBullets"}, 
        this.state.generatedFields,
        React.DOM.div( {className:"button", onClick:this.handleClick}, "Add")
      )
    );
  }
});
var generateField = React.createClass({displayName: 'generateField',
  getInitialState: function() {
    var name = this.props.name;
    if(this.props.label) name = this.props.label;
    return {value: this.props.value, name: name};
  },
  componentDidMount: function(){
    this.props.updateValues({initial: true, id: this.props.id, groupId: this.props.groupId, bulletGroup: this.props.bulletGroup, name: this.state.name, value: this.props.value,child: this.props.child,childId: this.props.childId, bulletId: this.props.bulletId});
  },
  handleChange: function(e) {
    var value = e.target.value;
    if(e.target.files) this.props.fileUpload(e.target.files);
    else{
      if(this.state.value === true)  value = false;
      if(this.state.value === false) value = true;
    }
    this.props.updateValues({id: this.props.id, groupId: this.props.groupId, bulletGroup: this.props.bulletGroup, name: this.state.name, value: value,child: this.props.child, childId: this.props.childId, bulletId: this.props.bulletId});
    this.setState({value: value});
  },
  render: function(){
    if(this.props.type == "select"){
      return(
        selectField( {label:  this.props.label, 
        description:  this.props.description, 
        name:         this.props.name, 
        items:        this.props.items,
        value:        this.props.value, 
        change:       this.handleChange} )
      );
    }
    else if(this.props.type == "radio"){
      return(
        radioField( {type:  this.props.type,
        label:           this.props.label,
        description:     this.props.description,
        value:           this.state.value,
        required:        this.props.required,
        name:            this.props.name,
        change:          this.handleChange,
        items:           this.props.items} )
      );
    }
    else if(this.props.type == "textarea"){
      return(
        textareaField( 
        {label:        this.props.label,
        required:     this.props.required, 
        change:       this.handleChange,
        value:        this.state.value, 
        description:  this.props.description} )
      );
    }
    else if (this.props.type == "checkbox"){
      return(
        checkboxField( {description:  this.props.description,
        label:        this.props.label,
        value:        this.state.value,
        required:     this.props.required,
        change:       this.handleChange} )
      );
    }
    else{
      return(
        genericField( {type:  this.props.type,
        description:  this.props.description,
        label:        this.props.label,
        placeholder:  this.props.placeholder,
        value:        this.state.value,
        required:     this.props.required,
        min:          this.props.minimum,
        max:          this.props.maximum,
        step:         this.props.step,
        change:       this.handleChange})
      );
    }
  }
});

var genericField = React.createClass({displayName: 'genericField',
  render: function(){
    return(
      React.DOM.div( {className:"element inputfield"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),
        React.DOM.input( {type:  this.props.type,
        placeholder:  this.props.placeholder,
        value:        this.props.value,
        required:     this.props.required,
        min:          this.props.min,
        max:          this.props.max,
        step:         this.props.step,
        onChange:     this.props.change})
      )
    );
  }
});

var checkboxField = React.createClass({displayName: 'checkboxField',
  render: function(){
    var checked = false;
    if(this.props.value === true) checked = 'checked';
    return(
      React.DOM.div( {className:"element checkbox"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),
        React.DOM.input( {type:  "checkbox",
        required:     this.props.required,
        value:        this.props.value,
        checked:      checked,
        onChange:     this.props.change})
      )
    );
  }
});

var radioField = React.createClass({displayName: 'radioField',
  render: function(){
    if(this.props.value == this.props.items[0]) var selectedFirst = "checked";
    else var selectedSecond = "checked";
    return(
      React.DOM.div( {className:"element radio"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),React.DOM.br(null ),
        React.DOM.label(null, this.props.items[0]),
        React.DOM.input( {type:  "radio",
        value:        this.props.items[0],
        required:     this.props.required,
        name:         this.props.name,
        checked:      selectedFirst,
        onChange:     this.props.change}),
        React.DOM.label(null, this.props.items[1]),
        React.DOM.input( {type:  "radio",
        value:        this.props.items[1],
        required:     this.props.required,
        name:         this.props.name,
        checked:      selectedSecond,
        onChange:     this.props.change})
      )
    );
  }
});
var textareaField = React.createClass({displayName: 'textareaField',
  render: function(){
    return(
      React.DOM.div( {className:"element textarea"}, 
        React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
        React.DOM.label(null, this.props.label),
        React.DOM.textarea( {required:this.props.required, onChange:this.props.change}, this.props.value)
      )
    );
  }
});

var selectField = React.createClass({displayName: 'selectField',
  render: function(){
      var options = this.props.items.map(function (option) {
        return  React.DOM.option( {value:option}, option)
      });
      return(
        React.DOM.div( {className:"element select"}, 
          React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.description}} ),
          React.DOM.label(null, this.props.label),
          React.DOM.select( {value:this.props.value, onChange:this.props.change}, 
          options
          )
        )
      );
  }
});