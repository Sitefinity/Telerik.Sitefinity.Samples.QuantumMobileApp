var createViewModel = require("./item-model").createViewModel;

function onNavigatingTo(args) {
    var page = args.object;

    var navContext = page.navigationContext;

    page.bindingContext = extendModelWithNatigation(createViewModel(), page);

    if (navContext.items == NEWS) {
        page.bindingContext.servicePath = NewsItemServicePath;
    } else {
        page.bindingContext.servicePath = BlogServicePath;
    }

    page.bindingContext.id = navContext.id;

    page.bindingContext.getItem();
}

exports.onNavigatingTo = onNavigatingTo;