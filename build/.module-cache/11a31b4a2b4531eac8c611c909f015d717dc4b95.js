var form = React.createClass({

  getInitialState: function(){
    

    return({elements: [
      {"type": "text", "label": "test label"},
      {"type": "text", "label": "testing 2"}
      ]
    });
    this.setState({elements: elements, form: ''});
  },
  componentWillMount: function(){
    var elements = this.state.elements;
    for (var i = 0; i < elements; i++) {
    form = '<input type="text" />';
    //Do something
    }
    this.setState({form: '<input type="text" name="hi"/>'});
  },
  render: function(){

    return(

      <form>
      {this.state.form}

      </form>

    );
  }
});
React.renderComponent(
  <form />,
  document.body
);