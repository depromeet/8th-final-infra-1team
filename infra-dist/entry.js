#!/usr/bin/env node
"use strict";

var _core = require("@aws-cdk/core");

var _restapiStack = require("./restapi-stack");

const app = new _core.App();
new _restapiStack.RestApiStack(app, 'WaniSampleRestApiStack');