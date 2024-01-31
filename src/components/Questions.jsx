import React, {useEffect, useState} from 'react';
import Question from "./Question";
import {nanoid} from 'nanoid'
import {decode} from 'html-entities';
import axios from 'axios'


const Questions = ({questions, setQuestions, answersArrs, setAnswersArrs, questionsAndAnswersArrays, setQuestionsAndAnswersArrays, fetchData}) => {


    const [loading, setLoading] = useState(true)

    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [clicked, setClicked] = useState(false)




        // try {
        //     const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
        //     console.log(response.data.results)
        //     setQuestions(response.data.results)
        //     setAnswersArrs(getArraysOfAnswers(questions))
        //     setQuestionsAndAnswersArrays(getQuestionsAndAnswersArrays(questions, answersArrs))
        // } catch (error) {
        //     if (error.response && error.response.status === 429) {
        //         // Retry the request after a delay using exponential backoff
        //         const delay = Math.pow(2, error.response.headers['retry-after'] || 5) * 100;
        //         await new Promise(resolve => setTimeout(resolve, delay));
        //         return fetchData();
        //     }
        // }



    useEffect(() => {
// fetchData()
    }, []);

    // console.log(answersArrs)

    // if (loading) {
    //     return <p>loading...</p>
    // }



    // console.log(questionsAndAnswersArrays)

    function toggleAnswer(event, answersArrIndex) {
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
            <div className="questions--container">
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
                    )}
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
        </div>
    );
};

export default Questions;