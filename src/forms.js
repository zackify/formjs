/** @jsx React.DOM */
//form.js
var formjs = React.createClass({
  updateValues: function(element){
    var currentValues = {};
    var parentValues = this.state.parentValues;
    var childValues = this.state.childValues;
    var groupId = element.groupId;
    var value = element.value;
    if(!value) value = '';
    if(element.child){
      if(!childValues[groupId]) childValues[groupId] = {};
      childValues[groupId][element.name] = value;
    }
    else{
      parentValues[element.name] = value;
    }
   this.setState({parentValues: parentValues});
   this.setState({childValues: childValues});
   currentValues = parentValues;
   currentValues['bullets'] = childValues;
   console.log(JSON.stringify(parentValues));

  return false;
  },
  handleSubmit: function() {
    this.props.submitState(this.state.values);
    return false;
  },
  getInitialState: function(){
    return{ data: this.props.data,properties: this.props.data.schema.properties, iteration: this.props.number, parentValues: {}, childValues: {}};

  },
  childElements: function(fixedProps,iteration,count,id,updateValues) {
    var stop = 0;
    var check = 0;
    var valueKey = 0;
    var amount = count;
    var childId = 0;
    var childElements = _.map(fixedProps, function (property,name) {
      property.value = '';
      if(check == count){
        if(childId != 3) amount = amount + count;
        stop = amount + count;
        check = 0;
        valueKey++;
      }
      if(values[iteration]){
        if(values[iteration]['bullets'][valueKey]){
          if(childId < amount) property.value = values[iteration]['bullets'][valueKey][property.title];
          if(childId >= amount && childId < stop) property.value = values[iteration]['bullets'][valueKey][property.title];
          property.groupId = valueKey;
        }
      }
      childId++;
      check++;
      var fieldType = "text";
      if (property.type == "number") fieldType = "number";
      if (property.format) fieldType = property.format;
      if (!property.title) property.title = name;
      if(property.enum && property.enum.length > 2) fieldType = "select";
      if(property.enum && property.enum.length == 2) fieldType = "radio";
      return <generateField 
        type         = {fieldType}
        items        = {property.enum}
        values       = {values.bullets}
        label        = {property.title} 
        name         = {name} 
        placeholder  = {property['ux-placeholder']} 
        value        = {property.value}
        required     = {property.required}
        description  = {property.description}
        updateValues = {updateValues}
        child        = "true"
        id           = {id}
        groupId      = {property.groupId}
        childId      = {childId} />;
    });
    return childElements;
  },
  render: function() {
    var updateValues = this.updateValues;
    var id = 0;
    var iteration = this.state.iteration;
    var generateElements = this.childElements;
    var elements = _.map(this.state.properties, function (property,name) {
      id++;
      if(property.type == "array"){
        if(property.items.properties){
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
          var childElements = generateElements(fixedProps,iteration,count,id,updateValues);
          return <div className="child">
          <p>{property.title}</p>
          {childElements}
          <addField fields={property.items.properties} updateValues={updateValues} id={id} fieldCount={count} />
          </div>;
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
          return <generateField 
          type         = {fieldType} 
          items        = {property.enum}
          label        = {property.title} 
          name         = {name} 
          placeholder  = {property['ux-placeholder']} 
          value        = {values[name]}
          required     = {property.required}
          description  = {property.description}
          updateValues = {updateValues}
          id           = {id} />;
        }
      }
    });
    var formDescription;
    if(this.state.data.description){
      formDescription = <p dangerouslySetInnerHTML={{__html: this.state.data.description}} />;
    }

    return(
      <div>
      {formDescription}
      <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
        {elements}
        <input type="submit" value={this.state.data['ux-submit-text']} />
      </form>
      </div>
    );
    
  }
});

var addField = React.createClass({
 getInitialState: function() {
    return {fields: this.props.fields, generatedFields: []};
  },
  generateFields: function(fields){
    var bulletId = this.state.generatedFields.length * this.props.fieldCount;
    var updateValues = this.props.updateValues;
    var id = this.props.id;
    var generatedFields = _.map(fields, function (property,name) {
      var fieldType = "text";
      if (property.type == "number") fieldType = "number";
      if (property.format) fieldType = property.format;
      if (!property.title) property.title = name;
      if(property.enum && property.enum.length > 2) fieldType = "select";
      if(property.enum && property.enum.length == 2) fieldType = "radio";
      bulletId++;
      return <generateField 
      type         = {fieldType} 
      items        = {property.enum}
      label        = {property.title} 
      name         = {name} 
      placeholder  = {property['ux-placeholder']} 
      value        = {values[name]}
      required     = {property.required}
      updateValues = {updateValues}
      description  = {property.description}
      id           = {id}
      bulletId     = {bulletId} />;
    });
  return generatedFields;
  },
  handleClick: function(event) {
    this.state.generatedFields.push(this.generateFields(this.state.fields));
    this.forceUpdate();
  },
  render: function() {
    var fields = this.state.generatedFields;
    return (
      <div className="extraBullets">
        {fields}
        <div className="button" onClick={this.handleClick}>Add</div>
      </div>
    );
  }
});
var generateField = React.createClass({
  getInitialState: function() {
    var name = this.props.name;
    if(this.props.label) name = this.props.label;
    return {value: this.props.value, name: name};
  },
  componentDidMount: function(){
    this.props.updateValues({id: this.props.id, groupId: this.props.groupId, name: this.state.name, value: this.props.value,child: this.props.child,childId: this.props.childId, bulletId: this.props.bulletId});
  },
  handleChange: function(e) {
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, groupId: this.props.groupId, name: this.state.name, value: value,child: this.props.child, childId: this.props.childId, bulletId: this.props.bulletId});
    this.setState({value: value});
  },
  render: function(){
    if(this.props.type == "select"){
      var name = this.props.name;
      var selected = '';
      var options = this.props.items.map(function (option) {
        return  <option value={option}>{option}</option>
      });
      return(
        <div className="element select">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label>
        <select value={this.props.value} onChange={this.handleChange}>
        {options}
        </select>
        </div>
      );
    }
    if(this.props.type == "radio"){
      if(this.props.value == this.props.items[0]) var selectedFirst = "checked";
      if(this.props.value == this.props.items[1]) var selectedSecond = "checked";
      return(
        <div className="element radio">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label><br />
        <label>{this.props.items[0]}</label>
        <input type = {this.props.type}
        value       = {this.props.items[0]}
        required    = {this.props.required}
        name        = {this.props.name}
        checked     = {selectedFirst}
        onChange    = {this.handleChange}/>
        <label>{this.props.items[1]}</label>
        <input type = {this.props.type}
        value       = {this.props.items[1]}
        required    = {this.props.required}
        name        = {this.props.name}
        checked     = {selectedSecond}
        onChange    = {this.handleChange}/>
        </div>
      );
    }
    else{
      return(
        <div className="element textfield">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label>
        <input type = {this.props.type}
        placeholder = {this.props.placeholder}
        value       = {this.state.value}
        required    = {this.props.required}
        onChange    = {this.handleChange}/>
        </div>
      );
    }
  }
});
var forms = [];
for (var i = 0; i < json.length; i++) {
    forms.push(<formjs data={json[i]} values={values[i]} number={i} submitState={submitState} currentState={currentState} />);
}
React.renderComponent(
  <div>{forms}</div>,
  document.body
);