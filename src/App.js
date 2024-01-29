import './App.css';
import Start from "./components/Start";
import Questions from "./components/Questions";
import {useState} from 'react'


//Добавить загрузки при перезагруке вопросов, поскольку они не успевают подгражаться при клике моментально
//Исправить несоответствие отвотов вопросам (приоритет 2)

function App() {

    const [startQuiz, setStartQuiz] = useState(false)

    function startQuizOnClick() {
        setStartQuiz(true)
    }

    return (
        <div className="App">

            {startQuiz ?
                <Questions/> :
                <Start
                    startQuizOnClick={startQuizOnClick}
                />}
        </div>
    );
}

export default App;
