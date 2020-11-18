"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RestApiStack = void 0;

var _awsApigateway = require("@aws-cdk/aws-apigateway");

var _awsLambda = require("@aws-cdk/aws-lambda");

var _core = require("@aws-cdk/core");

var _path = require("path");

class RestApiStack extends _core.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const code = _awsLambda.Code.fromAsset((0, _path.join)(__dirname, '../dist'));

    const api = new _awsApigateway.RestApi(this, 'SampleRestApi', {
      deployOptions: {
        stageName: 'dev'
      }
    });
    api.root.addMethod('GET', new _awsApigateway.LambdaIntegration(new _awsLambda.Function(this, 'HomeHandler', {
      runtime: _awsLambda.Runtime.NODEJS_12_X,
      code,
      handler: 'entry.handler'
    })));
  }

}

exports.RestApiStack = RestApiStack;