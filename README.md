# QuantumMobileApp
Integration with the Quantum web site

## Install the newest version of the Quantum website

## Install NativeScript by following the steps from here https://docs.nativescript.org/start/ns-setup-win

## Host the Qantum website on your IIS

## Open the app.js file of the mobile app and configure the endpoints
global.ServiceEndPoint = "http://192.168.152.142:4774/"; //should point to your localhost 

global.ServiceEndPointWS = "http://192.168.152.142:4774"; //the same address like the above without the slash

//keep in mind that http://10.0.2.2:89 or http://10.0.3.2:89 is your localhost because of the VM and the emulator.
//in case that you want yo access another machine from your intranet use the IP instead of the machine's name 
