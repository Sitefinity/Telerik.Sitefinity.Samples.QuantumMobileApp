var createViewModel = require("./main-view-model").createViewModel;
var http = require("http");

function onNavigatingTo(args) {
    
    var page = args.object;
    page.bindingContext = extendModelWithNatigation(createViewModel(), page);
}

function onLoaded() {
    //http://bivanova:4774/api/quantum-mobile/hierarchy-taxa

    var url = ServiceEndPoint + HierarchyTaxaPath;

    http.request({ url: url, method: "GET" }).then(function (response) {
        //http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator
        //E.g. http://10.0.3.2:89/api/mycustomservice/newsitems?$select=Id,Title,PublicationDate

        var items = response.content.toJSON().value;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            switch (item.Title) {
                case "Design":
                    DesignCategoryId = item.Id;
                    break;
                case "Marketing":
                    MarketingCategoryId = item.Id;
                    break;
                case "Development":
                    DevelopmentCategoryId = item.Id;
                    break;
            }
        }

    }, function (e) {
        alert("Please review your endpoint. Error message: " + e);
        console.log(e);
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onLoaded = onLoaded;