const proxy = require('http-proxy-middleware');


module.exports = function (app) {
   app.use(proxy('/webservice/rest', {
      target: "https://pimcore.idvxlab.com:7000",
      changeOrigin: true,
   }));
   app.use(proxy('/users', {
      target: "https://pimcore.idvxlab.com:7000",
      changeOrigin: true,
   }));

   app.use(proxy('/aliApi', {
      target: "http://47.96.122.250:3001",
      changeOrigin: true,
      pathRewrite:{
         '^/aliApi':'/'
      }
   }));
   app.use(proxy('/api/v1', {
      target: "http://202.120.165.126:8000",
      changeOrigin: true,
   }));

};

