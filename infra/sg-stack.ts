import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as axios from 'axios';
import { inspect } from 'util';

export class SecurityGroupStack extends cdk.Stack {
  outputProps: cdk.StackProps;

  public outputs() : cdk.StackProps {
    return this.outputProps;
  }

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    let sg = new ec2.SecurityGroup(
      this,
      'ingress-security-group',
      {
        vpc: props.vpc,
        allowAllOutbound: false,
        securityGroupName: 'ingress-security-group'
      }
    );
    const publicIp = axios.create({
      baseURL: 'https://api.ipify.org',
      timeout: 5000
    })
    let myIp = '0.0.0.0/32'; // TODO: 이 부분에 대한 처리 검색
    publicIp.get().then((response) => {
      myIp = response.text+"/32";
    });
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(22));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(80));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(443));
    sg.addIngressRule(ec2.Peer.ipv4(myIp), ec2.Port.tcp(3000));

    new cdk.CfnOutput(this, 'SecurityGroup', { value: sg.securityGroupId });

    this.outputProps = props;
    this.outputProps['sg'] = sg;

  }
}