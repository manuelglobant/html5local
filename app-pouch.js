/* global PouchDB, console*/
(function () {
  'use strict';
  var dblocal, dbremote;
  dblocal = new PouchDB('posts');
  dbremote = new PouchDB('http://localhost:5984/posts');

  var ui = {
    text: undefined,
    postsUl: {
      element: undefined,
      docs: [],
      lis: []
    }
  };

  ui.text = document.getElementById('post-form-text');
  ui.postsUl.element = document.getElementById('post-list');
  

  ui.text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value);
      this.value = '';
    }
  };

  function renderPosts () {
    ui.postsUl.lis = [];
    ui.postsUl.docs.map(function(doc) {
      ui.postsUl.lis.push('<li>'+ doc.name + '</li>');
    });
    ui.postsUl.element.innerHTML = ui.postsUl.lis.join('');
  }

  function savePost (post) {
    var newPost = {
      '_id': new Date().toISOString(),
      'name': post.toString()
    };
    dblocal.put(newPost);
    PouchDB.sync(dblocal, dbremote);
    getPosts();
  }

  function getPosts () {
    dblocal.allDocs({
        include_docs: true
      })
      .then(function (result) {
        console.log(result);
        ui.postsUl.docs = [];
        result.rows.map(function(row) {
          ui.postsUl.docs.push(row.doc);
        });
        renderPosts();
        console.log(ui.postsUl.docs);
      }).catch(function (err) {
        console.log(err);
      });
  }

  getPosts(); 
}());

