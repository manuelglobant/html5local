/* global PouchDB, console*/
(function () {
  'use strict';

  var dblocal, dbremote;
  dblocal = new PouchDB('posts');
  dbremote = new PouchDB('http://localhost:5984/posts');

  var ui = {
    text: undefined,
    postsUl: undefined
  };
  ui.text = document.getElementById('post-form-text');
  ui.postsUl = document.getElementById('post-list');
  

  ui.text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value);
      this.value = '';
    }
  };

  function renderPosts (posts) {
    var lis = [];
    posts.map(function(post) {
      lis.push('<li>' + post.doc.name + '</li>');
    });
    ui.postsUl.innerHTML = lis.join('');
  }

  function savePost (post) {
    var newPost = {
      '_id': new Date().toISOString(),
      'name': post.toString()
    };
    dblocal.put(newPost);
  }

  function getPosts () {
    dblocal.allDocs({
      include_docs: true, 
      attachments: true
    }).then(function (result) {
      renderPosts(result.rows);
    }).catch(function (err) {
      console.log(err);
    });
  }
  getPosts();
}());

