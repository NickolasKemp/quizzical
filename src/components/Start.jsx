import React from 'react';

const Start = (props) => {
    return (
        <div className='start'>
            <div className="start--container">
                <div className='start--body'>
                    <div className="start--title">Quizzical</div>
                    <div className="start--subtitle">
                        "Quizzical" is a quiz or trivia game, it
                        involves challenging players with questions on various topics,
                        including general knowledge, pop culture, history, science, and more.</div>
                </div>
                <div className="start--button">
                    <button onClick={() => props.startQuizOnClick()} >Start quiz</button>
                </div>
            </div>
        </div>
    );
};

export default Start;