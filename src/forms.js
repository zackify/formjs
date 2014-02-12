/** @jsx React.DOM */
//form.js
var formjs = React.createClass({
  updateValues: function(element){
    var currentValues = this.state.values;
    currentValues[element.id] = {name: element.name, value: element.value};
    this.setState({values: currentValues});
    return false;
  },
  handleSubmit: function() {
    $.ajax({
      url: this.state.data.href,
      dataType: 'json',
      data: this.state.values,
      type: this.state.data.method,
      success: function(data) {
        //this.setState({data: data});
      }.bind(this)
    });
    return false;
  },
  getInitialState: function(){
    //console.log(this.props.data);
    return{ data: this.props.data,properties: this.props.data.schema.properties, values: []};

  },
  render: function() {
    var updateValues = this.updateValues;
    var id = 0;
    //console.log(this.state.properties);
    var elements = _.map(this.state.properties, function (property,name) {
      id++;
      if(property.type == "string"){
        var fieldType = "text";
        if (property.format) fieldType = property.format;
        if (!property.title) property.title = name;

        return <generateInputField 
        type         = {fieldType} 
        label        = {property.title} 
        name         = {name} 
        placeholder  = {property['ux-placeholder']} 
        value        = {property.value}
        required     = {property.required}
        updateValues = {updateValues}
        id           = {id} />;
      }
      if(property.type == "number"){
        var fieldType = "number";
        if (property.format) fieldType = property.format; // if you want to use a range field
        if (!property.title) property.title = name;
        
        return <generateInputField 
        type         = {fieldType} 
        label        = {property.title} 
        name         = {name} 
        placeholder  = {property['ux-placeholder']} 
        value        = {property.value}
        required     = {property.required}
        updateValues = {updateValues}
        id           = {id} />;
      }
    });
    return(
      <form onSubmit={this.handleSubmit}>
        {elements}
        <input type="submit" value={this.state.data['ux-submit-text']} />
      </form>
    );
    
  }
});
//regular input fields

var generateInputField = React.createClass({
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
      <div className="element textfield">
      <label>{this.props.label}</label>
      <input type = {this.props.type}
      placeholder = {this.props.placeholder}
      value       = {this.state.value}
      required    = {this.props.required}
      onChange    = {this.handleChange}/>
      </div>
    );
  }
});
React.renderComponent(
  <formjs data={json} />,
  document.body
);