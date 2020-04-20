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
  const [answers,setAnswers]=useState({});
  const [currentAnswer,setCurrentAnswer]=useState('')
  const [maxInQueue,setMaxInQueue]=useState(3) //will only ask you this many at a time
  const [correctPct,setCorrectPct]=useState(50) //if you get an answer correct this % or more of the time, it will stop asking you about it
  const [cityCountyBoth,setCityCountyBoth]=useState('Both') //select whether you want only city areas, only county areas, or both
  const [correctMin,setCorrectMin]=useState(2)
  const [inQueue,setInQueue]=useState([])
  document.addEventListener('setName',(e)=>{
    // console.log(e); //todo this keeps firing multiple times per click
    (e.detail && e.detail.length>0) ? setCurrentName(e.detail) : setCurrentName('UNINCORPORATED')
  })
  function updateAnswerQueue(a) {
    function getPct(ans) {
      if(a[ans].right==0 && a[ans].wrong==0) return 0;
      const pct=(a[ans].right/(a[ans].wrong + a[ans].right))*100
      return pct
    }
    function lessThanMin(ans) {
      console.log('less than min: ',a[ans].right <= correctMin,' ans: ',ans,'a: ',a,'min: ',correctMin)
      return a[ans].right < correctMin
    }
    console.log('correctMin:',correctMin)
    const eligible=Object.keys(a).filter(ans=>{
      if(lessThanMin(ans)) return true;
      else if(getPct(ans) < correctPct) return true;
      else return false;
    } )
    console.log('inQueue:',eligible,'a: ',a)
    setInQueue(eligible)
  }
  function checkAnswer() {
    function newAnswer(right) {
      return {
        right: right ? 1:0,
        wrong: right ? 0:1
      }
    }
    function updateAnswer(cn,right) {
      console.log('updating: ',cn, 'to: ',answers)
      answers[cn][right ? 'right':'wrong'] += 1
      return answers[cn]
    }

    setCheckingAnswer(true)
    const isRight =currentName.toLowerCase().replace(/\W/g,'')==currentAnswer.toLowerCase().replace(/\W/g,'')
    setIsAnswerRight(isRight)
    const a={...answers,[currentName]: answers[currentName] !== undefined ?  updateAnswer(currentName,isRight) : newAnswer(isRight)}
    setAnswers(a)
    updateAnswerQueue(a)
  }
  function startGame() {
    setGameStarted(true)
    getNext()
  }
  function getNext() {
    const event=new CustomEvent('getNext',{
      detail:{
        inQueue: currentName=='' ? inQueue : Array.from(new Set([...inQueue,currentName])),
        maxInQueue}
    })
    document.dispatchEvent(event)
    setIsAnswerRight(null)
    setCheckingAnswer(false)
    setCurrentAnswer('')
  }
  function handleCityCountyBothChange(e) {
    setCityCountyBoth(e.target.value)
    const event=new CustomEvent('setCityCountyBoth',{
      detail:e.target.value
    })
    document.dispatchEvent(event)
  }
  
  return (
    <div id="app">
      <div id="form">
        <h1>Learn the Lou</h1>
        {!gameStarted && <button className="centered" onClick={startGame}>Start</button>}
        {gameStarted &&
        <div className="centered question">
          <label htmlFor="yourAnswer">What is the name of the area shown below?</label><input disabled={checkingAnswer} value={currentAnswer} onChange={e=>setCurrentAnswer(e.target.value)} />
          {checkingAnswer ? 
            <button onClick={getNext}>Next</button>
            :
            <button onClick={checkAnswer}>Submit</button>
          }
          {isAnswerRight !== null &&
            <h3>{isAnswerRight ? `You're correct!`:`Sorry, the answer was ${currentName}`}</h3>
          }
          <details>
            <summary>Correct: {Object.keys(answers).reduce((accum,curr)=>answers[curr].right+accum,0)}, Incorrect: {Object.keys(answers).reduce((accum,curr)=>answers[curr].wrong+accum,0)}</summary>
              <table className="centered">
                <thead>
                  <tr>
                    <th>Answer</th><th>Correct</th><th>Incorrect</th><th>In the Deck?</th>
                  </tr>
                </thead>
                <tbody>
                {Object.keys(answers).map(ans=>
                    <tr key={ans}>
                      <td>{ans}</td><td>{answers[ans].right}</td><td>{answers[ans].wrong}</td><td>{inQueue.includes(ans) ? 'Yes':'No'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
          </details>
        </div>
        }
        <hr />
        <details className="centered">
            <summary>Options</summary>
            <label htmlFor="cityCountyBoth">Areas to draw from:</label><br />
            <select value={cityCountyBoth} onChange={handleCityCountyBothChange} id="cityCountyBoth">
              <option>City</option>
              <option>County</option>
              <option>Both</option>
            </select><br />
            <label htmlFor="maxInQueue">Max to draw from at a time:</label>
            <input value={maxInQueue} onChange={e=>setMaxInQueue(e.target.value)} id="maxInQueue" min="2" max="100" type="number" /><br />
            <label htmlFor="correctPct">
              Stop asking about an area when you correctly answer it <input value={correctPct} min="1" max="100" onChange={e=>setCorrectPct(e.target.value)} id="correctPct" type="number" />% of the time&nbsp;
              </label>
              <label htmlFor="correctMin">after at least <input min="1" max="100" id="correctMin" value={correctMin} onChange={e=>setCorrectMin(e.target.value)} type="number"></input> correct answers.
            </label>
        </details>
        </div>
      <BingMap cityCountyBoth={cityCountyBoth}></BingMap>
    </div>
  )
}

export default App
