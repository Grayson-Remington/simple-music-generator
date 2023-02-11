import React, { useState, useEffect, useRef } from 'react';
import Note from '/assets/note.svg';
import FirstStaff from '/assets/startofstaff.svg';
import StaffLines from '/assets/lines.svg';
import data from '../data/data';
import classNames from 'classnames';

function Staff() {
	let [animationState, setAnimationState] = useState('paused');
	const [checked, setChecked] = useState(false);
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

	useEffect(() => {
		const viewport = viewportRef.current;

		if (!viewport) return;

		if (animationState === 'running') {
			let currentPos = {
				x: viewport.scrollLeft,
			};

			const animation = setInterval(() => {
				currentPos = {
					x: currentPos.x + 2,
				};
				viewport.scrollLeft = currentPos.x;
			}, 20);

			return () => clearInterval(animation);
		}
	}, [animationState]);

	let songlength = 30;
	let [randomSequence, setRandomSequence] = useState([]);

	function Reset() {
		setRandomSequence((randomSequence = []));
		for (let i = 0; i < songlength; i++) {
			randomSequence.push(data[Math.floor(Math.random() * data.length)]);
		}
		setRandomSequence(randomSequence);
		console.log(randomSequence);
		let element = document.getElementsByClassName('staff-container')[0];
		let lastchild = element.lastChild;

		lastchild.id = 'last-child';
	}

	return (
		<div className='large-container'>
			<div className='buttons'>
				<button
					type='button'
					onClick={() => Reset()}
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
			<div
				className='staff-container'
				style={{ overflow: 'scroll' }}
				ref={viewportRef}
			>
				<img
					src={FirstStaff}
					alt=''
					className='grand-staff'
				/>
				{randomSequence.map((randomSequence) => {
					return (
						<div className='note-container'>
							<img
								src={StaffLines}
								alt=''
								className='lines'
							/>
							<div
								className={classNames(
									'note',
									`${randomSequence.id}-note`
								)}
							>
								<img
									src={Note}
									alt=''
									className={classNames('note-img')}
								/>
								<h1 className='note-name'>
									{checked && randomSequence.id}
								</h1>
							</div>
							<div
								className={classNames({
									'middle-c-bar':
										randomSequence.id === 'A2' ||
										randomSequence.id === 'C3' ||
										randomSequence.id === 'B2' ||
										randomSequence.id === 'D3',
								})}
							></div>
							<div
								className={classNames({
									'a3-bar':
										randomSequence.id === 'A2' ||
										randomSequence.id === 'B2',
								})}
							></div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Staff;
