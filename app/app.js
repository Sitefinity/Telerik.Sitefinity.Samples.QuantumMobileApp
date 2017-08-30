var application = require("application");
var Observable = require("data/observable").Observable;
var DECClient = require("./custom/dec-client");
var frames = require("ui/frame");
var http = require("http");
var view = require("ui/core/view");
var imageCache = require("nativescript-web-image-cache");

// Filters
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
};

global.convertCategoriesToStrings = function (items) {
    items.forEach(function (item) {
        if (item.Category[0]) {
            switch (item.Category[0]) {
                case MarketingCategoryId:
                    item.Category[0] = "Marketing";
                    break;
                case DevelopmentCategoryId:
                    item.Category[0] = "Development";
                    break;
                case DesignCategoryId:
                    item.Category[0] = "Design";
                    break;
                default:
                    item.Category[0] = "";
                    break;
            }
        }
    }, this);
}

// Navigation 
var All = "All";
var Design = "Design";
var Marketing = "Marketing";
var Dev = "Development";
var mainMenuId = "mainMenuSideDrawer";

global.formatString = function (value, replacements) {
    var formatted = value;
    for (var i = 0; i < replacements.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, replacements[i]);
    }

    return formatted;
};

global.generatePersonalizationReportSentence = function (subjectKey, pageGuid, canonicalTitle, canonicalUrl, segment) {
    var objectMetadata = {
        Id: pageGuid,
        PageId: pageGuid,
        Language: 'Eng',
        ContentType: 'Page',
        CanonicalTitle: canonicalTitle,
        CanonicalUrl: canonicalUrl,
        Personalization: [{
            Type: 'Page',
            Segment: segment || 'IT Manager'
        }]
    };

    var sentence = {
        predicate: 'Visit',
        subjectKey: subjectKey,
        object: 'http://app.site.com/' + canonicalUrl + '/',
        objectMetadata: objectMetadata
    };

    return sentence;
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
            animated: true
        };

        frames.topmost().navigate(navigationEntry);
    };

    viewModel.toggleMenu = function (args) {
        var sideMenu = view.getViewById(viewModel.currentPage, mainMenuId);
        if (sideMenu) {
            sideMenu.toggleDrawerState();
        }
        if (sideMenu.getIsOpen()) {
            if (CurrentUser.Id && Client) {
                var canonicalUrl = 'shared/views/sideMenuContent';
                var drawerPageGuid = '55941a9e-ebf2-4253-b528-2b68aff0ef47';
                var prSentence = generatePersonalizationReportSentence(CurrentUser.Id, page.bindingContext.pageGuid, 'Side menu', canonicalUrl, global.personalizationReportSegment);
                Client.writeSentence(prSentence);
                Client.flushData();
            }
        }
    };

    viewModel.navigateToPaidWhitePapers = function () {
        var navigationEntry = {
            animated: true
        };

        //Uncomment the following to code to persist the TOKEN and avoid login after the first time
        if (TOKEN === null) {
            navigationEntry.moduleName = "views/login/login";
        } else {
            navigationEntry.moduleName = "views/whitePapers/whitePapers";
        }

        frames.topmost().navigate(navigationEntry);
    }

    viewModel.navigateToLogin = function () {
        frames.topmost().navigate({
            animated: true,
            moduleName: "views/login/login"
        });
    }

    viewModel.navigateToMainPage = function () {
        frames.topmost().navigate({
            animated: true,
            moduleName: "views/main-page/main-page"
        });
    }

    viewModel.logout = function () {
        TOKEN = null;
        CurrentUser = {};
        isLoggedIn = false;
        isInManagerPersona = false;

        viewModel.navigateToMainPage();
    }

    viewModel.set("isEngLang", isEngLang);
    viewModel.set("isLoggedIn", isLoggedIn);
    viewModel.set("isInManagerPersona", isInManagerPersona);

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

global.ServiceEndPoint = "http://192.168.132.36:8087/";
global.ServiceEndPointWS = "http://192.168.132.36:8087"; //this is the ServiceEndPoint without the slash

global.AuthServicePath = "Sitefinity/Authenticate/OpenID/connect/token";

global.NewsItemsServicePath = "api/quantum-mobile/newsitems";
global.BlogsServicePath = "api/quantum-mobile/blogposts";
// global.LogInServicePath = "api/quantum-mobile/login";
global.WhitePapersServicePath = "api/quantum-mobile/documents";
global.CurrentUserServicePath = "api/quantum-mobile/users/current";

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
global.ManagerPersonaId = 18;

global.isLoggedIn = false;
global.isInManagerPersona = false;
global.isEngLang = true;

global.personalizationReportSegment = null;
global.CurrentUser = {};

// The following is used to initialize the DEC Client, uncomment if you want to use it.
// global.Client = new DECClient({
//     apiKey: '<please enter the apikey of your datacenter here>',
//     source: 'QuantumDecDemo',
//     authToken: 'appauth <please enter the access token of your datacenter here>'
// });

global.Client = new DECClient({
    apiKey: '6788ce78-a40b-b787-f323-3d879ce65fc1',
    source: 'QuantumDecDemo',
    authToken: 'appauth 362E0D5E-814C-5A55-3218-2F2ACDD47611'
});

application.setResources(utcDateConverter);
application.setResources(utcDotNetDateConverter);
application.setResources(summarySubstring);

application.on(application.launchEvent, function (args) {
    if (args.android) {
        imageCache.initialize();
    }

    http.request({ url: ServiceEndPoint + HierarchyTaxaPath, method: "GET" }).then(function (response) {

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
});

application.start({ moduleName: "views/main-page/main-page" });