const G_SCALAR_FACTOR = 0.5;
const G_X_HEIGHT = 70.0;

let theFont;

function preload() {
	theFont = loadFont('AKZIDENZGROTESKBE-MD.OTF');
}

let sampleText;
let theTextPointsList;
let theTextBoundsList;
let time;

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(30);

	textFont(theFont);
	time = 0;

	sampleTexts = [
		' in the process of cherishing ',
		' in the process of finding ',
		' in the process of grieving ',
		' in the process of removing ',
		' in the process of resolving ',
		' in the process of forgetting ',
		' in the process of remembering '
	];
	// sampleText = ' removing is a process of ';// is a process of removing is a process of losing is a process of'
	// ['forgetting', 'remembering', 'losing', 'finding', 'grieving', 'closure'].forEach((word) => {
	// 	sampleText += word;
	// 	sampleText += ' is a process of removing is a process of ';
	// });
	//sampleText = 'p5!'

//theTextPoints = charDividedTextToPoints(sampleText);
	
	theTextPointsList = sampleTexts.map(charDividedTextToPoints);	
	theTextBoundsList = sampleTexts.map((sampleText) => {
		return theFont.textBounds(sampleText, 0, 0, G_X_HEIGHT);
	});

	console.log(theTextPointsList);
	console.log(theTextBoundsList);

	fill(0);
	//stroke(255);
}

function draw() {
	background('#fd4');
	time += (sin(millis() / 400) + 2) * 7;
	

	for( let i = 0; i < theTextPointsList.length; i+=1 ){
		let theTextBounds = theTextBoundsList[i];
		let theTextPoints = theTextPointsList[i];

		let displacement = time % (theTextBounds.w * 2); // 0 -> 2w

		//line((width-theTextBounds.w) / 2, 0, (width-theTextBounds.w) / 2, height);
		//line((width+theTextBounds.w) / 2, 0, (width+theTextBounds.w) / 2, height);

		push();
		translate((width-displacement) / 2, height * ((i+2) / (theTextPointsList.length + 3)));
		
		const LOWER_BOUND = (width-theTextBounds.w) / 2;
		const UPPER_BOUND = (width+theTextBounds.w) / 2;

		theTextPoints.forEach( character => {
			if(character.length > 0){
				push();
				
				let charPosition = (width-displacement) / 2 + character[0].x;
				
				if (charPosition < LOWER_BOUND){
					translate(theTextBounds.w, 0);
					charPosition += theTextBounds.w;
				} else if(charPosition > UPPER_BOUND) {
					translate(-theTextBounds.w, 0);
					charPosition -= theTextBounds.w;
				}

				const CENTEREDNESS = abs(width/2 - charPosition) * 2 / theTextBounds.w;

				beginShape();
				
				character.forEach( ({x,y}) => {
					if(Math.random() > CENTEREDNESS)
						vertex(x, y);
				});
				endShape(CLOSE);
				pop();
			}
		});
		pop();
	}
}

function lengthOfVectorizedChar(char){
	return theFont.textToPoints(char, 0, 0, G_X_HEIGHT, {
		sampleFactor: G_SCALAR_FACTOR,
		simplifyThreshold: 0
	}).length;
}

function charDividedTextToPoints(msg){
	let lengthsOfVectorizedCharacters = Array.from(msg).map(lengthOfVectorizedChar);

	let flatMsg = theFont.textToPoints(msg, 0, 0, G_X_HEIGHT, {
		sampleFactor: G_SCALAR_FACTOR,
		simplifyThreshold: 0
	});

	let characterSegmentedTextAsPoints = [];
	lengthsOfVectorizedCharacters.forEach((length) => {
		characterSegmentedTextAsPoints.push(
			flatMsg.splice(0, length)
		);
	});

	return characterSegmentedTextAsPoints;
}
