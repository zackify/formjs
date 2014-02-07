/** @jsx React.DOM */
 
var blogSection = React.createClass({displayName: 'blogSection',

  render: function() {
    return(
      React.DOM.div( {className:"blogSection"}, 
            React.DOM.h3(null, "Hey")
      )


      );


  }


});

React.renderComponent(
  blogSection(null)

  );