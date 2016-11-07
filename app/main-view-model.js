var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");

var frames = require("ui/frame");
var view = require("ui/core/view");

var All = "All";
var Design = "Design";
var Marketing = "Marketing";
var Dev = "Development";

function createViewModel() {
    var viewModel = new Observable();   

    return viewModel;
}

exports.createViewModel = createViewModel;