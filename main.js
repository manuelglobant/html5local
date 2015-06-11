var view = {
  input: undefined,
  postsUl: {
    element: undefined,
    lis: []
  }
};

view.input = document.getElementById('post-form-text');
view.postsUl.element = document.getElementById('post-list');

var dbremote = new PouchDB('http://localhost:5984/posts');
var dblocal = new PouchDB('posts');

function check () {
  Offline.check();
}

function online () {
  return Offline.state === 'on';
}

function syncApp () {
  PouchDB
    .sync(dblocal, dbremote)
    .on('complete', getPosts);
}

function savePost (post) {
  var newPost = {
    '_id': new Date().toISOString(),
    'name': post.toString()
  };

  dblocal.put(newPost);
}

function getPosts (callback) {
  dblocal
    .allDocs({
      include_docs: true
    })
    .then(function (result) {
      renderPosts(result);
      if (online()) syncApp();
    }); 
}

function renderPosts (posts) {
  view.postsUl.lis = [];
  posts.rows.map(function (row) {
    view.postsUl.lis.push('<li>'+ row.doc.name + '</li>');
  });
  view.postsUl.element.innerHTML = view.postsUl.lis.join('');
}

view.input.onkeypress = function (e) {
  if (e.keyCode === 13) {
    db.savePost(this.value);
    this.value = '';
  }
};

Offline.options = {
  checks: {xhr: {url: '/connection-test'}}
};

Offline.on('up', syncApp);

setInterval(check, 1000);

syncApp();
