const axios = require('axios');
console.log("Relative + Leading Slash:", axios.getUri({ baseURL: '/api', url: '/auth/register' }));
console.log("Relative + No Leading Slash:", axios.getUri({ baseURL: '/api', url: 'auth/register' }));
console.log("Absolute + Leading Slash:", axios.getUri({ baseURL: 'http://localhost:5000/api', url: '/auth/register' }));
console.log("Absolute + No Leading Slash:", axios.getUri({ baseURL: 'http://localhost:5000/api', url: 'auth/register' }));
