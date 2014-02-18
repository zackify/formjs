/** @jsx React.DOM */
//form.js
var formjs = React.createClass({
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
              value        = {property.value}
              required     = {property.required}
              description  = {property.description}
              updateValues = {updateValues}
              child        = "true"
              id           = {id}
              childId      = {childId} />;
          });
          return <div className="child"><p>{property.title}</p>{childElements}</div>;
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
          value        = {property.value}
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


var generateField = React.createClass({
  getInitialState: function() {
    return {value: this.props.value};
  },
  componentDidMount: function(){
    this.props.updateValues({id: this.props.id, name: this.props.name, value: this.props.value,child: this.props.child,childId: this.props.childId});
  },
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, name: name, value: value,child: this.props.child,childId: this.props.childId});
    this.setState({value: value});
  },
  render: function(){
    if(this.props.type == "select"){
      var options = this.props.items.map(function (option) {
        return  <option value={option}>{option}</option>
      });
      return(
        <div className="element select">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label>
        <select onChange={this.handleChange}>
        {options}
        </select>
        </div>
      );
    }
    if(this.props.type == "radio"){
      return(
        <div className="element radio">
        <p dangerouslySetInnerHTML={{__html: this.props.description}} />
        <label>{this.props.label}</label><br />
        <label>{this.props.items[0]}</label>
        <input type = {this.props.type}
        value       = {this.props.items[0]}
        required    = {this.props.required}
        name        = {this.props.name}
        onChange    = {this.handleChange}/>
        <label>{this.props.items[1]}</label>
        <input type = {this.props.type}
        value       = {this.props.items[1]}
        required    = {this.props.required}
        name        = {this.props.name}
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
    forms.push(<formjs data={json[i]} submitState={submitState} currentState={currentState} />);
}
React.renderComponent(
  <div>{forms}</div>,
  document.body
);