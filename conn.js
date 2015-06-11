var conn = (function() {

  Offline.options = {
    checks: {xhr: {url: '/connection-test'}}
  };

  function check () {
    Offline.check();
  }

  function on () {
    return Offline.state === 'on';
  }

  setInterval(check, 1000);

  return {
    on: on
  };
  
})();

module.exports = conn;
