exports.default = {
  auth: {
    client_id: 'd782d313-0811-493e-a760-066dc83bb548',
    secret: 'WK5TVHSg7x51ifPQ+uyKCtzgnWz9FqmO',
    endpoint: {
      protocol: 'http',
      hostname: 'auth',
      port: 3000
    },
    fqdn: {
      protocol: 'https',
      hostname: 'auth.zdc.local'
    }
  }
};

exports.test = {
  auth: {
    client_id: 'testapi',
    secret: 'testsecret',
    endpoint: {
      protocol: 'http',
      hostname: 'localhost',
      port: 3000
    }
  }
};