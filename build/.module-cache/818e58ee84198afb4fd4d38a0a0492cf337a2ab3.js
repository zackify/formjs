var form = React.createClass({

  getInitialState: function(){
    

    return({elements: [
      {"type": "text", "label": "test label"},
      {"type": "text", "label": "testing 2"}
      ]
    });
    this.setState({elements: elements});
  },
  componentWillMount: function(){
    for (var i = 0; i < this.state.elements.length; i++) {
    alert(this.state.elements[i]);
    //Do something
}
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