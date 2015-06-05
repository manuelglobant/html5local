/* global PouchDB, console */
(function () {
  'use strict';
  var db, rdb, _id, posts;
  var text = document.getElementById('post-form-text'),
    postUl = document.getElementById('post-list');
  db = new PouchDB('poster');
  rdb = new PouchDB('http://localhost:5984/poster');

  // ui

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
    db.put(newPost);
    getPosts();
    db.replicate.to(rdb);
  }

  function getPosts () {
    db.allDocs({
      include_docs: true, 
      attachments: true
    }).then(function (result) {
      _id = result.rows.length;
      posts = result;
    });
  }

  getPosts();
}());

