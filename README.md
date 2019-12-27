# lulo SSM Get Parameters

lulo SSM Get Parameters returns the provided parameters from SSM Parameter Store.

lulo SSM Get Parameters is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-ssm-get-parameters --save
```

## Usage
### Properties
* Parameters: An array of name/path parameter configurations. Required.

### Example
```
SSMParams:
    Type: 'Custom:GetParameters'
    Properties:
        ServiceToken: '...'
        Parameters:
            - ['Foo', '/path/to/foo/parameter']
            - ['Bar', '/path/to/bar/parameter']

Outputs:
    FooValue:
        Value: !GetAtt 'SSMParams.Foo'
    BarValue:
        Value: !GetAtt 'SSMParams.Bar'
```

### Return Values
The parameter values can be accessed via Fn::GetAtt for each valid Parameter Name:
`!GetAtt 'Resource.ParamName'`

### Required IAM Permissions
The Custom Resource Lambda requires the following permission statement for this plugin to work:

**Note:** If any of the parameters are encrypted using a custom KMS key the Lambda will need decrypt permissions on the key.

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
