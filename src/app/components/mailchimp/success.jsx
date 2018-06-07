import React from 'react';

export default class MailchimpSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
      fetch(`https://us1.api.mailchimp.com/lists`)
      .then(response => response.json())
      .then(data => console.log(data))
    
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
