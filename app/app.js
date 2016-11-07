var application = require("application");
var Observable = require("data/observable").Observable;

var frames = require("ui/frame");
var view = require("ui/core/view");

var All = "All";
var Design = "Design";
var Marketing = "Marketing";
var Dev = "Development";

var mainMenuId = "mainMenuSideDrawer";

var imageCache = require("nativescript-web-image-cache");
if (application.android) {
    application.onLaunch = function (intent) {
	        imageCache.initialize();
    };
}

var utcDotNetDateConverter = function (value, format) {
    var dotNetSubstringIndex = 6;

    var result = new Date(parseInt(value.substr(dotNetSubstringIndex)));

    return result.toUTCString();
};

var utcDateConverter = function (value, format) {
    var result = new Date(value);

    return result.toUTCString();
};

var summarySubstring = function (value, format) {   


    return value.substring(0, 100);
}

global.formatString = function(value, replacements) {
    var formatted = value;
    for (var i = 0; i < replacements.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, replacements[i]);
    }

    return formatted;
};

global.extendModelWithNatigation = function (viewModel, page) {
    viewModel.currentPage = page;

    viewModel.navigateToAllNews = function () {
        viewModel.navigateToNews(All);
    };

    viewModel.navigateToDesignNews = function () {
        viewModel.navigateToNews(Design);
    };

    viewModel.navigateToMarketingNews = function () {
        viewModel.navigateToNews(Marketing);
    };

    viewModel.navigateToDevNews = function () {
        viewModel.navigateToNews(Dev);
    };

    viewModel.navigateToNews = function (category) {
        viewModel.navigateToItems(category, NEWS);
    };

    viewModel.navigateToAllBlogPosts = function () {
        viewModel.navigateToBlogPost(All);
    };

    viewModel.navigateToDesignBlogPosts = function () {
        viewModel.navigateToBlogPost(Design);
    };

    viewModel.navigateToMarketingBlogPosts = function () {
        viewModel.navigateToBlogPost(Marketing);
    };

    viewModel.navigateToDevBlogPosts = function () {
        viewModel.navigateToBlogPost(Dev);
    };

    viewModel.navigateToBlogPost = function (category) {
        viewModel.navigateToItems(category, BLOG_POSTS);
    };

    viewModel.navigateToItems = function (category, itemsType) {
        var navigationEntry = {
            moduleName: "views/itemsList/itemsList",
            context: { items: itemsType, category: category },
            animated: false
        };

        frames.topmost().navigate(navigationEntry);
    };

    viewModel.showMenu = function (args) {
        var sideMenu = view.getViewById(viewModel.currentPage, mainMenuId);
        if (sideMenu) {
            sideMenu.showDrawer();
        }
    };

    viewModel.navigateToPaidWhitePapers = function () {
        var navigationEntry = {
            animated: false
        };

        //Uncomment the following to code to persist the TOKEN and avoid login after the first time
        //if (TOKEN == null) {
            navigationEntry.moduleName = "views/login/login";
        //} else {
        //    navigationEntry.moduleName = "views/whitePapers/whitePapers";
        //}

        frames.topmost().navigate(navigationEntry);
    }
    
    viewModel.set("isEngLang", isEngLang);   

    viewModel.set("newsEN", "News");
    viewModel.set("blogsEN", "Blogs");
    viewModel.set("whitePapersEN", "Whitepapers");

    viewModel.set("designEN", "Design");
    viewModel.set("marketingEN", "Marketing");
    viewModel.set("developmentEN", "Development");

    viewModel.set("newsES", "NOTICIAS");
    viewModel.set("blogsES", "Blog");
    viewModel.set("whitePapersES", "Libros Blancos ");

    viewModel.set("designES", "Diseño web");
    viewModel.set("marketingES", "Márketing");
    viewModel.set("developmentES", "Desarrollo"); 


    return viewModel;
}

//This is the localhost endpoint
//global.ServiceEndPoint = "http://10.0.3.2:89/";

global.ServiceEndPoint = "http://10.0.3.2:82/";
global.ServiceEndPointWS = "http://10.0.3.2:82"; //this is the ServiceEndPoint without the slash

global.NewsItemsServicePath = "api/quantum-mobile/newsitems";
global.BlogsServicePath = "api/quantum-mobile/blogposts";
global.LogInServicePath = "api/quantum-mobile/login";
global.WhitePapersServicePath = "api/quantum-mobile/documents";

//http://localhost:89/api/mycustomservice/newsitems(eb57052e-9a43-66a7-8579-ff00003bc1d1)?$select=Title,Content,PublicationDate&sf_culture=es
global.NewsItemServicePath = "api/quantum-mobile/newsitems({0})?$select=Title,Content,PublicationDate,Author,RelatedMedia&sf_culture={1}";
//global.NewsItemServicePath = "api/mycustomservice/blogposts({0})?$select=Title,Content,PublicationDate&sf_culture={1}";
global.BlogServicePath = "api/quantum-mobile/blogposts({0})?$select=Title,Content,PublicationDate&sf_culture={1}";

global.HierarchyTaxaPath = "api/quantum-mobile/hierarchy-taxa";

global.NEWS = "news";
global.BLOG_POSTS = "blogs";
global.LANG = "EN";
global.TOKEN = null;
global.DesignCategoryId = null;
global.MarketingCategoryId = null;
global.DevelopmentCategoryId = null;
global.isEngLang = true;


application.resources["utcDateConverter"] = utcDateConverter;
application.resources["utcDotNetDateConverter"] = utcDotNetDateConverter;

application.resources["summarySubstring"] = summarySubstring;

application.start({ moduleName: "main-page" });