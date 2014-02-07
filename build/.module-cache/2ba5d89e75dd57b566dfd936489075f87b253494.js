/** @jsx React.DOM */
 
var Simple = React.createClass({displayName: 'Simple',
 
  getInitialState: function(){
    return { count: 0 };
  },
 
  handleMouseDown: function(){
    prompt('I was told: ');
    this.setState({ count: this.state.count + 1});
  },
 
  render: function(){
 
    return React.DOM.div(null, 
      React.DOM.div( {class:"clicker", onMouseDown:this.handleMouseDown}, 
        " Give me the message! "
      ),
      React.DOM.div( {class:"message"}, "Message conveyed ",
        React.DOM.span( {class:"count"}, this.state.count), " time(s)")
    )
    ;
  }
});
 
React.renderComponent(Simple( {message:"Keep it Simple"}),
                  document.body);