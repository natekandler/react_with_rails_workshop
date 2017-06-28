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

export function deleteComment(event) {
  event.preventDefault()
  let token = document.head.querySelector("[name=csrf-token]").content;
  let id = event.target.getAttribute('id')

  fetch(`comments/${id}.json`, {
    method: 'delete',
    body: JSON.stringify({"id": id}),
    headers: {
      'X-CSRF-Token': token,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  }).then((response) => {
    handleCommentDeleteResponse.bind(this)(response)
  })
}
function handleCommentDeleteResponse(response){
  response.json().then((data)=>{
    let list = this.state.comments
    list = list.filter((comment) => {return comment.id !=  data.id})
    this.setState({comments: list})
  })
}
