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

## Implemented instance functions ##

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

## Static functions ##

Here are some static functions that might prove useful, maybe even for other projects!

### stringToEncodedURI ###

URIencodes a String as the way Mollie requires us to.
The standard `encodeURIComponent(String)` functions is not enough.

```ES6
    const string_to_be_encoded = '/api/reseller/v1/account-valid?partner_id=1234567&etc=more';
    const encoded_string = API.stringToEncodedURI(string_to_be_encoded);
```

### getLegalForms ###

Returns an array with the legal forms Mollie accepts.
Might I miss some, please do a pull request :)

```ES6
    const legal_forms = API.getLegalForms();
```

Printing this would result in:
```ES6
    [
        {
            "key": "eenmanszaak",
            "value": "Eenmanszaak (The Netherlands)"
        },
        {
            "key": "eenmanszaak-be",
            "value": "Eenmanszaak (Belgium)"
        },
        {
            "key": "eenmans-bvba-be",
            "value": "Eenmans besloten vennootschap met beperkte aansprakelijkheid"
        },
        {
            "key": "maatschap",
            "value": "Maatschap"
        },
        {
            "key": "vof",
            "value": "VOF (The Netherlands)"
        },
    // Etc etc etc
    ]
```
