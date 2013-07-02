function AwCtrl($scope, $routeParams, Data, Repo, $resource) {
    window.Repo = Repo;
    $scope.data = Data;
    $scope.currentFile = false;
    $scope.ace = {};
    $scope.openEditors = {};
    $scope.ace.EditSession = require("ace/edit_session").EditSession;

    $scope.data.repo = $routeParams.repo;
    
    // Initialize
    $scope.init = function() {

      // to retrieve a book
       repo = new Repo();
       repo.get('awestruct.org').then(function(res) {
        $scope.files = res.data;
       });
    };

    $scope.toggleOpen = function(child){
      child.open = !child.open;
      console.log(child.open);
    };

    $scope.addMessage = function(text, type) {
      var message = {text:text, type:type};
      $scope.data.messages.push(message);
    };

    $scope.removeMessage = function(el){
      $scope.data.messages.splice(el.$index,1);
    };

    $scope.edit = function(file) {
      var file = JSON.parse(file),
          path = file.links[0].url,
          session;
      
      // check if new session needs to be created
      if(!!$scope.openEditors[path]) {
        session = $scope.openEditors[path];
        $scope.currentFile = file;
        openSession(session);
      }
      else {
        // goahead and grab the file
        repo.getFile(path).then(function(response){
          $scope.openEditors[path] = session;
          content = response.data.content;
          session = new $scope.ace.EditSession(content);
          openSession(session,file);
        });
      }
    };

    $scope.showTools = function(currentMode) {
      return currentMode && !!currentMode.match(/markdown|asciidoc/gi);
    };

    openSession = function(session,file) {
      var mode = findMode(file.links[0].url);
      $scope.currentFile = file;
      $scope.currentMode = mode;
      $scope.editor.setSession(session);
      $scope.editor.getSession().setMode("ace/mode/"+mode);
      $scope.editor.setTheme("ace/theme/github");
      $scope.editor.setShowPrintMargin(false);
    };

    window.findMode = function(filename) {
      var extension = filename.split('.').pop(),
          mode = "text"; // default

      extensions = {
        'markdown' : /md|markdown$/gi,
        'asciidoc' : /ad|asciidoc|adoc$/gi,
        'image' : /jpe?g|png|gif|webm$/gi,
        'html' : /html?$/gi,
        'less' : /less$/gi,
        'sass' : /sass|scss$/gi,
        'css' : /css$/gi,
        'coffee' : /coffee$/gi,
        'javascript' : /js$/gi,
        'text' : /te?xt$/gi,
        'haml' : /haml$/gi,
        'stylus' : /stylus|slim$/gi,
        'diff' : /diff$/gi,
        'ruby' : /lock|rakefile|gemfile/gi
      };

      _.each(extensions,function(i,name) {
        if(extension.match(extensions[name])) {
          mode = name;
        }
        });
      return mode;
    };




    /* Resources */


}