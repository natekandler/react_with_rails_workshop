export function getComments() {
  fetch('/comments.json')
  .then((response) => {
    return response.json();
  }) 
  .then((responseObject) => {
    this.setState({
      comments: responseObject
    }) 
  });
};

export function createComment(newComment) {
  let token = document.head.querySelector("[name=csrf-token]").content;
  let body = JSON.stringify({comment: newComment});
  fetch('/comments', {
    method: 'post',
    body: body,
    headers: {
      'X-CSRF-Token': token,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  .then((response) => {
    response.json().then((data) => {
      let list = [...this.state.comments, data]
      this.setState({ 
        showForm: false,
        comments: list
      })
    })
  })
}
