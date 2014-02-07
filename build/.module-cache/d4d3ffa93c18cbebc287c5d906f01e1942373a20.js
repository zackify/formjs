/** @jsx React.DOM */
 
var initialize = React.createClass({displayName: 'initialize',
 propTypes: {
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.oneOf(INPUT_TYPES).isRequired,
      placeholder: React.PropTypes.string,
      label: React.PropTypes.string
  },
  getInitialState: function(){
    return{ data: data, title: 'hi'};

  },
  render: function() {
    var elements = this.state.data.map(function (element) {
      return generator( {type:element.type, label:element.label, name:element.name} );
    });
    return(
      React.DOM.form(null, 
        elements
      )
    );
  }
});

var generator = React.createClass({displayName: 'generator',

  render: function(){
    return(
      React.DOM.div( {class:"element"}, 
      React.DOM.label(null, this.props.label),
      React.DOM.input( {type:this.props.type, name:this.props.name} )
      )
    );
  }
});

React.renderComponent(
  initialize(null ),
  document.body
  );