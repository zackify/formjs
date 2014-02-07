/** @jsx React.DOM */
 
var blogSection = React.createClass({displayName: 'blogSection',
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
            React.DOM.h3( {onClick:this.handleClick}, this.state.title),
            blogTitle( {onClick:this.handleTitleSubmit})
      )
    );
  }
});
var blogTitle = React.createClass({displayName: 'blogTitle',

  handleSubmit: function(){
    this.handleTitleSubmit({title: this.refs.title});
            return false;

  },
  render: function(){
    return(

      React.DOM.form(null, 
      React.DOM.input( {type:"text", ref:"title"} ),
      React.DOM.input( {type:"submit", onClick:this.handleSubmit})

      )

    );
  }
});
React.renderComponent(
  blogSection(null),
  document.body
  );