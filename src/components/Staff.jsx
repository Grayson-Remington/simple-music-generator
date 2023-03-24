import React, { useState, useEffect, useRef } from 'react';
import Note from '/assets/note.svg';
import FirstStaff from '/assets/startofstaff.svg';
import StaffLines from '/assets/lines.svg';
import trebledata from '../data/trebledata';
import bassdata from '../data/bassdata';
import classNames from 'classnames';
import { WebMidi } from 'webmidi';
import { debounce } from 'lodash';
import JZZ from 'jzz';

// Create an onChange for each dropdown so that the values outside of the range are cutoff (ie: C3 is lower limit, so upper limit options would be D3 and above)

function Staff() {
	//States
	let [songlength, setSongLength] = useState(300);
	let [songpattern, setSongPattern] = useState([]);
	let [basspattern, setBassPattern] = useState([]);
	let [treblepattern, setTreblePattern] = useState([]);
	let [animationState, setAnimationState] = useState('paused');
	let [checked, setChecked] = useState(false);
	let [showSettings, setShowSettings] = useState(false);
	let [speed, setSpeed] = useState(1.0);
	let [score, setScore] = useState(0);
	let [notesToPlay, setNotesToPlay] = useState([]);
	let [notesPressed, setNotesPressed] = useState([]);
	let [startingId, setStartingId] = useState(-1);
	let [endingId, setEndingId] = useState(-1);
	let [idsToPlay, setIdsToPlay] = useState([]);

	//useEffects
	const handleChange = () => {
		setChecked(!checked);
	};

	const viewportRef = useRef(null);

	const handleStartAnimation = () => {
		setAnimationState('running');
	};

	const handlePauseAnimation = () => {
		setAnimationState('paused');
	};
	const handleFrameReset = () => {
		startingId = -1;
		endingId = -1;
		idsToPlay = [];
		notesToPlay = [];
		setAnimationState('paused');

		notecontainerscorrect.forEach((element) => {
			element.classList.remove('show');
		});
		notecontainerswrong.forEach((element) => {
			element.classList.remove('show');
		});
	};
	const handleBackToStart = () => {
		setAnimationState('paused');
		viewportRef.current.scrollLeft = 0;
	};
	let notecontainerscorrect = document.querySelectorAll('.correct');
	let notecontainerswrong = document.querySelectorAll('.wrong');

	let animation;
	let previousviewport = -1;
	let newNotesToPlay;

	useEffect(() => {
		const viewport = viewportRef.current;

		if (!viewport) return;

		if (animationState === 'running') {
			viewportRef.current.focus();

			let timeout = setTimeout(() => {
				let currentPos = {
					x: viewport.scrollLeft,
				};

				animation = setInterval(() => {
					previousviewport = viewport.scrollLeft;
					currentPos = {
						x: currentPos.x + speed,
					};
					viewport.scrollLeft = currentPos.x;

					//elements

					const targetBox =
						document.getElementsByClassName('target-box');
					const rectTargetBox = targetBox[0].getBoundingClientRect();
					const element1 = document.elementsFromPoint(
						window.innerWidth -
							window.innerWidth / 2 -
							rectTargetBox.width / 2 -
							100,
						window.innerHeight - window.innerHeight / 2
					);
					const element2 = document.elementsFromPoint(
						window.innerWidth -
							window.innerWidth / 2 +
							rectTargetBox.width / 2 +
							100,
						window.innerHeight - window.innerHeight / 2
					);

					const rect1 = element1[0].getBoundingClientRect();
					const rect2 = element2[0].getBoundingClientRect();

					// SET UP 2 TARGET POINTS ON EACH SIDE OF THE RED BOX TO IDENTIFY AND CHANGE THE DATA VALUE ACCORDINGLY.
					// Read the class name and store it to identify which notes need to be pressed
					// If pressed note is same as stored note, set data value to correct
					// If pressed note is wrong, set data value to incorrect

					//functions

					const targetItem1 = element1.find(
						(item) => item.className === 'note-container'
					);
					const targetItem2 = element2.find(
						(item) => item.className === 'note-container'
					);

					const targetItem2id = parseInt(
						targetItem2.getAttribute('id')
					);
					const noteDivs2 = targetItem2.querySelectorAll('.note');
					let targetcontainer =
						document.getElementsByClassName('note-container')[
							idsToPlay[0]
						];

					//When note is pressed, if the note that is pressed is in the notestoplay[0] slot, remove first note.
					if (
						notesPressed.length > 0 &&
						idsToPlay.length > 0 &&
						targetcontainer !== undefined &&
						idsToPlay[0] < idsToPlay[idsToPlay.length - 1]
					) {
						if (
							notesToPlay.indexOf(notesPressed[0]) <
								idsToPlay.indexOf(
									parseInt(targetcontainer.id) + 1
								) &&
							notesToPlay.includes(notesPressed[0])
						) {
							//If notesToPlay.indexOf(notesPressed[0]) === (idsToPlay.indexOf(targetcontainer.id + 1) -1 )
							targetcontainer
								.querySelectorAll('.correct')[0]
								.classList.add('show');

							notesToPlay.splice(
								notesToPlay.indexOf(notesPressed[0]),
								1
							);

							idsToPlay.splice(
								idsToPlay.indexOf(parseInt(targetcontainer.id)),
								1
							);

							notesPressed.splice(
								notesPressed.indexOf(notesPressed[0]),
								1
							);
						} else {
							targetcontainer
								.querySelectorAll('.wrong')[0]
								.classList.add('show');
							console.log(notesToPlay);
							console.log(idsToPlay);
							console.log(notesPressed);
							notesToPlay.splice(
								0,
								idsToPlay.indexOf(
									parseInt(targetcontainer.id) + 1
								)
							);

							idsToPlay.splice(
								0,
								idsToPlay.indexOf(
									parseInt(targetcontainer.id) + 1
								)
							);

							notesPressed.splice(
								notesPressed.indexOf(notesPressed[0]),
								1
							);
						}
					}
					//If note that is pressed is equal to the note to play, change note-container value to corrrect and add 1 to score.

					//If note that is pressed is not equal to the note to play, change note-container value to wrong and remove 1 to score.

					// We use idstoplay[0] to change the wrong/correct note container, dependent of if notesPressed[0] == notestoPlay[0]

					if (
						targetItem2id > endingId &&
						idsToPlay[idsToPlay.length - 1] !== targetItem2id
					) {
						endingId = targetItem2id;

						noteDivs2.forEach((noteDiv) => {
							// do something with each note div
							idsToPlay.push(targetItem2id);
							notesToPlay.push(
								noteDiv.classList[1].slice(-7, -5)
							);
						});
					}
					const targetItem1id = parseInt(
						targetItem1.getAttribute('id')
					);
					if (targetItem1id > startingId) {
						startingId = targetItem1id;
					}

					if (
						targetcontainer.id == startingId &&
						idsToPlay[0] == startingId
					) {
						targetcontainer
							.querySelectorAll('.wrong')[0]
							.classList.add('show');
						console.log('isfired');
						notesToPlay.splice(
							0,
							idsToPlay.indexOf(parseInt(targetcontainer.id) + 1)
						);

						idsToPlay.splice(
							0,
							idsToPlay.indexOf(parseInt(targetcontainer.id) + 1)
						);

						setAnimationState('paused');
					}

					if (
						viewport.scrollLeft ===
						viewport.scrollWidth - viewport.clientWidth
					) {
						setAnimationState('paused');
					}
				}, 2);

				document.addEventListener('click', handleDocumentClick);
			}, 0);
			// If note is past the red line, add class. If note is pressed, remove class,
			// if note passes left line and class still active, set extra class.

			return () => {
				clearInterval(animation), clearTimeout(timeout);
				document.removeEventListener('click', handleDocumentClick);
			};
		}
	}, [animationState]);

	const handleDocumentClick = (event) => {
		// Check if target element of click event is within the animated viewport

		clearInterval(animation);
		setAnimationState('paused');
		document.removeEventListener('click', handleDocumentClick);
	};

	const [trebleLowerLimit, setTrebleLowerLimit] = useState(0);
	const [trebleUpperLimit, setTrebleUpperLimit] = useState(16);
	const [localtrebleLowerLimit, setLocalTrebleLowerLimit] = useState(0);
	const [localtrebleUpperLimit, setLocalTrebleUpperLimit] = useState(16);

	const handleTrebleLowerLimitChange = (event, index) => {
		let choice = parseInt(event.target.value);

		setLocalTrebleLowerLimit(choice);
	};
	const handleTrebleUpperLimitChange = (event, index) => {
		let choice = parseInt(event.target.value);
		//
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
		(option, index) =>
			index <= trebleUpperLimit && index >= trebleLowerLimit
	);

	const trebleLowerLimitOptions = trebledata.filter(
		(option, index) =>
			index >= trebleLowerLimit && index <= localtrebleUpperLimit
	); //Match the option and select all options below the trebleUpperLimit

	const trebleUpperLimitOptions = trebledata.filter(
		(option, index) =>
			index >= localtrebleLowerLimit && index <= trebleUpperLimit
	);

	const [bassLowerLimit, setBassLowerLimit] = useState(0);
	const [bassUpperLimit, setBassUpperLimit] = useState(16);
	const [localBassLowerLimit, setLocalBassLowerLimit] = useState(0);
	const [localBassUpperLimit, setLocalBassUpperLimit] = useState(16);
	const handleBassLowerLimitChange = (event) => {
		let choice = parseInt(event.target.value);
		setBassLowerLimit(choice);
		setLocalBassLowerLimit(choice);
		setLocalBassUpperLimit(() => {
			const newValue = localBassLowerLimit + localBassUpperLimit - choice;
			return newValue;
		});
	};
	const handleBassUpperLimitChange = (event) => {
		let choice = parseInt(event.target.value);
		setBassUpperLimit(
			bassdata.length - bassUpperLimitOptions.length + choice
		); //
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

	function RandomTrebleNotes() {
		for (let i = 0; i < songlength; i++) {
			treblepattern.push(
				trebledata[
					Math.floor(
						Math.random() *
							(localtrebleUpperLimit -
								localtrebleLowerLimit +
								1) +
							localtrebleLowerLimit
					)
				]
			);
		}
	}
	function SimpleArpeggios() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 2]);
				treblepattern.push(trebledata[index + 4]);
				treblepattern.push(trebledata[index + 7]);
				treblepattern.push(trebledata[index + 4]);
				treblepattern.push(trebledata[index + 2]);
			}
		}
	}
	function FiveFinger1() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 2]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 3]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 4]);
			}
		}
	}
	function FiveFinger2() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 2]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 3]);
			}
		}
	}
	function FiveFinger3() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 2]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 2]);
			}
		}
	}
	function FiveFinger4() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 3]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 2]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 1]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index + 1]);
			}
		}
	}
	function FiveFinger5() {
		for (let i = 0; i < songlength; i++) {
			for (let j = 0; j < 2; j++) {
				let index = Math.floor(
					Math.random() *
						(localtrebleUpperLimit - localtrebleLowerLimit + 1) +
						localtrebleLowerLimit
				);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 4]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 3]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 2]);
				treblepattern.push(trebledata[index]);
				treblepattern.push(trebledata[index - 1]);
			}
		}
	}
	//Set Treble Notes
	function SetTrebleNotes() {
		//What if I used slice here

		setTreblePattern((treblepattern = []));

		handleRunTrebleFunction();

		setTreblePattern(treblepattern);
	}
	//Set Bass Notes
	function SetBassNotes() {
		setBassPattern((basspattern = []));
		for (let i = 0; i < songlength; i++) {
			if (i % 6 === 0) {
				basspattern.push(bassdata[treblepattern[i].id + 5]);
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

	//RangeSlider

	const [selectedTrebleFunction, setSelectedTrebleFunction] =
		useState('RandomTrebleNotes');

	const trebleFunctionList = [
		{ value: 'RandomTrebleNotes', label: 'Random Treble Notes' },
		{ value: 'SimpleArpeggios', label: 'Simple Arpeggios' },
		{ value: 'FiveFinger1', label: 'Five Finger 1' },
		{ value: 'FiveFinger2', label: 'Five Finger 2' },
		{ value: 'FiveFinger3', label: 'Five Finger 3' },
		{ value: 'FiveFinger4', label: 'Five Finger 4' },
		{ value: 'FiveFinger5', label: 'Five Finger 5' },
	];
	function handleTrebleFunctionChange(event) {
		setSelectedTrebleFunction(event.target.value);

		switch (event.target.value) {
			case 'RandomTrebleNotes':
				setTrebleLowerLimit(0);

				setTrebleUpperLimit(16);
				break;
			case 'SimpleArpeggios':
				setTrebleLowerLimit(0);

				setTrebleUpperLimit(9);
				if (localtrebleUpperLimit > 9) {
					setLocalTrebleUpperLimit(9);
				}
				break;
			case 'FiveFinger1':
				setTrebleLowerLimit(0);

				setTrebleUpperLimit(12);
				if (localtrebleUpperLimit > 12) {
					setLocalTrebleUpperLimit(12);
				}
				break;
			case 'FiveFinger2':
				setTrebleLowerLimit(1);
				setLocalTrebleLowerLimit(1);
				setTrebleUpperLimit(13);
				if (localtrebleUpperLimit < 1) {
					setLocalTrebleUpperLimit(1);
				}
				if (localtrebleUpperLimit > 13) {
					setLocalTrebleUpperLimit(13);
				}
				break;
			case 'FiveFinger3':
				setTrebleLowerLimit(2);
				setLocalTrebleLowerLimit(2);
				setTrebleUpperLimit(14);
				if (localtrebleUpperLimit < 2) {
					setLocalTrebleUpperLimit(2);
				}
				if (localtrebleUpperLimit > 14) {
					setLocalTrebleUpperLimit(14);
				}
				break;
			case 'FiveFinger4':
				setTrebleLowerLimit(3);
				setLocalTrebleLowerLimit(3);
				setTrebleUpperLimit(15);
				if (localtrebleUpperLimit < 3) {
					setLocalTrebleUpperLimit(3);
				}
				if (localtrebleUpperLimit > 15) {
					setLocalTrebleUpperLimit(15);
				}
				break;
			case 'FiveFinger5':
				setTrebleLowerLimit(4);
				setLocalTrebleLowerLimit(4);
				setTrebleUpperLimit(16);
				if (localtrebleUpperLimit < 4) {
					setLocalTrebleUpperLimit(4);
				}
				if (localtrebleUpperLimit > 16) {
					setLocalTrebleUpperLimit(16);
				}
				break;
			default:
				break;
		}
	}
	function handleRunTrebleFunction() {
		switch (selectedTrebleFunction) {
			case 'RandomTrebleNotes':
				RandomTrebleNotes();
				break;
			case 'SimpleArpeggios':
				SimpleArpeggios();
				break;
			case 'FiveFinger1':
				FiveFinger1();
				break;
			case 'FiveFinger2':
				FiveFinger2();
				break;
			case 'FiveFinger3':
				FiveFinger3();
				break;
			case 'FiveFinger4':
				FiveFinger4();
				break;
			case 'FiveFinger5':
				FiveFinger5();
				break;
			default:
				break;
		}
	}

	WebMidi.enable((err) => {});
	setTimeout(() => {
		//IMPORTANT!!! ADD a listener for for note-container with the id at idstoPlay[0] and then set the correct/false

		//When note is pressed, if the note that is pressed is in the first notes to play slot, remove first note.

		//If note that is pressed is equal to the note to play, change note-container value to corrrect and add 1 to score.

		//If note that is pressed is not equal to the note to play, change note-container value to wrong and remove 1 to score.

		// We use idstoplay[0] to change the wrong/correct note container, dependent of if notesPressed[0] == notestoPlay[0]
		WebMidi.inputs[0].addListener('noteon', (e) => {
			setAnimationState('running');

			if (!notesPressed.includes(`${e.note.name}${e.note.octave}`)) {
				notesPressed.push(`${e.note.name}${e.note.octave}`);
			}

			// Remove the event listener after the first note is detected
		});

		WebMidi.inputs[0].addListener('noteoff', (e) => {
			var index = notesPressed.indexOf(`${e.note.name}${e.note.octave}`);
			if (index > -1) {
				notesPressed.splice(index, 1);
			}
		});
	}, 2000);

	// If note is past the red line, add class. If note is pressed, remove class,
	// if note passes left line and class still active, set extra class.

	return (
		<>
			<h1 className='score'>{score}</h1>
			{showSettings && (
				<div className='settings'>
					<div className='settings-limit'>
						<h1 className='limits-text'>Song Length:</h1>
						<input
							className='songlength-input'
							type='number'
							onChange={(e) => setSongLength(e.target.value)}
							value={songlength}
						/>
					</div>
					<div className='settings-limit'>
						<h1 className='limits-text'>Speed:</h1>
						<input
							className='songlength-input'
							type='range'
							min='0.2'
							max='1.5'
							step='0.01'
							onChange={(e) => {
								setSpeed(parseFloat(e.target.value));
							}}
							value={speed}
						/>
					</div>
					<div className='settings-limit'>
						<h1
							className='limits-text'
							htmlFor='treble-function-select'
						>
							Select a Treble function:
						</h1>
						<select
							id='treble-function-select'
							value={selectedTrebleFunction}
							onChange={(event, index) =>
								handleTrebleFunctionChange(event, index)
							}
						>
							{trebleFunctionList.map((option, index) => (
								<option
									key={option.value}
									value={option.value}
									index={index}
								>
									{option.label}
								</option>
							))}
						</select>
					</div>
					<div className='settings-limit'>
						<h1 className='limits-text'>Set Lower Treble Limit:</h1>
						<select
							id='lowerTrebleLimit'
							value={localtrebleLowerLimit}
							onChange={(event, index) =>
								handleTrebleLowerLimitChange(event, index)
							}
						>
							{trebleLowerLimitOptions.map((option, index) => (
								<option
									key={option.Trebleid}
									value={option.id}
									index={index}
								>
									{option.Trebleid.slice(-2)}
								</option>
							))}
						</select>
					</div>
					<div className='settings-limit'>
						<h1 className='limits-text'>Set Upper Treble Limit:</h1>
						<select
							id='upperTrebleLimit'
							value={localtrebleUpperLimit}
							onChange={(event) =>
								handleTrebleUpperLimitChange(event)
							}
						>
							{trebleUpperLimitOptions.map((option, index) => (
								<option
									key={option.Trebleid}
									value={option.id}
								>
									{option.Trebleid.slice(-2)}
								</option>
							))}
						</select>
					</div>
					<div className='settings-limit'>
						<h1 className='limits-text'>Set Lower Bass Limit:</h1>
						<select
							id='lowerBassLimit'
							value={localBassLowerLimit}
							onChange={(event) =>
								handleBassLowerLimitChange(event)
							}
						>
							{bassLowerLimitOptions.map((option, index) => (
								<option
									key={index}
									value={index}
								>
									{option.Bassid.slice(-2)}
								</option>
							))}
						</select>
					</div>
					<div className='settings-limit'>
						<h1 className='limits-text'>Set Upper Bass Limit:</h1>
						<select
							id='upperBassLimit'
							value={localBassUpperLimit}
							onChange={(event) =>
								handleBassUpperLimitChange(event)
							}
						>
							{bassUpperLimitOptions.map((option, index) => (
								<option
									key={index}
									value={index}
								>
									{option.Bassid.slice(-2)}
								</option>
							))}
						</select>
					</div>
				</div>
			)}
			<button
				className='settings-button'
				onClick={() => setShowSettings(!showSettings)}
			>
				Settings
			</button>
			<div className='large-container'>
				<div className='buttons'>
					<button
						className=''
						type='button'
						onClick={() => NewSong()}
					>
						New Song
					</button>
					<button
						type='button'
						onClick={handleStartAnimation}
					>
						Start
					</button>
					<button
						type='button'
						onClick={handlePauseAnimation}
					>
						Stop
					</button>
					<button
						type='button'
						onClick={handleFrameReset}
					>
						Reset
					</button>
					<button
						type='button'
						onClick={handleBackToStart}
					>
						Back To Start
					</button>
					<div className='hints'>
						Hints:
						<input
							className='hints-checkbox'
							id='checkbox'
							type='checkbox'
							checked={checked}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className='greater-container'>
					<div className='target-box'></div>
					<div
						onClick={handleStartAnimation}
						id='staff-container'
						className='staff-container'
						style={{ overflow: 'scroll' }}
						ref={viewportRef}
						tabIndex={0}
					>
						<img
							src={FirstStaff}
							alt=''
							className='grand-staff'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>
						<img
							src={StaffLines}
							alt=''
							className='lines'
						/>

						{songpattern.map((songpattern, index) => {
							return (
								<div
									className='note-container'
									key={index}
									id={index}
								>
									<h1 className='wrong'>WRONG</h1>
									<h1 className='correct'>CORRECT</h1>
									<img
										src={StaffLines}
										alt=''
										className='lines'
									/>
									<div
										className={classNames(
											'note',
											`${songpattern.Trebleid}-note`
										)}
									>
										<img
											src={Note}
											alt=''
											className={classNames('note-img')}
											data-value={0}
										/>
										<svg
											className='note-name'
											viewBox='0 0 30 30'
										>
											<text
												x='0'
												y='15'
											>
												{checked &&
													songpattern.Trebleid.slice(
														songpattern.Trebleid
															.length - 2,
														songpattern.Trebleid
															.length
													)}
											</text>
										</svg>
									</div>
									{songpattern.Bassid && (
										<div
											className={classNames(
												'note',
												`${songpattern.Bassid}-note`
											)}
										>
											<img
												src={Note}
												alt=''
												className={classNames(
													'note-img'
												)}
											/>
											<svg
												className='note-name'
												viewBox='0 0 30 30'
											>
												<text
													x='0'
													y='15'
												>
													{checked &&
														songpattern.Bassid.slice(
															songpattern.Bassid
																.length - 2,
															songpattern.Bassid
																.length
														)}
												</text>
											</svg>
										</div>
									)}
									{/* Extra Bars */}
									<div
										className={classNames({
											'C6-bar':
												songpattern.Trebleid ===
												'TrebleC6',
										})}
									></div>
									<div
										className={classNames({
											'A5-bar':
												songpattern.Trebleid ===
													'TrebleB5' ||
												songpattern.Trebleid ===
													'TrebleA5' ||
												songpattern.Trebleid ===
													'TrebleC6',
										})}
									></div>

									<div
										className={classNames({
											'treble-C4-bar':
												songpattern.Trebleid ===
													'TrebleA3' ||
												songpattern.Trebleid ===
													'TrebleC4' ||
												songpattern.Trebleid ===
													'TrebleB3' ||
												songpattern.Trelbeid ===
													'TrebleD4',
										})}
									></div>
									<div
										className={classNames({
											'A3-bar':
												songpattern.Trebleid ===
													'TrebleA3' ||
												songpattern.Trebleid ===
													'TrebleB2',
										})}
									></div>
									{/*bass bars*/}
									<div
										className={classNames({
											'E4-bar':
												songpattern.Bassid ===
													'BassD4' ||
												songpattern.Bassid === 'BassE4',
										})}
									></div>
									<div
										className={classNames({
											'bass-C4-bar':
												songpattern.Bassid ===
													'BassC4' ||
												songpattern.Bassid ===
													'BassE4' ||
												songpattern.Bassid === 'BassD4',
										})}
									></div>
									<div
										className={classNames({
											'E2-bar':
												songpattern.Bassid ===
													'BassE2' ||
												songpattern.Bassid ===
													'BassF2' ||
												songpattern.Bassid ===
													'BassD2' ||
												songpattern.Bassid === 'BassC2',
										})}
									></div>
									<div
										className={classNames({
											'C2-bar':
												songpattern.Bassid ===
													'BassC2' ||
												songpattern.Bassid === 'BassD2',
										})}
									></div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

export default Staff;
