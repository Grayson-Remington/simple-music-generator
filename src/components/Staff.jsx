import React, { useState, useEffect } from 'react';
import Note from '/assets/note.svg';
import FirstStaff from '/assets/startofstaff.svg';
import StaffLines from '/assets/lines.svg';
import data from '../data/data';
import classNames from 'classnames';

function Staff() {
	let songlength = 25;
	let [randomSequence, setRandomSequence] = useState([]);

	function Reset() {
		setRandomSequence((randomSequence = []));
		for (let i = 0; i < songlength; i++) {
			randomSequence.push(data[Math.floor(Math.random() * 7)]);
		}
		setRandomSequence(randomSequence);
		console.log(randomSequence);
		let element = document.getElementsByClassName('staff-container')[0];
		let lastchild = element.lastChild;

		lastchild.id = 'last-child';
		console.log(lastchild);
	}

	function pageScroll() {
		let element = document.getElementsByClassName('staff-container')[0];
		let lastchild = element.lastChild;
		console.log(element);
		lastchild.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		});
	}

	return (
		<>
			<button
				type='button'
				onClick={() => Reset()}
			>
				Reset
			</button>
			<button
				type='button'
				onClick={() => pageScroll()}
			>
				Scroll
			</button>

			<div></div>

			<div
				className='staff-container'
				style={animationProps}
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
									`${randomSequence.first}-note`
								)}
							>
								<img
									src={Note}
									alt=''
									className={classNames('note-img')}
								/>
								<h1 className='note-name'>
									{randomSequence.first}
								</h1>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default Staff;
