import React, { Component } from 'react';
import Comments from './Comments'
import Form from './Form'
import { getComments } from '../api/CommentApi'
import { getFormValues, commentList } from '../Utils/utils'

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      showForm: false,
      comments: []
    };
  }

  componentDidMount() {
    getComments.bind(this)();
  }

  handleFormSubmit(event) {
    event.preventDefault();
    let newComment = getFormValues(event.target)
    if(newComment.body){
      let list = [...this.state.comments, newComment]
      this.setState({ 
        showForm: false,
        comments: list
      })
    }
  }

  hideCommentForm(e) {
    e.preventDefault();
    this.setState({ showForm: false })
  }

  showCommentForm() {
    this.setState({ showForm: true })
  } 
  
  renderForm() {
    if(this.state.showForm){
      return <Form handleFormSubmit={this.handleFormSubmit.bind(this)} hideCommentForm={this.hideCommentForm.bind(this)} />
    } else {
      return <button onClick={this.showCommentForm.bind(this)}>Add Comment</button>
    }
  }

  render() {
    return (
      <div className="CommentSection">
        <Comments comments={this.state.comments} />
        {this.renderForm()}
      </div>
    )
  }
}

export default CommentSection

