var form = React.createClass({

  getInitialState: function(){
    return({form: []});
  },
  componentWillMount: function(){
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