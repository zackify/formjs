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
    this.setState({form: '<input type="text" name="hi"/>'});
  },
  render: function(){

    return(

      <form>

      </form>

    );
  }
});
React.renderComponent(
  <form />,
  document.body
);