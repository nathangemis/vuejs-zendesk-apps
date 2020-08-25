
const constant = {
    API: 'https://177a2390.ngrok.io',
    JWT: {
        secret: "{{setting.shared_secret}}",
        expiry: 3600,
        claims: {
            client_id: "{{setting.client_id}}",
            sub: ""
        }
    },
    HEADER: { "Authorization": "Token {{jwt.token}}" }
}

export default constant