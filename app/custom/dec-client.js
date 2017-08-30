var http = require('http');
var Promise = require('bluebird');

function DECClient(options) {
    this.constants = {
        sdkVersion: "dec-client-1.0.12",
        endpoints: {
            apiServer: "https://api.dec.sitefinity.com"
        },
        headers: {
            authorization: "Authorization",
            datacenterkey: "x-dataintelligence-datacenterkey",
            subject: "x-dataintelligence-subject",
            ids: "x-dataintelligence-ids",
            datasource: "x-dataintelligence-datasource",
            contacts: "x-dataintelligence-contacts",
            sdkVersion: "x-dataintelligence-sdk-version"
        }
    };

    options = options || {};

    if (!options.apiKey) throw new Error('You must provide the ApiKey for the Data Center.');
    if (!options.source) throw new Error('You must provide the source name of the client.');

    this.apiKey = options.apiKey;
    this.source = options.source;
    this.authToken = options.authToken;
    this.apiServerUrl = options.apiServerUrl || this.constants.endpoints.apiServer;
    this.sentences = [];

    this.getEndpointUrl = function (apiServer, apiKey, source) {
        return apiServer + '/collect/v2/data-centers/' + apiKey + '/datasources/' + source + '/interactions';
    };

    this.getSentencesRequestOptions = function (parameters, data, headers) {
        if (data.length == 1) {
            data = data[0];
        }

        var url = this.getEndpointUrl(parameters.apiServerUrl, parameters.apiKey, parameters.source);
        var requestOptions = this.getRequestOptions(data, 'POST', url, headers);

        return requestOptions;
    };

    this.getRequestOptions = function (data, httpMethod, url, headers) {
        var requestOptions = {
            method: httpMethod,
            url: url,
            contentType: 'application/json',
            headers: headers || {},
            data: data
        };

        requestOptions.headers[this.constants.headers.sdkVersion] = this.constants.sdkVersion;

        return requestOptions;
    };

    this.call = function (endpoint, headers) {
        if (!this.authToken) throw new Error('You must provide "authToken" when using the Personalization Client.');

        var url = this.apiServerUrl + endpoint;
        var options = this.getRequestOptions(null, 'GET', url, headers);

        options.headers[this.constants.headers.authorization] = this.authToken;
        options.headers[this.constants.headers.datacenterkey] = this.apiKey;

        return this.makeRequest(options);
    };

    this.makeRequest = function (options) {
        if (!options) throw new Error("options is required.");
        if (!options.method) throw new Error("options.method is required.");
        if (!options.url) throw new Error("options.url is required.");

        return new Promise(function (resolve, reject) {
            var requestOptions = {
                url: options.url,
                method: options.method,
                content: options.data ? JSON.stringify(options.data) : null,
                headers: {}
            };

            var headers = options.headers || {};

            if (options.contentType) {
                headers["Content-Type"] = options.contentType;
            }

            for (var header in headers) {
                requestOptions.headers[header] = headers[header];
            }

            http.request(requestOptions).then(function (response) {
                if ((response.statusCode >= 200 && response.statusCode < 300) || response.statusCode === 304) {
                    resolve(response.content);
                } else {
                    reject(response.content);
                }
            }, function (error) {
                reject(error);
            });
        });
    };

    this.writeSentence = function (sentence) {
        if (!sentence) throw new Error('You must provide "sentence" argument when writing a sentence.');

        var newSentence = {
            S: sentence.subjectKey,
            P: sentence.predicate,
            O: sentence.object,
            SM: sentence.subjectMetadata,
            OM: sentence.objectMetadata,
            MappedTo: sentence.mappedTo
        };

        this.sentences.push(newSentence);
    };

    this.addMapping = function (subjectKey, secondSubjectKey, secondDataSource) {
        return this.writeSentence({
            subjectKey: subjectKey,
            mappedTo: [{
                "S": secondSubjectKey,
                "DS": secondDataSource
            }]
        });
    };

    this.isInCampaigns = function (campaignIds, subjectKey) {
        if (!campaignIds) throw new Error('You must provide "campaignIds" argument when using the "isInCampaigns" method.');
        if (!subjectKey) throw new Error('You must provide "subjectKey" argument when using the "isInCampaigns" method.');

        var headers = {};

        headers[this.constants.headers.subject] = subjectKey;
        headers[this.constants.headers.ids] = campaignIds;
        headers[this.constants.headers.datasource] = this.source;

        return this.call('/analytics/v1/campaigns/isin', headers);
    };

    this.isInLeads = function (scoringIds, subjectKey) {
        if (!scoringIds) throw new Error('You must provide "scoringIds" argument when using the "isInLeads" method.');
        if (!subjectKey) throw new Error('You must provide "subjectKey" argument when using the "isInLeads" method.');

        var headers = {};

        headers[this.constants.headers.datasource] = this.source;
        headers[this.constants.headers.subject] = subjectKey;
        headers[this.constants.headers.ids] = scoringIds;

        return this.call('/analytics/v2/scorings/leads/in', headers);
    };

    this.isInPersonas = function (scoringIds, subjectKey) {
        if (!scoringIds) throw new Error('You must provide "scoringIds" argument when using the "isInPersonas" method.');
        if (!subjectKey) throw new Error('You must provide "subjectKey" argument when using the "isInPersonas" method.');

        var headers = {};

        headers[this.constants.headers.datasource] = this.source;
        headers[this.constants.headers.subject] = subjectKey;
        headers[this.constants.headers.ids] = scoringIds;

        return this.call('/analytics/v1/scorings/personas/in', headers);
    };

    this.writeSubjectMetadata = function (subjectKey, metadata) {
        if (!subjectKey) throw new Error('You must provide "subjectKey" argument when writing subject metadata.');
        if (!metadata) throw new Error('You must provide "metadata" argument when writing subject metadata.');

        return this.writeSentence({
            subjectKey: subjectKey,
            subjectMetadata: metadata
        });
    };

    this.writeObjectMetadata = function (subjectKey, metadata) {
        if (!subjectKey) throw new Error('You must provide "subjectKey" argument when writing subject metadata.');
        if (!metadata) throw new Error('You must provide "metadata" argument when writing subject metadata.');

        return this.writeSentence({
            subjectKey: subjectKey,
            objectMetadata: metadata
        });
    };

    this.flushData = function () {
        var that = this,
            requestOptions = this.getSentencesRequestOptions(this, this.sentences);

        return new Promise(function (resolve, reject) {
            that.makeRequest(requestOptions)
                .then(function (response) {
                    that.sentences = [];
                    resolve(response);
                })
                .catch(function (response) {
                    reject(response);
                });
        });
    };
};

module.exports = DECClient;