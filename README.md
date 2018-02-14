# QuantumMobileApp

## Install the newest version of the Quantum website
 https://github.com/Sitefinity-SDK/Telerik.Sitefinity.Samples.Quantum

## Install NativeScript by following the steps from here https://docs.nativescript.org/start/ns-setup-win

## Setup Emulator(s)
Android (windows/mac) https://developer.android.com/studio/run/emulator.html
iOS (xCode) https://developer.apple.com/xcode/

## Host the Qantum website on your IIS

## Open the app.js file of the mobile app and configure the endpoints
global.ServiceEndPoint = "http://192.168.152.142:4774/"; //should point to your localhost 

global.ServiceEndPointWS = "http://192.168.152.142:4774"; //the same address like the above without the slash

keep in mind that http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator.
In case that you want yo access another machine from your intranet use the IP instead of the machine's name.
If using android emulator authenticating against localhost(10.0.2.2) it requires you to use your machine's IP address NOT the adroid emlulator local address '10.0.2.2'

#### *Important:* In order to get New's and Blog's Categories you need to make a small change in Sitefinity's ***quantum-mobile*** web service settings.
1. In Sitefinity's backend go to "Administration -> Settings -> Advanced".
1. Then go to "WebServices -> Routes -> Frontend -> Services -> quantum-mobile -> Type".
   * Go to "Telerik.Sitefinity.News.Model.NewsItem -> Property mappings -> Category" and check the "Selected by default" checkbox and save the change.
   * Go to "Telerik.Sitefinity.Blogs.Model.BlogPost -> Property mappings -> Category" and check the "Selected by default" checkbox and save the change.
   * Go to "Telerik.Sitefinity.Libraries.Model.Document -> Property mappings -> Category" and check the "Selected by default" checkbox and save the change.
---

## The app is using [Progress Sitefinity Digital Experience Cloud](https://docs.sitefinity.com/dec) for tracking and content personalization. In order to enable it you need to do the following:

1. Log in to [Digital Experience Cloud](https://dec.sitefinity.com/) web application.
1. This app using the demo data center in the DEC
1. Go to your Data center through the Administration panel and get the Api key and the Authorization token.
1. Uncomment and fill in the following code in app.js
```js
var decApiKey = '<please enter the apikey of your datacenter here>';
global.DecClient = new DecClient({
    apiKey: decApiKey,
    source: 'QuantumDecDemo',
    authToken: 'appauth ' + decApiKey
});
```
The app will be working without setting up the Digital Experience Clound but there will be no tracking or personalization of content.
If using android emulator authenticating against  localhost requires you to use your machine's IP address NOT the adroind emlulator local address '10.0.2.2'

## Other areas of interest
This covers other potential area you can extend customize or reuse in this app.

The DEC data center that this Quantum Web instance and mobile app are connected to have 1 persona with a simple rule of 'if they visit the X page once' they fit.  In order for the persona to be passed from the web application and mobile app you must be logged in as a user in the web app visit the page or complete the persona rule(s), then login to the mobile app.

### How to retrieve DEC persona Id
Login to your [data center](http://dec.sitefinity.com) click Personas, Click the persona to view it's details, look at the url and identify the id of the persona.
