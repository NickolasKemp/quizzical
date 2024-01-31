import React from 'react';

const Question = (props) => {

    return (
        <div className='question'>
            <div className="question--title">{props.question}</div>
            <ul className="question--answers--list">
                {props.answers.map(answer => (
                    <li
                        key={answer.id}
                    >
                        <a className='question--answer-link' href="#"
                           style={{
                               background: (props.buttonClicked && answer.isCorrect)? '#94D7A2' : (props.buttonClicked && !answer.isCorrect && answer.isSelected ) ? '#F8BCBC' :  answer.isSelected ? '#D6DBF5' : '',
                               opacity: props.buttonClicked && !answer.isCorrect ? '0.5' : '1'

                           }}
                           id={answer.id}
                           onClick={(event) => props.toggleAnswer(event, props.answersArrIndex)}
                        >
                            {answer.answerName}
                        </a>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default Question;