/* global PouchDB*/
(function () {
  'use strict';
  var dblocal, remotedb, text, postsUl;

  text = document.getElementById('post-form-text');
  postsUl = document.getElementById('post-list');
  dblocal = new PouchDB('posts');
  remotedb = new PouchDB('http://localhost:5984/posts');

  text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value);
      this.value = '';
    }
  };

  function savePost (post) {
    var newPost = {
      '_id': new Date().toISOString(),
      'name': post.toString()
    };
    dblocal.put(newPost);
    dblocal.replicate.to(remotedb);
  }
}());

