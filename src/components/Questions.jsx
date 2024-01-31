import React, {useState} from 'react';
import Question from "./Question";


const Questions = ({
                       questions, answersArrs, setAnswersArrs,
                       questionsAndAnswersArrays, fetchData, isLoadedData
                   }) => {

    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)

    const [clicked, setClicked] = useState(false)

    function toggleAnswer(event, answersArrIndex) {
        event.preventDefault()
        const targetId = event.target.id

        setAnswersArrs(answersArrs => {
                const newAnswersArrs = []
                for (let index = 0; index < answersArrs.length; index++) {
                    const answersArr = answersArrs[index]

                    const newAnswersArr = answersArr.map(answer => (
                        (answer.id === targetId) ?
                            {
                                ...answer,
                                isSelected: !answer.isSelected
                            }
                            :
                            (answersArrIndex === answer.answersArrIndex) ?
                                {
                                    ...answer,
                                    isSelected: false
                                }
                                :
                                answer
                    ))
                    newAnswersArrs.push(newAnswersArr)
                }
                return newAnswersArrs
            }
        )
    }

    function checkAnswers() {
        setClicked(true)
        for (let answersArraysIndex = 0; answersArraysIndex < answersArrs.length; answersArraysIndex++) {
            let answersArray = answersArrs[answersArraysIndex];

            for (let index = 0; index < answersArray.length; index++) {
                let answer = answersArray[index]

                if (answer.isCorrect === true && answer.isSelected === true) {
                    setCorrectAnswersCount(prevCount => prevCount + 1)
                }
            }
        }
    }

    function playAgain() {
        setClicked(false)
        setCorrectAnswersCount(0)
        fetchData()
    }

    return (
        <div className='questions'>
            {isLoadedData ? <div className="questions--container">

                    <div className="questions--list">
                        {questionsAndAnswersArrays.map((question, answersArrIndex) =>
                            <Question
                                key={question.id}
                                answersArrIndex={answersArrIndex}
                                toggleAnswer={toggleAnswer}
                                question={question.question}
                                answers={answersArrs[answersArrIndex]}
                                buttonClicked={clicked}
                            />
                        )
                        }
                    </div>
                    <div className="questions--button buttons">
                        {clicked ?
                            <div className='buttons--container'>
                                <p className='questions--score'>You scored {correctAnswersCount}/{questions.length} correct
                                    answers</p>
                                <button onClick={() => playAgain()}>Play again</button>
                            </div>

                            :
                            <button
                                onClick={checkAnswers}
                            >Check answers
                            </button>}
                    </div>
                </div>
                :
                <p>Loading...</p>}

        </div>
    );
};

export default Questions;