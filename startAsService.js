var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'AM-Invoices',
  description: 'AM Invoices',
  script: 'C:\\Sites\\AM-Frontend-Admins\\AM-Invoices\\server.js'
  
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();