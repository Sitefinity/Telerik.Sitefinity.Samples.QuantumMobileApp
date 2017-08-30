var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var utils = require("utils/utils");


var frames = require("ui/frame");
var http = require("http");

function createViewModel() {
    var viewModel = new Observable();

    viewModel.getPaidWhitePapers = function () {
        var url = ServiceEndPoint + WhitePapersServicePath;

        http.request({ url: url, method: "GET", headers: { Authorization: TOKEN.token_type + ' ' + TOKEN.access_token } }).then(function (response) {
            //http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator
            //E.g. http://10.0.3.2:89/api/mycustomservice/newsitems?$select=Id,Title,PublicationDate

            var items = response.content.toJSON().value;

            sortByPersona(items);
            convertCategoriesToStrings(items);

            // Converting category to string. TODO: Replace with working pipe/filter

            var whitePapersDataSource = new observableArrayModule.ObservableArray(items);

            viewModel.set("whitePapersDataSource", whitePapersDataSource);

        }, function (e) {
            alert("Please review your endpoint. Error message: " + e);
            console.log(e);
        });
    };

    viewModel.listViewItemTap = function (args) {
        var index = args.index;

        var whitePaperPath = viewModel.get("whitePapersDataSource").getItem(index).Url;

        utils.openUrl(whitePaperPath);
    };

    viewModel.set("whitePapersDataSource", []);

    viewModel.getPaidWhitePapers();

    return viewModel;
}

var sortByPersona = function (items) {
    if (isInManagerPersona) {
        items.sort(function (a, b) {
            if (a.Category) {
                return a.Category[0] === DevelopmentCategoryId ? -1 : 1;
            }
            return 1;
        });
    }
};

exports.createViewModel = createViewModel;