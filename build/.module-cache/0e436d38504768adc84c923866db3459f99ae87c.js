/**
* @jsx React.DOM
*/

var form = React.createClass({displayName: 'form',

  
  render: function(){

    return(

      React.DOM.div(null, 
      " hi "
      )

    );
  }
});
React.renderComponent(
  React.DOM.form(null ),
  document.body
);