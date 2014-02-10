/** @jsx React.DOM */
//form.js
var formjs = React.createClass({
  updateValues: function(element){
    var currentValues = this.state.values;
    currentValues[element.id] = {name: element.name, value: element.value};
    this.setState({values: currentValues});
    console.log(this.state.values);
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
    return{ data: this.props.fields, form: this.props.info,values: []};

  },
  render: function() {
    var updateValues = this.updateValues;
    var id = 0;
    var elements = this.state.data.map(function (element) {
      id++;
      if(element.type == "textarea"){
        return <generateTextarea 
        label        = {element.label} 
        name         = {element.name} 
        placeholder  = {element.placeholder} 
        value        = {element.value}
        required     = {element.required}
        updateValues = {updateValues} 
        id           = {id} />;
      }
      else if(element.type == "number" || element.type == "range"){
        return <generateNumberField 
        label        = {element.label} 
        name         = {element.name} 
        type         = {element.type} 
        value        = {element.value}
        min          = {element.min} 
        max          = {element.max} 
        step         = {element.step}
        required     = {element.required}
        updateValues = {updateValues} 
        id           = {id} />;
      }
      else if(element.type == "select"){
        return <generateSelectbox 
        name         = {element.name} 
        options      = {element.options}
        updateValues = {updateValues} 
        id           = {id} />;
      }
      else{
        return <generateInputField 
        type         = {element.type} 
        label        = {element.label} 
        name         = {element.name} 
        placeholder  = {element.placeholder} 
        value        = {element.value}
        required     = {element.required}
        updateValues = {updateValues}
        id           = {id} />;
      }
    });
    return(
      <form onSubmit={this.handleSubmit}>
        {elements}
        <input type="submit" value={this.state.form.submitText} />
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

// number fields

var generateNumberField = React.createClass({
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
      <div className="element number">
      <label>{this.props.label}</label>
      <input 
      type      = {this.props.type} min="0"
       max      = {this.props.max}
       step     = {this.props.step}
       value    = {this.props.value}
       required = {this.props.required}
       onChange = {this.handleChange}/>
      </div>
    );
  }
});
//textarea

var generateTextarea = React.createClass({
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
      <div className="element textarea">
      <label>{this.props.label}</label>
      <textarea placeholder={this.props.placeholder} required={this.props.required} onChange={this.handleChange}>{this.state.value}</textarea>
      </div>
    );
  }
});
//select box
var generateSelectbox = React.createClass({
  handleChange: function(e) {
    var name = this.props.name;
    var value = e.target.value;
    this.props.updateValues({id: this.props.id, name: name, value: value});
  },
  render: function(){
    var options = this.props.options.map(function (option) {
      return  <option value={option.value}>{option.text}</option>
    });
    return(
      <div className="element select">
      <label>{this.props.label}</label>
      <select onChange={this.handleChange}>
      {options}
      </select>
      </div>
    );
  }
});
React.renderComponent(
  <formjs fields={fields} info={info} />,
  document.body
);