var view = {
  postText: undefined,
  postTitle: undefined,
  postImage: undefined,
  postImageSave: undefined,
  postsUl: undefined
};
var imageDataURL;


view.postForm = document.getElementById('post-form');
view.postTitle = document.getElementById('post-title');
view.postText = document.getElementById('post-text');
view.postImage = document.getElementById('post-image');
view.postImageSave = document.getElementById('post-image-save');
view.postsUl = document.getElementById('post-list');

Offline.options = {
  checkOnLoad: true,
  checks: {xhr: {url: '/connection-test'}},
  reconnect: {
    initialDelay: 0,
    delay: 3
  }
};

setInterval(check, 1000);

Offline.on('up', syncApp);

function check () {
  Offline.check();
}

function online () {
  return Offline.state === 'up';
}

var dbremote = new PouchDB('http://localhost:5984/posts');
var dblocal = new PouchDB('posts');

getPosts();

function syncApp () {
  if (online()) {
    dbremote = new PouchDB('http://localhost:5984/posts');
    PouchDB.sync(dblocal, dbremote).on('complete', getPosts);
  } else {
    alert("Need a connection to sync.");
  }
}

function formSubmit (e) {
  e.preventDefault();
  var post = {
    title: view.postTitle.value,
    text: view.postText.value
  };
  savePost(post).then(function (info) {
    var attachment = imageDataURL;
    dblocal.putAttachment(info.rev, 'att.png', attachment, 'image/png');
    renderPost(post);
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

function getPosts () {
  dblocal.allDocs({
    include_docs: true
  }).then(function (result) {
    renderPosts(result.rows);
  }); 
}

function renderPosts (posts) {
  view.postsUl.innerHTML = '';
  posts.map(function (post) {
    dblocal.getAttachment(post.doc._rev, 'att.png')
      .then(function (result) {
        var reader = new FileReader();
        reader.onload = function (event) {
          post.doc.att = event.target.result;
          view.postsUl.innerHTML += card(post.doc);
        };
        reader.readAsDataURL(result);
      });
  });
}

function renderPost (post) {
  var reader = new FileReader();
  reader.onload = function (event) {
    post.att = event.target.result;
    view.postsUl.innerHTML += card(post);
  };
  reader.readAsDataURL(imageDataURL);
}

document.body.onpaste = function (event) {
  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  var blob = items[0].getAsFile();
  imageDataURL = blob;

  var reader = new FileReader();
  reader.onload = function (event) {
    view.postImage.src = event.target.result;
  };
  reader.readAsDataURL(blob);
}

function card (post) {
  return '<div class="card col s3">' +
    '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="'+ post.att +'">' +
    '</div>' +
     '<div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">'+ post.title + 
      '<i class="mdi-navigation-more-vert right"></i></span>' +
      '<p><a href="#">'+ post.text +' </a></p>' +
    '</div>' +
    '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">'+ post.title +' <i class="mdi-navigation-close right"></i></span>' +
      '<p>'+ post.text +' </p>' +
    '</div>' +
  '</div>';
}




  
