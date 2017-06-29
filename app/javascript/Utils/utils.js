const getFormValues = (targetedForm) => {
  var kvpairs = {};
  var form = targetedForm
  for ( var i = 0; i < form.elements.length; i++ ) {
    var e = form.elements[i];
    if(e.name){
      kvpairs[e.name] = e.value;
    }
  }
  return kvpairs;
}

const commentList = () => {
  const commentList = [
    {
      author: "Kurt Vonnegut", 
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }, 
    {
      author: "Tom Robbins", 
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  ];
  return commentList;
}


export { getFormValues, commentList }
