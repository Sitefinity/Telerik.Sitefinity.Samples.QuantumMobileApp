var createViewModel = require("./itemsList-model").createViewModel;



function onNavigatingTo(args) {
    var page = args.object;

    var navContext = page.navigationContext;

    page.bindingContext = extendModelWithNatigation(createViewModel(), page);

    if (navContext.items == NEWS) {
        page.bindingContext.servicePath = NewsItemsServicePath;
    } else {
        page.bindingContext.servicePath = BlogsServicePath;
    }

    page.bindingContext.itemsType = navContext.items;

    page.bindingContext.category = navContext.category;

    page.bindingContext.set("itemsTitle", navContext.category + " " + navContext.items);

    page.bindingContext.getAllItems();
}

exports.onNavigatingTo = onNavigatingTo;