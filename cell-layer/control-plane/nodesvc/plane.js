
var muon = require("muon.js")


muon.onEvent({resource:"/cell"}, function(event) {

    //just an example of reading data from nucleus
    muon.nucleus("/pokemon/something", function(pokemons) {

    });

    //probably interact with the docker API

    muon.emit({
        resource:"/pokemon/mycontainerid",
        payload:{
            id:event.id
            //other crap
        }
    });
});




//TODO, docker events
