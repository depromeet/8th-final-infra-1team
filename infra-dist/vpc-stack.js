"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VpcStack = void 0;

var ec2 = _interopRequireWildcard(require("@aws-cdk/aws-ec2"));

var cdk = _interopRequireWildcard(require("@aws-cdk/core"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class VpcStack extends cdk.Stack {
  outputs() {
    return this.outputProps;
  }

  constructor(scope, id, props) {
    super(scope, id, props); // Create subnet

    _defineProperty(this, "outputProps", void 0);

    const publicSubnet = {
      cidrMask: 24,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC
    };
    const privateSubnet = {
      cidrMask: 24,
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE
    }; // Create a vpc

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGatewayProvider: ec2.NatProvider.gateway(),
      natGateways: 1,
      subnetConfiguration: [publicSubnet, privateSubnet]
    });
    new cdk.CfnOutput(this, 'vpcId', {
      value: vpc.vpcId
    });
    this.outputProps = props;
    this.outputProps['vpc'] = vpc;
    this.outputProps['subnets'] = vpc.publicSubnets;
  }

}

exports.VpcStack = VpcStack;