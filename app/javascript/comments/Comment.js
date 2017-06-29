import React from 'react';

const Comment  = ({comment}) => (
  <div className="Comment">
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
