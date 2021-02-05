import React from 'react';

export default ({title, score}) => {
    return(
        <div className="result-container">
            <h5 className="result-title">{title}</h5>
            <p className="result-score">{score}</p>
        </div>
    )
};