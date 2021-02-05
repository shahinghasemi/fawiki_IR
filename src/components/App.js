import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Result from './Result';

import './App.css';

export default () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    function inputChanged(e) {
        setQuery(e.currentTarget.value)
    }
    function sendReq() {
        axios.post('http://localhost:4000/query', { query }).then((res)=>{
            console.log('res.data: ', res.data);
            setResults(res.data);
        }).catch(({ response })=>{
            if (response.status === 404){
                setResults([])
                setError('Nothing found')
            }
            else {
                console.log('error: ', response);
                setError(response.data);
            }
        })
    }
    return (
        <div>
           <h1>سرچ کنید</h1>
           <input onChange={inputChanged}></input>
           <button onClick={sendReq}>Search</button>
           {
               results.map((doc)=>{
                   return (
                       <Result  
                        key={doc._id}
                        title={doc.title}
                        score={doc.score}
                       />
                   )
               })
           }
           <p>{error}</p>
        </div>
    )
}