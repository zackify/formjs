/** @jsx React.DOM */
 
var formgen = React.createClass({displayName: 'formgen',
  getInitialState: function(){
    return{ title: 'hi'};

  },
  handleClick: function(){
    this.setState({title: 'you clicked!'});
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