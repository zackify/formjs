/** @jsx React.DOM */
 
var formgen = React.createClass({displayName: 'formgen',
  getInitialState: function(){
    return{ data: data, title: 'hi'};

  },
  render: function() {
    var elements = this.state.data.map(function (form) {
      return Comment( {type:form.type, label:form.label} );
    });
    return(
      React.DOM.form(null, 
        elements
      )
    );
  }
});

React.renderComponent(
  formgen(null ),
  document.body
  );