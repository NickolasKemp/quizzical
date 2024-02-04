import './App.css';
import Start from "./components/Start";
import Questions from "./components/Questions";
import React, {useEffect, useState} from 'react'
import {nanoid} from "nanoid";
import {decode} from "html-entities";
import axios from 'axios'

function App() {
    const [questions, setQuestions] = useState([])

    const [startQuiz, setStartQuiz] = useState(false)

    const [answersArrs, setAnswersArrs] = useState(
        getArraysOfAnswers(questions)
    )

    const [questionsAndAnswersArrays, setQuestionsAndAnswersArrays] = useState(getQuestionsAndAnswersArrays(questions, answersArrs))

    const [isLoadedData, setIsLoadedData] = useState(false)

    function getArraysOfAnswers(questions) {

        let answersObjectsArr = []

        for (let index = 0; index < questions.length; index++) {
            let question = questions[index]

            const incorrectAnswers = question.incorrect_answers.map((answer) => (
                    {
                        id: nanoid(),
                        answerName: decode(answer),
                        isCorrect: false,
                        isSelected: false,
                        answersArrIndex: index
                    }
                )
            )

            const correctAnswers = {
                id: nanoid(),
                answerName: decode(question.correct_answer),
                isCorrect: true,
                isSelected: false,
                answersArrIndex: index
            }

            incorrectAnswers.push(correctAnswers)

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            shuffleArray(incorrectAnswers)
            answersObjectsArr.push(incorrectAnswers)


        }
        return answersObjectsArr
    }


    function getQuestionsAndAnswersArrays(questions, answersArrs) {
        return questions.map((question, index) => (
            {
                question: decode(question.question),
                answers: answersArrs[index],
                id: nanoid()
            }
        ))
    }

    let canMakeRequest = true

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (questions.length > 0) {
            setAnswersArrs(getArraysOfAnswers(questions));
            setQuestionsAndAnswersArrays(getQuestionsAndAnswersArrays(questions, answersArrs));
        }
    }, [questions]);


    async function fetchData() {
        setIsLoadedData(false)
        try {
            if (canMakeRequest) {
                const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple')
                setQuestions(response.data.results)
                setIsLoadedData(true)
            } else {
                console.log('Erorr...')
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('Too many requests. Wait for a few seconds')
                setIsLoadedData(false)
                setTimeout(async () => {
                    try {
                        setIsLoadedData(false)
                        const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple')
                        setQuestions(response.data.results)
                        setIsLoadedData(true)
                    } catch (error) {
                        console.log('Erorr')
                        setIsLoadedData(true)
                    }
                }, 4000)
            }
        }
    }

    function startQuizOnClick() {
        setStartQuiz(true)
    }

    return (
        <div className="App">
            {startQuiz ?
                <Questions
                    questions={questions}
                    setQuestions={setQuestions}
                    startQuizOnClick={startQuizOnClick}
                    answersArrs={answersArrs}
                    questionsAndAnswersArrays={questionsAndAnswersArrays}
                    setQuestionsAndAnswersArrays={setQuestionsAndAnswersArrays}
                    fetchData={fetchData}
                    setAnswersArrs={setAnswersArrs}
                    isLoadedData={isLoadedData}
                />
                :
                <Start
                    startQuizOnClick={() => startQuizOnClick()}
                />}

        </div>
    );
}

export default App;
