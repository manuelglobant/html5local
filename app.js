/*global indexedDB, appCacheNanny*/
appCacheNanny.start({checkInterval: 1000});
(function () {
  'use strict';
  var db;
  var logs = [];
  var logUl = document.getElementById('log-list');
  var text = document.getElementById('post-form-text');
  var postUl = document.getElementById('post-list');

  // uiwww

  text.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      savePost(this.value, logPostSave);
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

  var logPostSave = function () {
    logs.push('<li>Saved post ' + getDate() + '</li>');
    logUl.innerHTML = logs.join('');
    text.value = '';
  };

  var logDBOpen = function () {
    logs.push('<li>Opened database ' + getDate() + '</li>');
    logUl.innerHTML = logs.join('');
  };

  var logDBError = function (error) {
    logs.push('<li>' + error + ' ' + getDate() + '</li>');
    logUl.innerHTML = logs.join('');
  };

  function getDate () {
    var now = new Date();
    return now.getDay() + '/' + now.getMonth() + '/' + now.getFullYear() +
    ' ' + now.getHours() + ':' + now.getMinutes();
  }

  // db

  openDB(logDBOpen);

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
      logDBError(e.target.error.message);
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

