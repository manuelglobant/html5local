(function () {
  'use strict';
  /*global indexedDB*/

  var db;
  var status = document.getElementById('status');
  var text = document.getElementById('post-form-text');
  var postUl = document.getElementById('post-list');

  // ui

  text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value, logPost);
    }
  };

  function renderPosts (posts) {
    var postList = [];
    posts.map(function (post) {
      postList.push('<li>' + post + '</li>');
    });
    postUl.innerHTML = postList.join('');
  } 

  // utils

  var logPost = function () {
    status.innerHTML = 'Saved post ' + getDate();
    text.value = '';
  };

  function getDate () {
    var now = new Date();
    return now.getDay() + '/' + now.getMonth() + '/' + now.getFullYear() +
    ' ' + now.getHours() + ':' + now.getMinutes();
  }

  // db

  openDB(function () {
    status.innerHTML = 'Opened poster database.';
  });

  function openDB (callback) {
    var v = 1;
    var req = indexedDB.open('poster', v);

    req.onupgradeneeded = function(e) {
      db = e.target.result;
      e.target.transaction.onerror = errorDB;
      db.createObjectStore('posts', { autoIncrement: true });
      callback();
    };

    req.onsuccess = function (e) {
      db = e.target.result;
      callback();
      getPosts();
    };

    req.onerror = errorDB;
  }

  function errorDB (e) {
    status.innerHTML = 'An error has ocurred: ' + e.target.error.message;
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

