import React, { useState, useEffect, useRef } from 'react';
import Note from '/assets/note.svg';
import FirstStaff from '/assets/startofstaff.svg';
import StaffLines from '/assets/lines.svg';
import trebledata from '../data/trebledata';
import bassdata from '../data/bassdata';
import classNames from 'classnames';

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
	let [speed, setSpeed] = useState(0.4);
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
		viewportRef.current.scrollLeft = 0;
	};

	let animation;

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
					currentPos = {
						x: currentPos.x + speed,
					};
					viewport.scrollLeft = currentPos.x;
				}, 2);
				document.addEventListener('click', handleDocumentClick);
			}, 2000);

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
	const [treblePatternOptions, setTreblePatternOptions] = useState([]);

	const handleTrebleLowerLimitChange = (event, index) => {
		let choice = parseInt(event.target.value);
		setTrebleLowerLimit(choice);
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
		(option, index) => index <= localtrebleUpperLimit
	); //Match the option and select all options below the trebleUpperLimit

	const trebleUpperLimitOptions = trebledata.filter(
		(option, index) =>
			index >= trebleLowerLimit && index <= trebleUpperLimit
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
	function FiveFinger() {
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
			if (i % 6 === 0 || i === 0) {
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
		{ value: 'FiveFinger', label: 'Five Finger' },
	];
	function handleTrebleFunctionChange(event) {
		setSelectedTrebleFunction(event.target.value);

		switch (event.target.value) {
			case 'RandomTrebleNotes':
				setTrebleUpperLimit(16);
				break;
			case 'SimpleArpeggios':
				setTrebleUpperLimit(9);
				if (localtrebleUpperLimit > 9) {
					setLocalTrebleUpperLimit(9);
				}
				break;
			case 'FiveFinger':
				setTrebleUpperLimit(12);
				if (localtrebleUpperLimit > 12) {
					setLocalTrebleUpperLimit(12);
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
			case 'FiveFinger':
				FiveFinger();
				break;
			default:
				break;
		}
	}
	return (
		<>
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
							max='0.8'
							step='0.05'
							onChange={(e) => {
								setSpeed(parseFloat(e.target.value));
								console.log(speed);
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
				<div
					onClick={handleStartAnimation}
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

					{songpattern.map((songpattern, index) => {
						return (
							<div
								className='note-container'
								key={index}
							>
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
									/>
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
										className={classNames(
											'note',
											`${songpattern.Bassid}-note`
										)}
									>
										<img
											src={Note}
											alt=''
											className={classNames('note-img')}
										/>
										<h1 className='note-name'>
											{checked &&
												songpattern.Bassid.slice(
													songpattern.Bassid.length -
														2,
													songpattern.Bassid.length
												)}
										</h1>
									</div>
								)}
								{/* Extra Bars */}
								<div
									className={classNames({
										'C6-bar':
											songpattern.Trebleid === 'TrebleC6',
									})}
								></div>
								<div
									className={classNames({
										'A5-bar':
											songpattern.Trebleid ===
												'TrebleB5' ||
											songpattern.Trebleid ===
												'TrebleA5' ||
											songpattern.Trebleid === 'TrebleC6',
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
											songpattern.Trelbeid === 'TrebleD4',
									})}
								></div>
								<div
									className={classNames({
										'A3-bar':
											songpattern.Trebleid ===
												'TrebleA3' ||
											songpattern.Trebleid === 'TrebleB2',
									})}
								></div>
								{/*bass bars*/}
								<div
									className={classNames({
										'E4-bar':
											songpattern.Bassid === 'BassD4' ||
											songpattern.Bassid === 'BassE4',
									})}
								></div>
								<div
									className={classNames({
										'bass-C4-bar':
											songpattern.Bassid === 'BassC4' ||
											songpattern.Bassid === 'BassE4' ||
											songpattern.Bassid === 'BassD4',
									})}
								></div>
								<div
									className={classNames({
										'E2-bar':
											songpattern.Bassid === 'BassE2' ||
											songpattern.Bassid === 'BassF2' ||
											songpattern.Bassid === 'BassD2' ||
											songpattern.Bassid === 'BassC2',
									})}
								></div>
								<div
									className={classNames({
										'C2-bar':
											songpattern.Bassid === 'BassC2' ||
											songpattern.Bassid === 'BassD2',
									})}
								></div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default Staff;
