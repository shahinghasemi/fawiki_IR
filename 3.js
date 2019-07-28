const axios = require('axios')

for(let i = 0 ; i < 500; i ++){
    axios.get('https://www.google.com').then(res=>{
        console.log('SEND, ', i);
    }).catch(err=>console.log(':::::ERR::::', i, '::', err));
}
console.log('FINISH');