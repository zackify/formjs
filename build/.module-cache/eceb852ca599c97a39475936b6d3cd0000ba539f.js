/** @jsx React.DOM */
 
var Simple = React.createClass({displayName: 'Simple',
 
  getInitialState: function(){
    return { count: 0, msg: 'hi'};
  },
 
  handleMouseDown: function(){
    this.setState({ count: this.state.count + 1, msg: 'b'});
  },
 
  render: function(){
 
    return React.DOM.div(null, 
      React.DOM.div( {class:"clicker", onMouseDown:this.handleMouseDown}, 
        " Give me the message! "
      ),
      React.DOM.div( {class:"message"}, "Message conveyed ",
        React.DOM.span( {class:"count"}, this.state.count), " time(s)"),
        React.DOM.div( {class:"msg"}, React.DOM.span(null, this.state.msg))
    )
    ;
  }
});
 
React.renderComponent(Simple( {message:"Keep it Simple", msg:"hi"}),
                  document.body);