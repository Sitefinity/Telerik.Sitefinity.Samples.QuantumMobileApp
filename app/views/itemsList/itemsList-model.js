var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");

var frames = require("ui/frame");
var http = require("http");

function createViewModel() {
    var viewModel = new Observable();
    viewModel.set("isEngLang", isEngLang);

    viewModel.getAllItems = function () {
        var url = viewModel.resolveServiceURL();

        http.request({ url: url, method: "GET" }).then(function (response) {
            //http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator
            //E.g. http://10.0.3.2:89/api/mycustomservice/newsitems?$select=Id,Title,PublicationDate

            var items = response.content.toJSON().value;

            var array = [];
            for (var i = 0; i < items.length; i++) {
                array.push(new Observable(items[i]));
            }

            var newsDataSource = new observableArrayModule.ObservableArray(array);

            viewModel.set("newsDataSource", newsDataSource);
        }, function (e) {
            alert("Please review your endpoint. Error message: " + e);
            console.log(e);
        });
    };

    viewModel.refreshInES = function () {
        if(isEngLang) {
            viewModel.refreshUI("ES");
        }
    };

    viewModel.refreshInEN = function () {
        if(!isEngLang) {
            viewModel.refreshUI("EN");
        }
    };

    viewModel.refreshUI = function (lang) {
        isEngLang = !isEngLang;
        viewModel.set("isEngLang", isEngLang);

        LANG = lang;
        viewModel.getAllItems();
    };

    viewModel.resolveServiceURL = function () {
        var result = ServiceEndPoint;

        result += viewModel.servicePath;

        switch (viewModel.category) {
            case "All":
                result += "?";
                break;
            case "Design":
                result += "?$filter=Category/any(t:t%20eq%20" + DesignCategoryId + ")";
                break;
            case "Marketing":
                result += "?$filter=Category/any(t:t%20eq%20" + MarketingCategoryId + ")";
                break;
            case "Development":
                result += "?$filter=Category/any(t:t%20eq%20" + DevelopmentCategoryId + ")";
                break;
        }

        result += "&sf_culture=" + LANG;

        return result;
    };

    viewModel.listViewItemTap = function (args) {
        var index = args.index;

        var id = viewModel.get("newsDataSource").getItem(index).Id;

        var navigationEntry = {
            moduleName: "views/item/item",
            context: { items: viewModel.itemsType, id: id },
            animated: false
        };

        frames.topmost().navigate(navigationEntry);
    };

    viewModel.set("newsDataSource", []);

    return viewModel;
}

exports.createViewModel = createViewModel;