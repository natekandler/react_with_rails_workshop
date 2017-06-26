import React, { Component } from 'react';
import Comment from './Comment';

class Comments extends Component {
  renderComments() {
    if(this.props.commentList){
      return this.props.commentList.map( (comment, index) => 
        <Comment key={index} comment={comment}/>
      )
    }
  }

  render() {
    return (
      <div className="Comments">
        <div className="Header">
          Comments
          </div>
        {this.renderComments()}
      </div>
    );
  }
}

export default Comments;
