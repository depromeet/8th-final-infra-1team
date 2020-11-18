#!/usr/bin/env node

import { App } from '@aws-cdk/core';
import { FargateStack } from './fargate-stack';
import { SecurityGroupStack } from './sg-stack';
import { VpcStack } from './vpc-stack';
import { inspect } from 'util';

const app = new App();

// new RestApiStack(app, 'SampleRestApiStack');

const baseProps = {'Project': 'fragraph'};

const vpc = new VpcStack(app, 'VpcStack', baseProps);

const sg = new SecurityGroupStack(app, 'SecurityGroupStack', vpc.outputs());
sg.addDependency(vpc);

const fg = new FargateStack(app, 'aws-fargate-application-autoscaling', sg.outputs());
fg.addDependency(sg);

app.synth();
