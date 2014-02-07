var form = React.createClass({

  getInitialState: function(){
    return({form: []});
  },
  componentWillMount: function(){
    this.setState({form: '<input type="text" name="hi"/>'});
  },
  render: function(){

    return(

      <div> hi</div>

    );
  }
});
React.renderComponent(
  <form />,
  document.body
);