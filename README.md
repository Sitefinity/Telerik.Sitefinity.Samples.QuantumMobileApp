# QuantumMobileApp
Integration with the Quantum web site

## Install the newest version of the Quantum website

## Install NativeScript by following the steps from here https://docs.nativescript.org/start/ns-setup-win

## Host the Qantum website on your IIS

## Open the app.js file of the mobile app and configure the endpoints
global.ServiceEndPoint = "http://192.168.152.142:4774/"; //should point to your localhost 

global.ServiceEndPointWS = "http://192.168.152.142:4774"; //the same address like the above without the slash

keep in mind that http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator.
In case that you want yo access another machine from your intranet use the IP instead of the machine's name 

## The app is using [Progress Sitefinity Digital Experience Cloud](https://docs.sitefinity.com/dec) for tracking and content personalization. In order to enable it you need to do the following:

1. Log in to [Digital Experience Cloud](https://dec.sitefinity.com/) web application.
1. Go to your Data center through the Administration panel and get the Api key and the Authorization token.
1. Uncomment and fill in the following code in app.js
```js
global.DecClient = new DecClient({
    apiKey: '<please enter the apikey of your datacenter here>',
    source: 'QuantumDecDemo',
    authToken: 'appauth <please enter the access token of your datacenter here>'
});
```
The app will be working without setting up the Digital Experience Clound but there will be no tracking or personalization of content.