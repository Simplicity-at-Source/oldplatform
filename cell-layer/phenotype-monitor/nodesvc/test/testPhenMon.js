var assert = require('assert');
var request = require("superagent");
require('../app.js'); //Boot up the server for tests
//var host = config.host + ':' + config.port;
var host = 'http://localhost:8080';

/*

 Gene Store Data:
 {"cell":{"sentanal":{"id":"sentanal","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentanal.git"}}}}

 {"cell":{"sentanal":{"id":"sentanal","image":"sp_platform/uber-any","env":{"GIT_REPO_URL":"https://github.com/fuzzy-logic/sentanal.git"}}}}

 */

var postData = {
    "id": "sentanal",
    "image": "sp_platform/uber-any",
    "env": {
        "GIT_REPO_URL": "https://github.com/fuzzy-logic/sentanal.git"
    }
};

describe('phen mon accepts and returns data: ', function () {

    it('/ accepts data', function (done) {
        var req = request.post(host + '/');
        req.send(postData);
        req.end(function (res) {
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(200, res.status);
            done();
        });
    });

    it('/ returns data', function (done) {
        var req = request.get(host + '/');
        req.end(function (res) {
            console.log("/ res: " + res.text);
            var json = JSON.parse(res.text);
            assert.equal(json.id, postData.id);
            assert.equal(200, res.status);
            done();
        });
    });
});
