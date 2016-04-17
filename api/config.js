const apiPort = 3030;
const port = 3000;

const domain = 'bandaid.com';
module.exports = {
  development: {
    isProduction: false,
    port: 3000,
    domain: domain,
    apiPort: 3030,
    app: {
      name: 'React Redux With Passport and Sequelize',
      profileImgPath: __dirname + '/../images'
    },
    jwtSecret : 'jfNIdd84jd9dsw637hej',
    db: {
      connectionString: 'mongodb://localhost/bandaid',
      models: ['user','country','city','region','genre','instrument','address','location','region','address']
    },
    facebook: {
      clientID: '418259915025400',
      clientSecret: '4c9ef56592e122c0b9c95ed8a34a0a1e',
      callbackURL: 'http://' + domain + ':' + apiPort + '/oauthSuccess'
    },
    google: {
      clientID: '309796006487-b6ju56r441plsk1uf8l2vod0f6v0efe9.apps.googleusercontent.com',
      clientSecret: 'csgbFnLawbdWp4AQiNR4Y4A5',
      callbackURL: 'http://' + domain + ':' + apiPort + '/oauth/google/callback',
      scope: 'email'
    },
    foursquare: {
      clientID: 'CA5L5IPUIOFDTXIW5BU1X01OJYDCMUAANU2AH1DWEE4G5MOE',
      clientSecret: '43WA0G1TX5KKMEN5VSRRX5A1XH5RDU4KESBU0BGEBOYIZN1P'
    },


  },
  production: {
    isProduction: true,
    port: process.env.PORT,
    apiPort: 3030,
    app: {
      name: 'React Redux Example Production'
    }
  }
}[process.env.NODE_ENV || 'development'];
