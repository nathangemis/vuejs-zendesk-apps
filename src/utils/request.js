import ZAFClient from 'zendesk_app_framework_sdk'

const client = ZAFClient.init()
class Request {
    constructor() {
        this.settings = {
            url: '',
            headers: {},
            jwt: {
                algorithm: 'HS256',
                secret_key: "",
                expiry: 3600,
                claims: {}
            },
            secure: true,
            type: '',
            contentType: 'application/json',
            data: {}
        };
    }


    get (url, headers, jwt = { secret, expiry: 3600, claims }, secure = true) {
        this.settings.url = url
        this.settings.headers = headers
        this.settings.secure = secure
        this.settings.type = 'GET'
        let settings
        if (jwt) {
            this.settings.jwt.secret_key = jwt.secret
            this.settings.jwt.expiry = jwt.expiry
            this.settings.jwt.claims = jwt.claims
            settings = this.settings
            // console.log(settings);

        } else {
            settings = this._objectWithoutProperties(this.settings, ['jwt'])
        }
        return client.request(settings)

    }
    post (url, data, headers, jwt = { secret, expiry: 3600, claims }, secure = true) {
        this.settings.url = url
        this.settings.data = JSON.stringify(data)
        this.settings.headers = headers
        this.settings.secure = secure
        this.settings.type = 'POST'
        let settings
        if (jwt) {
            this.settings.jwt.secret_key = jwt.secret
            this.settings.jwt.expiry = jwt.expiry
            this.settings.jwt.claims = jwt.claims
            settings = this.settings
            // console.log(settings);

        } else {
            settings = this._objectWithoutProperties(this.settings, ['jwt'])
        }


        return client.request(settings)

    }
    put (url, data, headers, jwt = { secret, expiry: 3600, claims }, secure = true) {
        this.settings.url = url
        this.settings.data = JSON.stringify(data)
        this.settings.headers = headers
        this.settings.secure = secure
        this.settings.type = 'PUT'
        let settings
        if (jwt) {
            this.settings.jwt.secret_key = jwt.secret
            this.settings.jwt.expiry = jwt.expiry
            this.settings.jwt.claims = jwt.claims
            settings = this.settings
            // console.log(settings);

        } else {
            settings = this._objectWithoutProperties(this.settings, ['jwt'])
        }


        return client.request(settings)

    }

    patch (url, data, headers, jwt = { secret, expiry: 3600, claims }, secure = true) {
        this.settings.url = url
        this.settings.data = JSON.stringify(data)
        this.settings.headers = headers
        this.settings.secure = secure
        this.settings.type = 'PATCH'
        let settings
        if (jwt) {
            this.settings.jwt.secret_key = jwt.secret
            this.settings.jwt.expiry = jwt.expiry
            this.settings.jwt.claims = jwt.claims
            settings = this.settings
            // console.log(settings);

        } else {
            settings = this._objectWithoutProperties(this.settings, ['jwt'])
        }


        return client.request(settings)

    }


    delete (url, headers, jwt = { secret, expiry: 3600, claims }, secure = true) {
        this.settings.url = url
        this.settings.headers = headers
        this.settings.secure = secure
        this.settings.type = 'DELETE'
        let settings
        if (jwt) {
            this.settings.jwt.secret_key = jwt.secret
            this.settings.jwt.expiry = jwt.expiry
            this.settings.jwt.claims = jwt.claims
            settings = this.settings
            // console.log(settings);

        } else {
            settings = this._objectWithoutProperties(this.settings, ['jwt'])
        }


        return client.request(settings)

    }

    _objectWithoutProperties (obj, keys) {
        var target = {};
        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }
        return target;
    }


}

const request = new Request()

export default request