[![Mollie](http://www.mollie.nl/files/Mollie-Logo-Style-Small.png)](https://www.mollie.com/en/signup/2269941)
# Mollie Reseller API client in ES6 #
Mollie Reseller API client written in ES6 by an official Mollie Partner / Reseller.

_Note: Till version 1.0 of this module, not all functions are implemented and / or tested
check below to see a full list of implemented functions and how to use them._
## Requirements ##
To use the this module, the following is required:

+ Node.js v6.0.0 or higher
+ You can [Sign up](https://www.mollie.com/en/signup/2269941) here for free.
+ You need to accept the Mollie Reseller Agreement for this module to work

## Installation ##

You can install this module with NPM:

    npm install --save mollie-reseller-es6

## Getting started ##
Require the library.
```ES6
    const API = require('mollie-reseller-es6');
```

Set the basics needed
```ES6
    const keys = {
        "partner_id": 1234567,
        "profile_key": "profile_key",
        "secret": "site_secret"
    }
    const reseller = new API(keys);
```

All (main) functions return promises,
which you can either `yield` in a `try / catch` or resolve it `foo.then().catch()`

## Tips ##
If you're managing multiple reseller accounts on 1 server, it's ofcourse also possible to instantiate the class multiple times.

```ES6
    const account_1 = new API(keys_1);
    const account_2 = new API(keys_2);
```

## Implemented Functions ##

### Account ###

#### Claim ####

```ES6
    const username = 'customers username';
    const password = 'customers password';
    try {
        const result = yield reseller.accountClaim(username, password);
        if(result.success) {
            // Account successfully claimed
        } else {
            // Something went wrong
        }
    } catch (e) {
        // Handle error
    }
```

#### Account Valid ####

```ES6
    const username = 'customers username';
    const password = 'customers password';
    try {
        const result = yield reseller.accountValid(username, password);
        if(result.success) {
            // Account exists
        } else {
            // Something went wrong
        }
    } catch (e) {
        // Handle error
    }
```

### Profile ###

#### Profiles ####

```ES6
    const username = 'customers username';
    const password = 'customers password';
    const partner_id_customer = 1234568
    try {
        const result = yield reseller.profiles({username, password});
        // or
        const result = yield reseller.profiles({partner_id_customer});
        if(result.success) {
            // Account exists and is a sub of yours
        } else {
            // Account invalid
        }
    } catch (e) {
        // Handle error
    }
```
