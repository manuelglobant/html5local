/* global PouchDB*/
(function () {
  'use strict';
  var dblocal, remotedb, _id, posts, text, postsUl;

  text = document.getElementById('post-form-text');
  postsUl = document.getElementById('post-list');
  dblocal = new PouchDB('poster');
  remotedb = new PouchDB('http://localhost:5984/poster');

  text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value);
    }
  };

  function savePost (post) {
    var newPost = {
      '_id': _id.toString(),
      'name': post.toString()
    };
    dblocal.put(newPost);
    getPosts();
    dblocal.replicate.to(remotedb);
  }

  function getPosts () {
    dblocal.allDocs({
      include_docs: true
    }).then(function (result) {
      _id = result.rows.length;
      posts = result;
    });
  }

  getPosts();
}());

