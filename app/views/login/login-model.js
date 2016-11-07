var Observable = require("data/observable").Observable;

var frames = require("ui/frame");
var http = require("http");

var showLogInButtonProp = "showLogInButton";
var usernameProp = "username";
var passwordProp = "password";

function createViewModel() {
    var viewModel = new Observable();
    viewModel.set(showLogInButtonProp, true);
    viewModel.set(usernameProp, "");
    viewModel.set(passwordProp, "");


    viewModel.logIn = function () {
        viewModel.set(showLogInButtonProp, false);
        http.request({
            url: ServiceEndPoint + LogInServicePath,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({ 'username': viewModel.get(usernameProp), 'password': viewModel.get(passwordProp) })
        }).then(function (response) {
            var result = response.content.toJSON();

            if (result.value == undefined || result.value == null) {
                alert("Try again");
                viewModel.set(showLogInButtonProp, true);
                return;
            }

            TOKEN = result.value;

            var navigationEntry = {
                moduleName: 'views/whitePapers/whitePapers',
                animated: false
            };

            frames.topmost().navigate(navigationEntry);

        }, function (e) {
            viewModel.set(showLogInButtonProp, true);
            alert("Try again. " + e);
        });
    };

    return viewModel;
}

exports.createViewModel = createViewModel;




