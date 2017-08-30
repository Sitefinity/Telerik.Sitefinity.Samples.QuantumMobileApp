var createViewModel = require("./itemsList-model").createViewModel;
var newsPageGuid = 'a9f956ee-e983-49b9-9235-d153200f9167';
var blogsPageGuid = '8bca7b1e-9f39-470a-b686-141f0d0baa22';


function onNavigatingTo(args) {
    var page = args.object;

    var navContext = page.navigationContext;

    page.bindingContext = extendModelWithNatigation(createViewModel(), page);

    if (navContext.items == NEWS) {
        page.bindingContext.servicePath = NewsItemsServicePath;
        page.bindingContext.pageGuid = newsPageGuid;
    } else {
        page.bindingContext.servicePath = BlogsServicePath;
        page.bindingContext.pageGuid = blogsPageGuid;
    }

    page.bindingContext.itemsType = navContext.items;

    page.bindingContext.category = navContext.category;

    page.bindingContext.set("itemsTitle", navContext.category + " " + navContext.items);

    page.bindingContext.getAllItems();

    if (CurrentUser.Id && Client) {
        var canonicalUrl = 'views/itemsList/' + page.bindingContext.itemsType;
        var prSentence = generatePersonalizationReportSentence(CurrentUser.Id, page.bindingContext.pageGuid, page.bindingContext.itemsTitle, canonicalUrl, global.personalizationReportSegment);
        Client.writeSentence(prSentence);
        Client.flushData();
    }
}

exports.onNavigatingTo = onNavigatingTo;