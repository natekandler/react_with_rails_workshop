import React, { Component } from 'react';

class Form extends Component { 

  render() {
    return (
      <div>
      <form className="Form" onSubmit={this.props.handleFormSubmit}>
        <textarea name="body" placeholder="comment"/><br/>
        <input type="text" name="author" placeholder="author"/><br/>
        <input type="submit" value="Submit"/>
      </form>
        <a className="btn__cancel" href="#" onClick={this.props.hideCommentForm}>cancel</a>
      </div>
    );
  }
}

export default Form;
