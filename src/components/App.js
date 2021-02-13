import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Result from './Result';

import './App.css';

export default () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    function inputChanged(e) {
        setQuery(e.currentTarget.value)
    }
    function sendReq() {
        setError(null);
        axios.post('http://localhost:4000/query', { query }).then((res)=>{
            console.log('res.data: ', res.data);
            setData(res.data);
        }).catch(({ response })=>{
            if (response.status === 404){
                setData([])
                setError('Nothing found')
            }
            else {
                console.log('error: ', response);
                setError(response.data);
            }
        })
    }
    return (
        <div className="main-container">
           <div className="query-container">
                <input className="query-input" 
                    onChange={inputChanged} 
                    placeholder="سرچ کنید..."
                />
                <div className="buttons-container">
                    <a href="https://github.com/shahinghasemi/fawiki_IR" className="github-link">
                        <button className="button">Github </button>
                    </a>
                    <button className="button" onClick={sendReq}>جست و جو </button>
                    </div>
                
                {
                    data.took ? 
                        <div className="meta-container">
                            <p>{data?.results?.length} سند در {data?.took} میلی ثانیه بازیافت شدند</p>
                        </div>
                        : ''
                }
           </div>

           <div className="results-container">
            {
                data?.results?.map((doc)=>{
                    return (
                        <Result  
                            key={doc._id}
                            title={doc.title}
                            score={doc.score}
                            url={doc.url}
                        />
                    )
                })
            }
           </div>
           <p>{error}</p>
        </div>
    )
}