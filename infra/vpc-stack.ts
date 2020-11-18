import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { inspect } from 'util';

export class VpcStack extends cdk.Stack {
  outputProps: cdk.StackProps;

  public outputs() : cdk.StackProps {
    return this.outputProps;
  }

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create subnet
    const publicSubnet ={
      cidrMask: 24,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC
    };
    const privateSubnet ={
      cidrMask: 24,
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE
    };

    // Create a vpc
    const vpc = new ec2.Vpc(this, 'Vpc', { 
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGatewayProvider: ec2.NatProvider.gateway(),
      natGateways: 1,
      subnetConfiguration: [publicSubnet, privateSubnet]
    });

    new cdk.CfnOutput(this, 'vpcId', { value: vpc.vpcId });
    this.outputProps = props;
    this.outputProps['vpc'] = vpc;
    this.outputProps['subnets'] = vpc.publicSubnets;
  }
}
