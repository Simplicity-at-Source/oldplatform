var _ = require('underscore');

exports.convertApiPath =  function(path) {    
    splitPath = path.split('/');
    var counter = 0;
    newSplitPath = _.filter(splitPath, function(ele){ counter++; return (counter > 3 ) });
    newPath = '';
    _.each(newSplitPath, function(ele) { newPath += '/' + ele} );
    return newPath;
}