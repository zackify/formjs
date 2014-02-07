/** @jsx React.DOM */
 
var formgen = React.createClass({displayName: 'formgen',
  getInitialState: function(){
    return{ data: data, title: 'hi'};

  },
  // handleClick: function(){
  //   this.setState({title: this.state.data});
  // },
  // handleTitleSubmit: function(title){
  //   this.setState({title: title});
  //   return false;
  // },
  componentWillMount: function() {
    var elements = this.state.data;
    var renderedForm = [];
    for (var i = 0; i < elements.length; i++) {
      var type  = elements[i]['type'];
      var label = elements[i]['label'];
      renderedForm.push('<label for="male">Male</label><input id="" type="' + type + '" />');
    }
    this.setState({data: renderedForm});
  },
  render: function() {
    return(
      React.DOM.form(null, 
        " dangerouslySetInnerHTML=",{__html: this.state.data}
      )
    );
  }
});

React.renderComponent(
  formgen(null ),
  document.body
  );