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
  let currentAnswer=''
  document.addEventListener('setName',(e)=>{
    console.log(e)
    setCurrentName(e.detail)
  })
  function checkAnswer() {
    setCheckingAnswer(true)
    setIsAnswerRight(currentName.toLowerCase().replace(/\W/g,'')==currentAnswer.toLowerCase().replace(/\W/g,''))
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
  }

  function handleChange(e) {
    currentAnswer=e.target.value
  }
  
  return (
    <div id="app">
      <div id="form">
        <h1>The Lou Quiz</h1>
        {!gameStarted && <button className="centered" onClick={startGame}>Start</button>}
        {gameStarted &&
        <div className="centered question">
          <label htmlFor="yourAnswer">What is the name of the area shown below?</label><input onChange={handleChange} />{currentName}
          {checkingAnswer ? 
            <button onClick={getNext}>Next</button>
            :
            <button onClick={checkAnswer}>Submit</button>
          }
          {isAnswerRight !== null &&
            <h3>{isAnswerRight ? `You're correct!`:`Sorry, the answer was ${currentName}`}</h3>
          }
        </div>
        }
        </div>
      <BingMap></BingMap>
    </div>
  )
}

export default App
