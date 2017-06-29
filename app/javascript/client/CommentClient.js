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
