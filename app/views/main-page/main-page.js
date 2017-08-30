var createViewModel = require("./main-page-model").createViewModel;
var http = require("http");

function onNavigatingTo(args) {
    
    var page = args.object;
    page.bindingContext = extendModelWithNatigation(createViewModel(), page);
}

exports.onNavigatingTo = onNavigatingTo;