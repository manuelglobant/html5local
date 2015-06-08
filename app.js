(function () {
  /* global indexedDB, console*/
  'use strict';
  var db, text, postsUl;

  text = document.getElementById('post-form-text');
  postsUl = document.getElementById('post-list');

  // ui

  text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value);
    }
  };

  function renderPosts (posts) {
    var postList = [];
    posts.map(function (post) {
      postList.push('<li>' + post + '</li>');
    });
    postsUl.innerHTML = postList.join('');
  }

  // db

  openDB();

  function openDB (callback) {
    var v = 1;
    var req = indexedDB.open('poster', v);

    req.onupgradeneeded = function(e) {
      db = e.target.result;
      db.createObjectStore('posts', { autoIncrement: true });
      callback();
    };

    req.onsuccess = function (e) {
      db = e.target.result;
      getPosts();
      callback();
    };

    req.onerror = function (e) {
      console.log(e.target.error.message);
    };
  }

  function savePost (post, callback) {
    var transaction = db.transaction(['posts'], 'readwrite');  
    var postStore = transaction.objectStore('posts');
    var req = postStore.add(post);

    req.onsuccess = function () {
      callback();
      getPosts();
    };
  }

  function getPosts () {
    var transaction = db.transaction(['posts'], 'readwrite');  
    var postStore = transaction.objectStore('posts');
    var postCursor = postStore.openCursor();
    var posts = [];

    postCursor.onsuccess = function (e) {
      var cursor = e.target.result;

      if (cursor) {
        posts.push(cursor.value);
        cursor.continue();
      } else {
        renderPosts(posts);
      }
    };
  }
}());