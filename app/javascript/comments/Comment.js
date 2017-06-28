import React from 'react';

const Comment  = ({comment, deleteComment}) => (
  <div className="Comment">
    <a href="#" id={comment.id} className="delete-btn" onClick={deleteComment}>x</a>
    <div className="Comment__body">
      {comment.body}
    </div>
    <div className="Comment__author">
      <span className="Comment__author-name">author</span>
      {comment.author}
    </div>
  </div>
)

export default Comment;
