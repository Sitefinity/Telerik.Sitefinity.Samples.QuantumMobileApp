var Observable = require("data/observable").Observable;

var frames = require("ui/frame");
var http = require("http");

var showLogInButtonProp = "showLogInButton";
var usernameProp = "username";
var passwordProp = "password";
var clientId = "quantum-ns-app";
var clientSecret = "secret";

function createViewModel() {
    var viewModel = new Observable();
    viewModel.set(showLogInButtonProp, true);
    viewModel.set(usernameProp, "");
    viewModel.set(passwordProp, "");

    viewModel.logIn = function () {
        viewModel.set(showLogInButtonProp, false);

        var formData = new FormData();
        formData.append(usernameProp, viewModel.get(usernameProp));
        formData.append(passwordProp, viewModel.get(passwordProp));
        formData.append("grant_type", "password");
        formData.append("scope", "openid offline_access");
        formData.append("client_id", clientId);
        formData.append("client_secret", clientSecret);

        http.request({
            url: ServiceEndPoint + AuthServicePath,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            content: formData
        }).then(function (response) {
            var result;
            try {
                result = response.content.toJSON();
            }
            catch (e) {
                console.dir(e);
                alert("Error");
                viewModel.set(showLogInButtonProp, true);
                return;
            }

            if (!result.access_token) {
                alert("Try again");
                viewModel.set(showLogInButtonProp, true);
                return;
            }
            TOKEN = result;
            isLoggedIn = true;

            getSFUserInformation();


        }, function (e) {
            viewModel.set(showLogInButtonProp, true);
            alert("Try again. " + e);
        });
    };

    return viewModel;
}

var getSFUserInformation = function () {
    http.request({
        url: ServiceEndPoint + CurrentUserServicePath,
        method: "GET",
        headers: {
            "x-sf-service-request": "true",
            "Authorization": TOKEN.token_type + " " + TOKEN.access_token
        }
    }).then(function (response) {
        var result;
        try {
            result = response.content.toJSON();
            CurrentUser = result.value;
            if (global.DecClient) {
                sendLoginInteraction();
                checkIfUserIsInPersona();
            } else {
                frames.topmost().goBack();
            }
        } catch (e) {
        }
    }, function (e) {
        alert("Try again. " + e);
    });
};

var sendLoginInteraction = function () {
    global.DecClient.writeInteraction({
        S: CurrentUser.Id,
        P: 'Logged in',
        O: 'NativeScript Quantum App'
    });

    global.DecClient.writeSubjectMetadata(CurrentUser.Id, {
        Email: CurrentUser.Email
    });

    global.DecClient.flushData();
};

var checkIfUserIsInPersona = function () {
    var personaIds = [ManagerPersonaId];
    global.DecClient.isInPersonas(personaIds, CurrentUser.Id).then(function (data) {
        var personas = data.toJSON().items;
        if (personas.length) {
            personas.forEach(function (persona) {
                if (persona.Id === ManagerPersonaId) {
                    isInManagerPersona = true;
                    personalizationReportSegment = 'IT Manager';
                }
            }, this);
        }

        frames.topmost().goBack();
    });
};

exports.createViewModel = createViewModel;