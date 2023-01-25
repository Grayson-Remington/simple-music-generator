import React, { useState, useEffect } from 'react';
import Note from '/assets/note.svg';
import Clef from '/assets/trebleclef.svg';
import data from '../data/data';
import classNames from 'classnames';

function MusicNotes() {
	const [show, setShow] = useState(false);
	const [guess, setGuess] = useState(null);
	const [index, setIndex] = useState(0);
	const [disable, setDisable] = useState(false);
	function Reset() {
		setGuess(null);
		setIndex(Math.floor(Math.random() * 7));
		setShow(false);
	}

	let first = data[index].first;
	let third = data[index].third;
	let fifth = data[index].fifth;
	useEffect(() => {
		// run something every time name changes
		if (guess == first) {
			setShow(true);
			setDisable(true);
		}
	}, [guess]);
	// if guess is crrect, show note
	// reset button
	return (
		<>
			<div className='container'>
				<div id='playground-div'>First: {show && first}</div>
				<div id='playground-div'>Third: {third}</div>
				<div id='playground-div'>Fifth: {fifth}</div>
				<div id='playground-div'>Guess: {guess}</div>
				<div id='winorlose'>{show && 'Correct!'}</div>

				<div id='images'>
					<img
						className='clef'
						src={Clef}
						alt='Clef'
					/>
					{(first == 'C' || third == 'C' || fifth == 'C') && (
						<img
							className={classNames('c-note', {
								'c-note-first': first == 'C' && show,
								'c-note-third': third == 'C',
								'c-note-fifth': fifth == 'C',
							})}
							src={Note}
							alt='Note'
						/>
					)}
					{(first == 'D' || third == 'D' || fifth == 'D') && (
						<img
							className={classNames('d-note', {
								'd-note-first': first == 'D' && show,
								'd-note-third': third == 'D',
								'd-note-fifth': fifth == 'D',
							})}
							src={Note}
							alt='Note'
						/>
					)}
					{(first == 'E' || third == 'E' || fifth == 'E') && (
						<img
							className={classNames('e-note', {
								'e-note-first': first == 'E' && show,
								'e-note-third': third == 'E',
								'e-note-fifth': fifth == 'E',
							})}
							src={Note}
							alt='Note'
						/>
					)}
					{(first == 'F' || third == 'F' || fifth == 'F') && (
						<img
							className={classNames('f-note', {
								'f-note-first': first == 'F' && show,
								'f-note-third': third == 'F',
								'f-note-fifth': fifth == 'F',
							})}
							src={Note}
							alt='Note'
						/>
					)}
					{(first == 'G' || third == 'G' || fifth == 'G') && (
						<img
							className={classNames('g-note', {
								'g-note-first': first == 'G' && show,
								'g-note-third': third == 'G',
								'g-note-fifth': fifth == 'G',
							})}
							src={Note}
							alt='Note'
						/>
					)}
					{(first == 'A' || third == 'A' || fifth == 'A') && (
						<>
							<img
								className={classNames('a-note', {
									'a-note-first': first == 'A' && show,
									'a-note-third': third == 'A',
									'a-note-fifth': fifth == 'A',
								})}
								src={Note}
								alt='Note'
							/>
						</>
					)}
					{(first == 'B' || third == 'B' || fifth == 'B') && (
						<img
							className={classNames('b-note', {
								'b-note-first': first == 'B' && show,
								'b-note-third': third == 'B',
								'b-note-fifth': fifth == 'B',
							})}
							src={Note}
							alt='Note'
						/>
					)}
				</div>

				<div className='buttons'>
					<button
						type='button'
						onClick={() => {
							setGuess('C');
						}}
					>
						C
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('D');
						}}
					>
						D
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('E');
						}}
					>
						E
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('F');
						}}
					>
						F
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('G');
						}}
					>
						G
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('A');
						}}
					>
						A
					</button>
					<button
						type='button'
						onClick={() => {
							setGuess('B');
						}}
					>
						B
					</button>
					<button
						type='button'
						onClick={() => Reset()}
					>
						Reset
					</button>
				</div>
			</div>
		</>
	);
}

export default MusicNotes;
