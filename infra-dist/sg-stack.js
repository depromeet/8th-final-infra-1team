"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityGroupStack = void 0;

var ec2 = _interopRequireWildcard(require("@aws-cdk/aws-ec2"));

var cdk = _interopRequireWildcard(require("@aws-cdk/core"));

var axios = _interopRequireWildcard(require("axios"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SecurityGroupStack extends cdk.Stack {
  outputs() {
    return this.outputProps;
  }

  constructor(scope, id, props) {
    super(scope, id, props);

    _defineProperty(this, "outputProps", void 0);

    let sg = new ec2.SecurityGroup(this, 'ingress-security-group', {
      vpc: props.vpc,
      allowAllOutbound: false,
      securityGroupName: 'ingress-security-group'
    });
    const publicIp = axios.create({
      baseURL: 'https://api.ipify.org',
      timeout: 5000
    });
    let myIp = '0.0.0.0/32'; // TODO: 이 부분에 대한 처리 검색

    publicIp.get().then(response => {
      myIp = response.text + "/32";
    });
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(22));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(80));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(443));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(3000));
    new cdk.CfnOutput(this, 'SecurityGroup', {
      value: sg.securityGroupId
    });
    this.outputProps = props;
    this.outputProps['sg'] = sg;
  }

}

exports.SecurityGroupStack = SecurityGroupStack;