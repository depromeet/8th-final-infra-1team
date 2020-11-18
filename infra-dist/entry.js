#!/usr/bin/env node
"use strict";

var _core = require("@aws-cdk/core");

var _fargateStack = require("./fargate-stack");

var _sgStack = require("./sg-stack");

var _vpcStack = require("./vpc-stack");

const app = new _core.App(); // new RestApiStack(app, 'SampleRestApiStack');

const baseProps = {
  'Project': 'fragraph'
};
const vpc = new _vpcStack.VpcStack(app, 'VpcStack', baseProps);
const sg = new _sgStack.SecurityGroupStack(app, 'SecurityGroupStack', vpc.outputs());
sg.addDependency(vpc);
const fg = new _fargateStack.FargateStack(app, 'aws-fargate-application-autoscaling', sg.outputs());
fg.addDependency(sg);
app.synth();