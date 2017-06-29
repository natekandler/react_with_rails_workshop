import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import CommentsContainer from './CommentsContainer'

class CommentIndex extends Component {
  render() {
    return (
      <CommentsContainer />  
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CommentIndex name="CommentIndex" />,
    document.body.appendChild(document.createElement('div')),
  )
})
