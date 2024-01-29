import React from 'react';

const Start = (props) => {
    return (
        <div className='start'>
            <div className="start--container">
                <div className='start--body'>
                    <div className="start--title">Quizzical</div>
                    <div className="start--subtitle">Some description if needed</div>
                </div>
                <div className="start--button">
                    <button onClick={() => props.startQuizOnClick()} >Start quiz</button>
                </div>
            </div>
        </div>
    );
};

export default Start;