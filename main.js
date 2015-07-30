'use strict';
/* global Offline, PouchDB */

Offline.options = {
  checks: {xhr: {url: '/connection-test'}},
};

var app = {};
app.imageDataURL = null;
app.postStatus = document.getElementById('post-status');
app.postForm = document.getElementById('post-form');
app.postTitle = document.getElementById('post-title');
app.postText = document.getElementById('post-text');
app.postImage = document.getElementById('post-image');
app.postImageSave = document.getElementById('post-image-save');
app.postsUl = document.getElementById('post-list');
app.postsSync = document.getElementById('posts-sync');

var dbremote = new PouchDB('http://localhost:5984/posts', {skipSetup: true});
var dblocal = new PouchDB('posts');

setInterval(check, 5000);

function check () {
  Offline.check();
}

function online () {
  return Offline.state === 'up';
}

Offline.on('up', syncApp);

getPosts();

function syncApp () {
  if (online()) {
    dbremote = new PouchDB('http://localhost:5984/posts');
    PouchDB.sync(dblocal, dbremote).on('complete', getPosts);
  } else {
    setTimeout(function () {
      app.postStatus.innerHTML = '';
    }, 2000);
    
    app.postStatus.innerHTML = '<p>Need a connection sync <i class="mdi-action-announcement"></i></p>';
  }
}

function getPosts () {
  dblocal.allDocs({
    include_docs: true
  }).then(function (result) {
    renderPosts(result.rows);
  });
}

function renderPosts (posts) {
  app.postsUl.innerHTML = '';
  posts.map(function (post) {
    if (post.doc.title !== undefined && post.doc.text !== undefined) {
      dblocal.getAttachment(post.doc._rev, 'att.png')
        .then(function (result) {
          var reader = new FileReader();

          reader.onload = function (event) {
            post.doc.att = event.target.result;
            app.postsUl.innerHTML += card(post.doc);
          };

          reader.readAsDataURL(result);
        }).catch(function (err) {
          console.log('a', err);
        });
    }
  });
}

function submitForm (e) {
  e.preventDefault();

  var post = {
    title: app.postTitle.value,
    text: app.postText.value
  };
  
  if (post.title !== undefined && post.text !== undefined && app.imageDataURL) {
    storePost(post);
  } else {
    setTimeout(function () {
      app.postStatus.innerHTML = '';
    }, 2000);
  
    app.postStatus.innerHTML = '<p>Please complete the post <i class="mdi-action-announcement"></i></p>';
  }
}

function storePost (post) {
  savePost(post).then(function (info) {
    dblocal.putAttachment(info.rev, 'att.png', app.imageDataURL, 'image/png')
      .then(function () {
        renderPost(post);
        app.postTitle.value = '';
        app.postText.value = '';
      }).catch(function () {
        app.postImageStatus.innerHTML = 'Please upload an image';
      });
  });
}

function savePost (post) {
  var newPost = {
    _id: new Date().toISOString(),
    title: post.title.toString(),
    text: post.text.toString(),
  };
  return dblocal.put(newPost);
}

function renderPost (post) {
  var reader = new FileReader();

  reader.onload = function (event) {
    post.att = event.target.result;
    app.postsUl.innerHTML += card(post);
  };

  if (app.imageDataURL) {
    reader.readAsDataURL(app.imageDataURL);
  }

  resetForm();
}

function resetForm () {
  app.imageDataURL = null;
  app.postImage.innerHTML = '';
}

document.body.onpaste = function (event) {
  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  var blob = items[0].getAsFile();
  
  app.imageDataURL = blob;

  var reader = new FileReader();
  reader.onload = function (event) {
    app.postImage.innerHTML = '<img class="post-image" src="'+ event.target.result +'"/>';
  };
  reader.readAsDataURL(blob);
};

function card (post) {
  return '<div class="card col s3">' +
    '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="'+ post.att +'">' +
    '</div>' +
     '<div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">'+ post.title + 
      '<i class="mdi-navigation-more-vert right"></i></span>' +
    '</div>' +
    '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">'+ post.title +' <i class="mdi-navigation-close right"></i></span>' +
      '<p>'+ post.text +' </p>' +
    '</div>' +
  '</div>';
}




  
