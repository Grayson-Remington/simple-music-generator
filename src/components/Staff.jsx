import React, { useState, useEffect, useRef } from "react";
import Note from "/assets/note.svg";
import FirstStaff from "/assets/startofstaff.svg";
import StaffLines from "/assets/lines.svg";
import trebledata from "../data/trebledata";
import bassdata from "../data/bassdata";
import classNames from "classnames";

// Create an onChange for each dropdown so that the values outside of the range are cutoff (ie: C3 is lower limit, so upper limit options would be D3 and above)

function Staff() {
  //States
  let [songlength, setSongLength] = useState(30);
  let [songpattern, setSongPattern] = useState([]);
  let [basspattern, setBassPattern] = useState([]);
  let [treblepattern, setTreblePattern] = useState([]);
  let [animationState, setAnimationState] = useState("paused");
  let [checked, setChecked] = useState(false);

  //useEffects
  const handleChange = () => {
    setChecked(!checked);
  };

  const viewportRef = useRef(null);

  const handleStartAnimation = () => {
    setAnimationState("running");
  };

  const handlePauseAnimation = () => {
    setAnimationState("paused");
  };
  const handleFrameReset = () => {
    viewportRef.current.scrollLeft = 0;
  };

  let animation;

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    if (animationState === "running") {
      viewportRef.current.focus();

      let timeout = setTimeout(() => {
        let currentPos = {
          x: viewport.scrollLeft,
        };

        animation = setInterval(() => {
          currentPos = {
            x: currentPos.x + 2,
          };
          viewport.scrollLeft = currentPos.x;
        }, 20);
        document.addEventListener("click", handleDocumentClick);
      }, 2000);

      return () => {
        clearInterval(animation), clearTimeout(timeout);
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [animationState]);

  const handleDocumentClick = (event) => {
    // Check if target element of click event is within the animated viewport

    clearInterval(animation);
    setAnimationState("paused");
    document.removeEventListener("click", handleDocumentClick);
  };

  const [trebleLowerLimit, setTrebleLowerLimit] = useState(0);
  const [trebleUpperLimit, setTrebleUpperLimit] = useState(16);
  const [localtrebleLowerLimit, setLocalTrebleLowerLimit] = useState(0);
  const [localtrebleUpperLimit, setLocalTrebleUpperLimit] = useState(16);
  const handleTrebleLowerLimitChange = (event) => {
    let choice = parseInt(event.target.value);
    setTrebleLowerLimit(choice);
    setLocalTrebleLowerLimit(choice);
    setLocalTrebleUpperLimit((localtrebleUpperLimit) => {
      const newValue = localtrebleLowerLimit + localtrebleUpperLimit - choice;
      return newValue;
    });
  };
  const handleTrebleUpperLimitChange = (event) => {
    let choice = parseInt(event.target.value);
    setTrebleUpperLimit(
      trebledata.length - trebleUpperLimitOptions.length + choice
    ); //
    setLocalTrebleUpperLimit(choice);
  };

  {
    /*  setLocalTrebleUpperLimit(localTrebleUpperLimit => {
    const newValue = trebledata.length - choice - localTrebleUpperLimit;
    return newValue;
  })
*/
  }
  const trebleOptions = trebledata.filter(
    (option, index) => index <= trebleUpperLimit && index >= trebleLowerLimit
  );

  const trebleLowerLimitOptions = trebledata.filter(
    (option, index) => index <= trebleUpperLimit
  ); //Match the option and select all options below the trebleUpperLimit

  const trebleUpperLimitOptions = trebledata.filter(
    (option, index) => index >= trebleLowerLimit
  );

  const [bassLowerLimit, setBassLowerLimit] = useState(0);
  const [bassUpperLimit, setBassUpperLimit] = useState(16);
  const [localBassLowerLimit, setLocalBassLowerLimit] = useState(0);
  const [localBassUpperLimit, setLocalBassUpperLimit] = useState(16);
  const handleBassLowerLimitChange = (event) => {
    let choice = parseInt(event.target.value);
    setBassLowerLimit(choice);
    setLocalBassLowerLimit(choice);
    setLocalBassUpperLimit((localbassUpperLimit) => {
      const newValue = localBassLowerLimit + localBassUpperLimit - choice;
      return newValue;
    });
  };
  const handleBassUpperLimitChange = (event) => {
    let choice = parseInt(event.target.value);
    setBassUpperLimit(bassdata.length - bassUpperLimitOptions.length + choice); //
    setLocalBassUpperLimit(choice);
  };

  {
    /*  setLocalTrebleUpperLimit(localTrebleUpperLimit => {
    const newValue = trebledata.length - choice - localTrebleUpperLimit;
    return newValue;
  })
*/
  }
  const bassOptions = bassdata.filter(
    (option, index) => index <= bassUpperLimit && index >= bassLowerLimit
  );

  const bassLowerLimitOptions = bassdata.filter(
    (option, index) => index <= bassUpperLimit
  ); //Match the option and select all options below the trebleUpperLimit

  const bassUpperLimitOptions = bassdata.filter(
    (option, index) => index >= bassLowerLimit
  );

  //Set Treble Notes
  function SetTrebleNotes() {
    //What if I used slice here
    setTreblePattern((treblepattern = []));
    for (let i = 0; i < songlength; i++) {
      treblepattern.push(
        trebledata[
          Math.floor(
            Math.random() * (trebleUpperLimit - trebleLowerLimit + 1) +
              trebleLowerLimit
          )
        ]
      );
    }
    setTreblePattern(treblepattern);
  }
  //Set Bass Notes
  function SetBassNotes() {
    setBassPattern((basspattern = []));
    for (let i = 0; i < songlength; i++) {
      if (i % 4 === 0) {
        basspattern.push(
          bassdata[
            Math.floor(Math.random() * (bassUpperLimit - bassLowerLimit + 1)) +
              bassLowerLimit
          ]
        );
      } else {
        basspattern.push({});
      }
      setBassPattern(basspattern);
    }
  }

  // Merges the 2 objects (treble and bass) and then push them into the song array
  function NewSong() {
    SetTrebleNotes();
    SetBassNotes();
    setSongPattern((songpattern = []));

    for (let i = 0; i < songlength; i++) {
      let newObj = { ...treblepattern[i], ...basspattern[i] };
      songpattern.push(newObj);
    }
    setSongPattern(songpattern);
  }

  // Random Song
  function RandomSong() {
    setSongPattern((songpattern = []));
    for (let i = 0; i < songlength; i++) {
      songpattern.push(
        trebledata[Math.floor(Math.random() * trebledata.length)]
      );
    }
    setSongPattern(songpattern);
    SetBassNotes();
  }

  //RangeSlider

  return (
    <div className='large-container'>
      <div className='buttons'>
        <div>
          <h1>Set Lower Treble Limit</h1>
          <select
            id='lowerTrebleLimit'
            value={localtrebleLowerLimit}
            onChange={(event) => handleTrebleLowerLimitChange(event)}>
            {trebleLowerLimitOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.Trebleid.slice(-2)}
              </option>
            ))}
          </select>
          <h1>Set Upper Treble Limit</h1>
          <select
            id='upperTrebleLimit'
            value={localtrebleUpperLimit}
            onChange={(event) => handleTrebleUpperLimitChange(event)}>
            {trebleUpperLimitOptions.map((option, index) => (
              <option key={option.Trebleid} value={index}>
                {option.Trebleid.slice(-2)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h1>Set Lower Bass Limit</h1>
          <select
            id='lowerBassLimit'
            value={localBassLowerLimit}
            onChange={(event) => handleBassLowerLimitChange(event)}>
            {bassLowerLimitOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.Bassid.slice(-2)}
              </option>
            ))}
          </select>
          <h1>Set Upper Bass Limit</h1>
          <select
            id='upperBassLimit'
            value={localBassUpperLimit}
            onChange={(event) => handleBassUpperLimitChange(event)}>
            {bassUpperLimitOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.Bassid.slice(-2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          Hints:
          <input
            id='checkbox'
            type='checkbox'
            checked={checked}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <button type='button' onClick={() => NewSong()}>
          New Song
        </button>
        <button type='button' onClick={handleStartAnimation}>
          Start
        </button>
        <button type='button' onClick={handlePauseAnimation}>
          Stop
        </button>
        <button type='button' onClick={handleFrameReset}>
          Reset
        </button>
      </div>
      <div
        className='staff-container'
        style={{ overflow: "scroll" }}
        ref={viewportRef}
        tabIndex={0}>
        <img src={FirstStaff} alt='' className='grand-staff' />
        {songpattern.map((songpattern, index) => {
          return (
            <div className='note-container' key={index}>
              <img src={StaffLines} alt='' className='lines' />
              <div
                className={classNames("note", `${songpattern.Trebleid}-note`)}>
                <img src={Note} alt='' className={classNames("note-img")} />
                <h1 className='note-name'>
                  {checked &&
                    songpattern.Trebleid.slice(
                      songpattern.Trebleid.length - 2,
                      songpattern.Trebleid.length
                    )}
                </h1>
              </div>
              {songpattern.Bassid && (
                <div
                  className={classNames("note", `${songpattern.Bassid}-note`)}>
                  <img src={Note} alt='' className={classNames("note-img")} />
                  <h1 className='note-name'>
                    {checked &&
                      songpattern.Bassid.slice(
                        songpattern.Bassid.length - 2,
                        songpattern.Bassid.length
                      )}
                  </h1>
                </div>
              )}
              {/* Extra Bars */}
              <div
                className={classNames({
                  "treble-middle-c-bar":
                    songpattern.Trebleid === "TrebleA3" ||
                    songpattern.Trebleid === "TrebleC4" ||
                    songpattern.Trebleid === "TrebleB3" ||
                    songpattern.Trelbeid === "TrebleD4",
                })}></div>
              <div
                className={classNames({
                  "bass-middle-c-bar":
                    songpattern.Bassid === "BassC4" ||
                    songpattern.Bassid === "BassB3" ||
                    songpattern.Bassid === "BassD4",
                })}></div>
              <div
                className={classNames({
                  "a3-bar":
                    songpattern.Trebleid === "TrebleA3" ||
                    songpattern.id === "B2",
                })}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Staff;
