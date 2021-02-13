import React from 'react';

export default ({title, score, url}) => {
    return(
        <a href={url} className="result-container">
            <h2 className="result-title">{title}</h2>
            <p className="result-score">امتیاز: {score}</p>
        </a>
    )
};