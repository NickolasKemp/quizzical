import React, {useEffect} from 'react';
import Question from "./Question";
import {nanoid} from 'nanoid'
import {decode} from 'html-entities';

const Questions = () => {

    const [questions, setQuestions] = React.useState([
        {
            "type":"multiple",
            "difficulty":"medium",
            "category":"Entertainment: Television",
            "question":"In Battlestar Galactica (2004), what is the name of the President of the Twelve Colonies?",
            "correct_answer":"Laura Roslin",
            "incorrect_answers":[
                "William Adama",
                "Tricia Helfer",
                "Harry Stills"
            ]
        },
        {
            "type":"multiple",
            "difficulty":"easy",
            "category":"Entertainment: Video Games",
            "question":"In the Nintendo DS game &#039;Ghost Trick: Phantom Detective&#039;, what is the name of the hitman seen at the start of the game?",
            "correct_answer":"Nearsighted Jeego",
            "incorrect_answers":[
                "One Step Ahead Tengo",
                "Missile",
                "Cabanela"
            ]
        },
        {
            "type":"multiple",
            "difficulty":"medium",
            "category":"Celebrities",
            "question":"Nikki Diamond portrayed which Gladiator in the 1992 TV show &quot;Gladiators&quot;?",
            "correct_answer":"Scorpio",
            "incorrect_answers":[
                "Jet",
                "Nightshade",
                "Falcon"
            ]
        },
        {
            "type":"multiple",
            "difficulty":"hard",
            "category":"Entertainment: Japanese Anime &amp; Manga",
            "question":"In the first episode of Yu-Gi-Oh: Duel Monsters, what book is Seto Kaiba seen reading at Domino High School?",
            "correct_answer":"Thus Spoke Zarathustra",
            "incorrect_answers":[
                "Beyond Good and Evil",
                "The Republic",
                "Meditations"
            ]
        },
        {
            "type":"multiple",
            "difficulty":"medium",
            "category":"General Knowledge",
            "question":"What is the currency of Poland?",
            "correct_answer":"Z\u0142oty",
            "incorrect_answers":[
                "Ruble",
                "Euro",
                "Krone"
            ]
        }
    ])
    const [loading, setLoading] = React.useState(true)
    const [answersArrs, setAnswersArrs] = React.useState(
        getArraysOfAnswers(questions)
    )
    const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0)
    const [clicked, setClicked] = React.useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
                if (!res.ok) {
                    throw new Error(`HTTP error: ${res.status}`);
                }
                const data = await res.json();
                setQuestions(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [clicked===true]);

    const someText = "In &quot;A Certain Scientific Railgun&quot;, how many &quot;sisters&quot; did Accelerator have to kill to achieve the rumored level 6?"
    const decodedString = decode(someText);

    useEffect(() => {

        // const entities = new AllHtmlEntities();


    }, [])

    console.log(answersArrs)

    if(loading) {
        return <p>loading...</p>
    }

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
                answers: answersArrs[index].map(answer => { return {...answer, answerName: decode(answer.answerName)  } }),
                id: nanoid()
            }
        ))
    }

    const questionsAndAnswersArrays = getQuestionsAndAnswersArrays(questions, answersArrs)

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
        setAnswersArrs(getArraysOfAnswers(questions))

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
                            answers={question.answers}
                            buttonClicked={clicked}
                        />
                    )}
                </div>
                <div className="questions--button buttons">
                    {clicked ?
                        <div className='buttons--container'>
                            <p className='questions--score'>You scored {correctAnswersCount}/{questions.length} correct
                                answers</p>
                            <button onClick={playAgain}>Play again</button>
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