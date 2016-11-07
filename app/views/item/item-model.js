var Observable = require("data/observable").Observable;

var frames = require("ui/frame");
var http = require("http");

function createViewModel() {
    var viewModel = new Observable();

    viewModel.set("isEngLang", isEngLang);

    viewModel.getItem = function () {
        var url = viewModel.resolveServiceURL();

        http.request({ url: url, method: "GET" }).then(function (response) {
            //http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator
            //E.g. http://10.0.3.2:89/api/mycustomservice/newsitems?$select=Id,Title,PublicationDate

            var item = response.content.toJSON();

            viewModel.set("title", item.Title);
            viewModel.set("publicationDate", item.PublicationDate);
            viewModel.set("content", item.Content);
            viewModel.set("author", item.Author);

            if (item.RelatedMedia) {
                viewModel.set("relatedMedia", item.RelatedMedia);
            }
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
        viewModel.getItem();
    };

    viewModel.resolveServiceURL = function () {
        var result = ServiceEndPoint;

        result += viewModel.servicePath;
        result = formatString(result, [viewModel.id, LANG]);

        return result;
    }

    return viewModel;
}

exports.createViewModel = createViewModel;