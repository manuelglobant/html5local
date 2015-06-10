/* global PouchDB, console, Offline*/
(function () {
  'use strict';
  
  Offline.options = {
    checks: {xhr: {url: '/connection-test'}}
  };

  setInterval(function () {
    Offline.check();
  }, 1000);

  var dblocal, dbremote;

  dblocal = new PouchDB('posts');
  dbremote = new PouchDB('http://localhost:5984/posts');

  function syncApp () {
    PouchDB.sync(dblocal, dbremote).on('complete', getPosts);
  }

  syncApp();

  Offline.on('up', syncApp);

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
    if (e.keyCode === 13) {
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
    
    if (Offline.state === 'up') {
      PouchDB.sync(dblocal, dbremote);
    }
    
    getPosts();
  }

  function getPosts () {
    dblocal
      .allDocs({
        include_docs: true
      })
      .then(function (result) {
        ui.postsUl.docs = [];
        result.rows.map(function(row) {
          ui.postsUl.docs.push(row.doc);
        });
        renderPosts();
      }).catch(function (err) {
        console.log(err);
      });
  }
}());

