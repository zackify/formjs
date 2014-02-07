/**
* @jsx React.DOM
*/

       var form = React.createClass({displayName: 'form',

  getInitialState: function(){
    return({elements: [
      {"type": "text", "label": "test label"},
      {"type": "text", "label": "testing 2"}
      ]
    });
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

      React.DOM.form(null, 
      this.state.form

      )

    );
  }
});
React.renderComponent(
  React.DOM.form(null ),
  document.body
);