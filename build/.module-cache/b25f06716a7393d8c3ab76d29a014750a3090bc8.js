/** @jsx React.DOM */
 
var blogSection = React.createClass({displayName: 'blogSection',
  getInitialState: function(){
    return{ title: 'hi'};

  },
  render: function() {
    return(
      React.DOM.div( {className:"blogSection"}, 
            React.DOM.h3(null, this.state.title)
      )
    );
  }
});

React.renderComponent(
  blogSection(null),
  document.body
  );