import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ssm from '@aws-cdk/aws-ssm';

export class FargateStack extends cdk.Stack {
    outputProps: cdk.StackProps;

    public outputs() : cdk.StackProps {
        return this.outputProps;
    }

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        
        // Create a cluster
        const vpc = props.vpc;
        const cluster = new ecs.Cluster(this, 'fargate-service-autoscaling', { 
			vpc: vpc,
			clusterName: 'fragraph-cluster'
		 });

		// Create a ECR
		// const isEcrRepositoryExist = ecr.fromRepositoryName(this, 'ecr-repository', 'fragraph-ecr');
		const ecrRepository = new ecr.Repository(this, 'ecr-repository', {
			imageScanOnPush: true,
			repositoryName: "fragraph-ecr"
		});
  
        // const securityGroup = props.sg;
		
		// Get parameters from Parameter Store
		const userName = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/id");
		const password = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/pw");
		const host = ssm.StringParameter.valueForStringParameter(this, "/fragraph/database/host");
		
		// Create Fargate Service
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
					DB_DEFAULT_HOST: host,
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
		
		fargateService.taskDefinition.executionRole?.addManagedPolicy(
			iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser'));
  
        new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

        this.outputProps = props;
        this.outputProps['fargate'] = fargateService;
    }
  }
