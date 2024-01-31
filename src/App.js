import './App.css';
import Start from "./components/Start";
import Questions from "./components/Questions";
import React, {useEffect, useState} from 'react'
import {nanoid} from "nanoid";
import {decode} from "html-entities";
import axios from 'axios'


//Добавить загрузки при перезагруке вопросов, поскольку они не успевают подгражаться при клике моментально
//Исправить несоответствие отвотов вопросам (приоритет 2)

function App() {

    const [questions, setQuestions] = React.useState([
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Television",
            "question": "In Battlestar Galactica (2004), what is the name of the President of the Twelve Colonies?",
            "correct_answer": "Laura Roslin",
            "incorrect_answers": [
                "William Adama",
                "Tricia Helfer",
                "Harry Stills"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "In the Nintendo DS game &#039;Ghost Trick: Phantom Detective&#039;, what is the name of the hitman seen at the start of the game?",
            "correct_answer": "Nearsighted Jeego",
            "incorrect_answers": [
                "One Step Ahead Tengo",
                "Missile",
                "Cabanela"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Celebrities",
            "question": "Nikki Diamond portrayed which Gladiator in the 1992 TV show &quot;Gladiators&quot;?",
            "correct_answer": "Scorpio",
            "incorrect_answers": [
                "Jet",
                "Nightshade",
                "Falcon"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Japanese Anime &amp; Manga",
            "question": "In the first episode of Yu-Gi-Oh: Duel Monsters, what book is Seto Kaiba seen reading at Domino High School?",
            "correct_answer": "Thus Spoke Zarathustra",
            "incorrect_answers": [
                "Beyond Good and Evil",
                "The Republic",
                "Meditations"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What is the currency of Poland?",
            "correct_answer": "Z\u0142oty",
            "incorrect_answers": [
                "Ruble",
                "Euro",
                "Krone"
            ]
        }
    ])

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
                        answerName: answer,
                        isCorrect: false,
                        isSelected: false,
                        answersArrIndex: index
                    }
                )
            )

            const correctAnswers = {
                id: nanoid(),
                answerName: question.correct_answer,
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
                answers: answersArrs[index].map(answer => {
                    return {...answer, answerName: decode(answer.answerName)}
                }),
                id: nanoid()
            }
        ))
    }


    async function fetchData() {
        console.log('fetching...')
        const response = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple')
        console.log('fetched')
        setQuestions(response.data.results)
        setAnswersArrs(getArraysOfAnswers(questions))
        setQuestionsAndAnswersArrays(getQuestionsAndAnswersArrays(questions, answersArrs))
        console.log(response.data.results)
        console.log(answersArrs)
        setIsLoadedData(true)
        console.log(isLoadedData)


    }

    useEffect(() => {
    }, []);

    function startQuizOnClick() {
        fetchData()
        setIsLoadedData(true)

        // console.log(isLoadedData)

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

                /> :
                <Start
                    startQuizOnClick={() => startQuizOnClick()}
                />}

        </div>
    );
}

export default App;
