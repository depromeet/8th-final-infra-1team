"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FargateStack = void 0;

var ecs = _interopRequireWildcard(require("@aws-cdk/aws-ecs"));

var ecs_patterns = _interopRequireWildcard(require("@aws-cdk/aws-ecs-patterns"));

var cdk = _interopRequireWildcard(require("@aws-cdk/core"));

var iam = _interopRequireWildcard(require("@aws-cdk/aws-iam"));

var ecr = _interopRequireWildcard(require("@aws-cdk/aws-ecr"));

var ssm = _interopRequireWildcard(require("@aws-cdk/aws-ssm"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FargateStack extends cdk.Stack {
  outputs() {
    return this.outputProps;
  }

  constructor(scope, id, props) {
    var _fargateService$taskD;

    super(scope, id, props); // Create a cluster

    _defineProperty(this, "outputProps", void 0);

    const vpc = props.vpc;
    const cluster = new ecs.Cluster(this, 'fargate-service-autoscaling', {
      vpc: vpc,
      clusterName: 'fragraph-cluster'
    }); // Create a ECR

    const ecrRepository = new ecr.Repository(this, 'ecr-repository', {
      imageScanOnPush: true,
      repositoryName: "fragraph-ecr"
    }); // const securityGroup = props.sg;
    // Get parameters from Parameter Store

    const userName = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/id");
    const password = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/pw");
    const host = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/host"); // Create Fargate Service

    const fargateService = new ecs_patterns.NetworkLoadBalancedFargateService(this, 'fragraph', {
      assignPublicIp: true,
      listenerPort: 3000,
      cluster: cluster,
      serviceName: "fragraph",
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ecrRepository),
        containerName: "fragraph",
        containerPort: 3000,
        family: "fragraph",
        environment: {
          DB_DEFAULT_USERNAME: userName,
          DB_DEFAULT_PASSWORD: password,
          DB_DEFAULT_HOST: host
        }
        /*
        secrets: {
        	DB_DEFAULT_USERNAME: ecs.Secret.fromSsmParameter(userName),
        	DB_DEFAULT_PASSWORD: ecs.Secret.fromSsmParameter(password),
        	DB_DEFAULT_HOST: ecs.Secret.fromSsmParameter(host),
        }
        */

      },
      assignPublicIp: true
    });
    (_fargateService$taskD = fargateService.taskDefinition.executionRole) === null || _fargateService$taskD === void 0 ? void 0 : _fargateService$taskD.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser'));
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName
    });
    this.outputProps = props;
    this.outputProps['fargate'] = fargateService;
  }

}

exports.FargateStack = FargateStack;