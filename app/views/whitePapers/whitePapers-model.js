var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var utils = require("utils/utils");


var frames = require("ui/frame");
var http = require("http");

function createViewModel() {
    var viewModel = new Observable();

    viewModel.getPaidWhitePapers = function () {
        var url = ServiceEndPoint + WhitePapersServicePath;

        http.request({ url: url, method: "GET", headers: { Authorization: TOKEN } }).then(function (response) {
            //http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator
            //E.g. http://10.0.3.2:89/api/mycustomservice/newsitems?$select=Id,Title,PublicationDate

            var items = response.content.toJSON().value;

            var array = [];
            for (var i = 0; i < items.length; i++) {
                array.push(new Observable(items[i]));
            }

            var whitePapersDataSource = new observableArrayModule.ObservableArray(array);

            viewModel.set("whitePapersDataSource", whitePapersDataSource);

        }, function (e) {
            alert("Please review your endpoint. Error message: " + e);
            console.log(e);
        });
    };

    viewModel.listViewItemTap = function (args) {
        var index = args.index;

        var whitePaperPath = viewModel.get("whitePapersDataSource").getItem(index).Url;

        utils.openUrl(ServiceEndPointWS + whitePaperPath);
    };

    viewModel.set("whitePapersDataSource", []);

    viewModel.getPaidWhitePapers();

    return viewModel;
}

exports.createViewModel = createViewModel;