/** @jsx React.DOM */
 
var formgen = React.createClass({displayName: 'formgen',
  getInitialState: function(){
    return{ data: data, title: 'hi'};

  },
  handleClick: function(){
    this.setState({title: this.state.data});
  },
  handleTitleSubmit: function(title){
    this.setState({title: title});
    return false;
  },
  render: function() {
    return(
      React.DOM.div( {className:"blogSection"}, 
            React.DOM.h3( {onClick:this.handleClick}, this.state.title)
      )
    );
  }
});

React.renderComponent(
  formgen(null ),
  document.body
  );