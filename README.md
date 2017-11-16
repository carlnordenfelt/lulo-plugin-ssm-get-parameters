# lulo SSM Get Parameters

lulo SSM Get Parameters returns the provided parameters from EC2 SSM Parameter Store.

lulo SSM Get Parameters is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-ssm-get-parameters --save
```

## Usage
### Properties
* Names: An array of parameter names to fetch. Required.
* Prefix: A prefix which will be stripped from each ParameterName before responding. Optional.

### Return Values
The parameter values can be accessed via Fn::GetAtt for each valid Parameter Name:
`{ "Fn::GetAtt": "ParameterName" }`

### Required IAM Permissions
The Custom Resource Lambda requires the following permission statement for this plugin to work:

**Note:** If any of the parameters are encrypted, the Lambda also needs decrypt permissions to the KMS key.

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ssm:getParameters"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
