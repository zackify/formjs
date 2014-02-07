var form = React.createClass({

  getInitialState: function(){
    return({form: []});
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