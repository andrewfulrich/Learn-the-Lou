import React, { useState } from 'react'
import { Controls, Map, Popup, LayerPanel, loadDataLayer } from '@bayer/ol-kit'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olExtent from 'ol/extent'
import olProj from 'ol/proj';
import olMap from 'ol/map'
import olView from 'ol/view'
import TileLayer from 'ol/layer/tile';
import BingMaps from 'ol/source/bingmaps';
import OSM from 'ol/source/osm';
import BingMap from './BingMap'
function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const [checkingAnswer,setCheckingAnswer] = useState(false);
  const [isAnswerRight,setIsAnswerRight] = useState(null);
  const [correctAnswerCount,setCorrectAnswerCount]=useState(0);
  const [incorrectAnswerCount,setIncorrectAnswerCount]=useState(0);
  const [currentAnswer,setCurrentAnswer]=useState('')
  document.addEventListener('setName',(e)=>{
    console.log(e)
    setCurrentName(e.detail)
  })
  function checkAnswer() {
    setCheckingAnswer(true)
    const isRight =currentName.toLowerCase().replace(/\W/g,'')==currentAnswer.toLowerCase().replace(/\W/g,'')
    setIsAnswerRight(isRight)
    isRight ? setCorrectAnswerCount(correctAnswerCount+1) : setIncorrectAnswerCount(incorrectAnswerCount+1)
  }
  function startGame() {
    setGameStarted(true)
    getNext()
  }
  function getNext() {
    const event=new CustomEvent('getNext',{
      //no metadata
    })
    document.dispatchEvent(event)
    setIsAnswerRight(null)
    setCheckingAnswer(false)
    setCurrentAnswer('')
  }
  
  return (
    <div id="app">
      <div id="form">
        <h1>The Lou Quiz</h1>
        {!gameStarted && <button className="centered" onClick={startGame}>Start</button>}
        {gameStarted &&
        <div className="centered question">
          <label htmlFor="yourAnswer">What is the name of the area shown below?</label><input value={currentAnswer} onChange={e=>setCurrentAnswer(e.target.value)} />
          {checkingAnswer ? 
            <button onClick={getNext}>Next</button>
            :
            <button onClick={checkAnswer}>Submit</button>
          }
          {isAnswerRight !== null &&
            <h3>{isAnswerRight ? `You're correct!`:`Sorry, the answer was ${currentName}`}</h3>
          }
          <table className="centered">
            <thead>
              <tr>
                <th>Correct Answers</th><th>incorrect Answers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{correctAnswerCount}</td><td>{incorrectAnswerCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        }
        </div>
      <BingMap></BingMap>
    </div>
  )
}

export default App
