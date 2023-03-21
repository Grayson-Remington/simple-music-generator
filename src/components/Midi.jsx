import WebMidi from 'webmidi';

WebMidi.enable((err) => {
	if (err) {
		console.error('WebMidi could not be enabled', err);
	} else {
		console.log('WebMidi enabled!');
		// Add your MIDI event handlers here
	}
});
