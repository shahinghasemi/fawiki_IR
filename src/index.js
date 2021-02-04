import React from 'react'
import ReactDOM from 'react-dom';
import App from './components/App'

document.body.innerHTML += `<div id="root"></div>`
const rootEl = document.getElementById('root');
// console.log('rootEl: ', rootEl);

ReactDOM.render(<App />, rootEl)