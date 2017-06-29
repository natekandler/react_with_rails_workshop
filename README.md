# SD React With Rails Workshop

## Learning Competencies

* Webpacker Gem
* Pack tags
* How React and Rails work together
* How components will fetch their data 

## Summary
This workshop will build on the comment section created in our previous [intro to React workshop](https://github.com/Devbootcamp/sd-intro-to-react-workshop). We'll be taking the comment section, adding it to a Ruby on Rails app and adding database persistence for the comments. However if you didn't attend that workshop, don't worry! It can function as a stand alone as well. 
- How to generate rails app with webpack flag for react

## Releases

### Release 0:
This workshop isn't about creating a rails app so we've already set up the back end for you. However, Rails 5.1 has some big improvements to the way it handles javascript which are worth noting

Rails 5.1 comes preloaded with the webpacker gem. When we create a project we can add a `webpack` flag and provide an argument for the JS library we want for our front end. Currently React, Angular, Vue, and Elm are supported. So creating this project with React ready to go was as easy as `rails new sd-react-with-rails-workshop -T --database=postgresql --webpack=react`

Now when we view our project we have an `app/javascript/packs` directory. Everything in this packs directory will be compiled by webpack separately from the asset pipeline. This is where we'll put our React code. 

This workshop isn't about creating a rails app so the back end is already set up. We have a Comment model with RESTful routes to return allcomments, create a comment, and delete a comment. 

One note is that along with booting up the rails app with the `rails server` we will have to run `./bin/webpack-dev-server` in a separate terminal window so Webpack will compile our Javascript.

### Release 1: Adding The Comment Section
Ok let's get started! The first step will be taking the comment section we created in the last workshop and adding it to the rails app. In the `/javascript` directory let's add a new directory called `comments`. Inside the comments directory we can copy in the contents of our `/components` directory from the Intro To React project. 

This will give us a directory `/javascript/comments` that contains the files 
- CommentsContainer.js
- Comments.js
- Comment.js
- Form.js

We just need to make a couple of tweaks and this will work in our Rails project just like it did in our Create React App project. That's the beauty of componentization!

In the `/packs` directory let's create a file called `comments.js` and in that file require the comments folder we just created.
``` JavaScript
require('comments')
```
When we include a folder in the packs directory, it will look for a file called `index` in that folder to render. Let's create an `index.js`. This file's only responsibility will be to render the `CommentsContainer` component so let's do that!

``` JavaScript
import React, { Component } from 'react';
import CommentsContainer from './CommentsContainer'

class CommentIndex extends Component {
  render() {
    <CommentsContainer />
  }
}

class CommentIndex extends Component {
  render() {
    return (
      <CommentsContainer />  
    )
  }
}
```

One more thing we need to add in our `index.js`. This component will need to render itself onto the page. 

We can start by importing 'ReactDOM' in our imports at the top of the file.
``` JavaScript
import ReactDOM from 'react-dom'
```
and then adding this bit of code to the bottom of the file
``` JavaScript
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CommentsContainer name="CommentsContainer" />,
    document.body.appendChild(document.createElement('div')),
  )
})
```
This is just creating a div on the page and rendering our CommentIndex component inside it.

Now that our comment section is getting compiled by webpack we just need to include it in a view. We do this using a `pack` tag. In our `/views/comments/index.html.erb` let's add the pack tag `<%= javascript_pack_tag 'comment' %>`. And that's it! If we run the rails server and the webpack dev server we can visit `localhost:3000/comments` and our comment section should work just like it did in our Intro To React project. 

Let's double check and then move on to the next section. As a reminder we'll need to run the rails server in one terminal window `rails server` and the webpack dev server in another `./bin/webpack-dev-server`

### Release 2: Loading Data From The Server
Right now we're just loading comments from an array which doesn't seem particularly useful for anything more than an example. Let's get some data from the database!

In the constructor function for our CommentsContainer component we're loading the comments on line 12 with 
``` JavaScript
comments: commentList() 
```
We need to start by setting the initial comments to an empty array. 
``` JavaScript
comments: []
```
This is because on load the call to the database will not have returned yet with our comments and the Comments component is expecting an array to map over.

To make the database call we'll be using the [`Fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) web API. This is native implementation but only has modern broswer support so if you are using it in a production app you will need to use a polyfill.

We'll start by adding an `client` folder in the `javascript` directory with a `CommentClient.js` file inside. The client will be responsible for interacting with the database rather than the component itself.

In the CommentClient add a function to fetch comments from the index. Since we're using RESTful routing conventions this will just be `GET /comments`

This is reallly easy with the Fetch API. It does GET requests by default and we just need to pass it the url we want. 
``` JavaScript
export function getComments() {
  return (
    fetch('/comments.json')
  )
};
```
This will hit the endpoint `/comments.json` and return a promise that we need to handle.

Because we're getting a JSON response we need to call `.json()` on the response. This will return a promise with a parsed response object that we can use to set the state.

``` JavaScript
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
```
Now we can use the React lifecycle to send a request the first time the component loads. Let's import the `getComments` function we created in the CommentClient.

``` JavaScript
import { getComments } from '../client/CommentClient'
```
And then call it when the component loads. We need to bind the context of the component to the getComments function so we can set the state correctly inside.

``` JavaScript
componentDidMount() {
  getComments.bind(this)();
}
```

Now we're loading comments from the database!
### Release 3: Sending Data To The Server
We're now getting our comments from the database, but if we create a new comment it doesn't persist. Let's fix that!

We need to add a createComment function to our CommentClient. We can use fetch again but we need to add a couple of things. Fetch can take an options hash as a second argument and we'll add everything there.

We'll need to pass in four options
- the HTTP method 
- the body 
- headers (the CSRF token, the data type we're sending and accepting)
- credentials

The HTTP method is easy, it's going to be a post. We'll get the data for the body from the form and pass it in as an argument. 

For the headers we'll accept 'application/json' and let the server know we're sending 'application/json'. Since we're using a Rails view the CSRF token won't be difficult to get, we can just grab it from the document head.
``` JavaScript
let token = document.head.querySelector("[name=csrf-token]").content;
```
And the we just need to let it know that our request is 'same-origin'.

So our POST request will look like this:
``` JavaScript
fetch('/comments', {
  method: 'post',
  body: newComment,
  headers: {
    'X-CSRF-Token': token,
    'accept': "application/json",
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin'
})
```

Again we'll need to parse the JSON and set the state with the response data (we also want to handle hiding the form when we set the state here). The whole function in our CommentClient will look like this

``` JavaScript
export function createComment(newComment) {
  let token = document.head.querySelector("[name=csrf-token]").content;

  fetch('/comments', {
    method: 'post',
    body: {comment: newComment},
    headers: {
      'X-CSRF-Token': token,
      'accept': "application/json",
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

```
In our CommentsContainer component we need to import this function as well
``` JavaScript
import { getComments, createComment } from '../client/CommentClient'
```
And then use it in our handleFormSubmit function. Remember we need to bind the context of our CommentsContainer component to the form so we can correctly set the state!

``` JavaScript
handleFormSubmit(event) {
  event.preventDefault();
  let newComment = getFormValues(event.target)
  if(newComment.body){
    createComment.bind(this)(newComment)
  }
}
```
#### Release 4: Deleting A Comment
Everything is set except the ability to delete a comment. This is going to require some additional code because it's not functionality our other app had. Let's put it all together!

Let's start by adding a delete button to the comment. This is simply going to be an anchor tag in the JSX of the comment component. We can add it as the first thing inside our Comment div that wraps the component. We'll need to set the id attribute equal to the comment's id so we can grab it from the event.
```JavaScript
<a href="#" id={comment.id} className="delete-btn">x</a>
```
We need to add another request to our CommentClient. This time we need the id of the comment we're deleting. We can just grab it off the event. 
``` JavaScript
let id = event.target.getAttribute('id')
```
We'll use this in the url, and with ES6 template strings we don't even need to add the strings together! We don't need to add a body because the params will come from the url.  Our delete request will look like this
``` JavaScript
export function deleteComment(event) {
  event.preventDefault();
  let token = document.head.querySelector("[name=csrf-token]").content;
  let id = event.target.getAttribute('id')

  fetch(`comments/${id}.json`, {
    method: 'delete',
    headers: {
      'X-CSRF-Token': token,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
}
```
We still need to handle the Promise this returns. Because we need to do some processing we'll create a function that we can call inside `then`.

``` JavaScript
handleCommentDeleteResponse(response){
  response.json().then((data)=>{
    let list = this.state.commentList
    list = list.filter((comment) => {return comment.id !=  data.id})
    this.setState({comments: list})
  })
}
```
And we'll call it at the end of our fetch
``` JavaScript
fetch(`comments/${id}.json`, {
  method: 'delete',
  headers: {
    'X-CSRF-Token': token,
    'accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin'
}).then((response) => {
  handleCommentDeleteResponse(response)
})
```
Now everything is wired up for our request but we don't have a function that Let's add it to the CommentsContainer component.

We'll start by importing our `commentDelete` function in out imports at the top of the file. 
``` JavaScript
import { getComments, createComment, deleteComment } from '../client/CommentClient'
```
Now that we have access to our `deleteComment` function we can pass it straight through to our child components. Don't forget to bind the context! In CommentsContainer passed through to Comments:
```JavaScript
<Comments comments={this.state.comments} deleteComment={deleteComment.bind(this)} />
```
In Comments passed through to Comment:
```JavaScript
<Comment key={index} comment={comment} deleteComment={this.props.deleteComment}/>
```
And finally we'll grab it in Comment using destructuring and bind it to the click of our anchor tag.
```JavaScript
const Comment  = ({comment, deleteComment}) => (
  <div className="Comment">
    <a href="#" id={comment.id} className="delete-btn" onClick={deleteComment}>x</a>
...
```
And that's it! We can now create and delete comments from a database!

Next time we'll be refactoring this comment app to manage it's state using Redux. Hope to see you there!
