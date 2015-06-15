var dbremote = new PouchDB('http://localhost:5984/posts');
var dblocal = new PouchDB('posts');

var view = {
  postText: undefined,
  postsUl: {
    element: undefined,
    lis: []
  }
};

view.postForm = document.getElementById('post-form');
view.postTitle = document.getElementById('post-title');
view.postText = document.getElementById('post-text');
view.postsUl.element = document.getElementById('post-list');

Offline.options = {
  checks: {xhr: {url: '/connection-test'}}
};

Offline.on('up', syncApp);

// setInterval(check, 1000);

function online () {
  return Offline.state === 'on';
}

function check () {
  Offline.check();
  syncApp();
}

function syncApp () {
  PouchDB
    .sync(dblocal, dbremote)
    .on('complete', getPosts);
}

syncApp();

function savePost (post) {
  var newPost = {
    _id: new Date().toISOString(),
    title: post.title.toString(),
    text: post.text.toString(),
  };

  return dblocal.put(newPost);
}

function getPosts () {
  dblocal
    .allDocs({
      include_docs: true
    })
    .then(function (result) {
      renderPosts(result);      
    }); 
}

function formSubmit (e) {
  e.preventDefault();

  var post = {
    title: view.postTitle.value,
    text: view.postText.value
  };
  
  savePost(post).then(function() {
    view.postText.value = view.postTitle.value = '';
    getPosts();
  });
}

function renderPosts (posts) {
  view.postsUl.lis = [];
  posts.rows.map(function (row) {
    view.postsUl.lis.push(card(row.doc));
  });

  view.postsUl.element.innerHTML = view.postsUl.lis.join('');
}

function card (post) {
  return '<div class="card col s3">' +
    '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="img/screen.png">' +
    '</div>' +
     '<div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">'+ post.title +' <i class="mdi-navigation-more-vert right"></i></span>' +
      '<p><a href="#">'+ post.text +' </a></p>' +
    '</div>' +
    '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">'+ post.title +' <i class="mdi-navigation-close right"></i></span>' +
      '<p>'+ post.text +' </p>' +
    '</div>' +
  '</div>';
}
  
