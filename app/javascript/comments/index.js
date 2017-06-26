import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import CommentSection from './CommentSection'

class CommentIndex extends Component {
  render() {
    return (
      <CommentSection />  
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CommentIndex name="CommentIndex" />,
    document.body.appendChild(document.createElement('div')),
  )
})
