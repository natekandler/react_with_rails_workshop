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
- CommentSection.js
- Comments.js
- Comment.js
- Form.js

We just need to make a couple of tweaks and this will work in our Rails project just like it did in our Create React App project. That's the beauty of componentization!

In the `/packs` directory let's create a file called `comments.js` and in that file require the comments folder we just created.
``` JavaScript
require('comments')
```
When we include a folder in the packs directory, it will look for a file called `index` in that folder to render. Let's create an `index.js`. This file's only responsibility will be to render the `CommentSection` component so let's do that!

``` JavaScript
import React, { Component } from 'react';
import CommentSection from './CommentSection'

class CommentIndex extends Component {
  render() {
    <CommentSection />
  }
}

class CommentIndex extends Component {
  render() {
    return (
      <CommentSection />  
    )
  }
}
```

One more thing we need to add in our `index.js`. This component will need to render itself onto the page. 

We can start by importing 'ReactDOM' in our imports at the top of the file.
```` JavaScript
import ReactDOM from 'react-dom'
```
and then adding this bit of code to the bottom of the file
``` JavaScript
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CommentSection name="CommentSection" />,
    document.body.appendChild(document.createElement('div')),
  )
})
```
This is just creating a div on the page and rendering our CommentIndex component inside it.

Now that our comment section is getting compiled by webpack we just need to include it in a view. We do this using a `pack` tag. In our `/views/comments/index.html.erb` let's add the pack tag `<%= javascript_pack_tag 'comment' %>`. And that's it! If we run the rails server and the webpack dev server we can visit `localhost:3000/comments` and our comment section should work just like it did in our Intro To React project. 

Let's double check and then move on to the next section. As a reminder we'll need to run the rails server in one terminal window `rails server` and the webpack dev server in another `./bin/webpack-dev-server`

### Release 2: Loading Data From The Server
- make sure to talk about fetch, why it's being used (probably no jquery, can polyfill with precompiled js)

### Release 3: Sending Data To The Server

#### Release 4: Updating View With Response

#### Release 5: Deleting A Comment
Using the things we've learned to add a delete button
