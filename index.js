const fs = require('fs');
const path = require('path');

const challenge01 = () => {
	let nUsrs = 0;
	let lastUser = {};
	const { listAcc } = fs.readFileSync(path.join(__dirname, 'inputs', 'users.txt'), 'utf-8')
		.toString().trim().split('\n')
		.reduce(({ usrAcc, listAcc }, line) => {
			if (line === '') {
				listAcc.push(usrAcc);
				return { usrAcc: {}, listAcc };
			} else {
				const properties = line.split(' ');
				for (let property of properties) {
					const [field, value] = property.split(':');
					usrAcc[field] = value;
				}
				return { usrAcc: { ...usrAcc }, listAcc };
			}
		}, { usrAcc: {}, listAcc: [] });


	listAcc.map((usr) => {
		if (usr.usr && usr.psw && usr.eme && usr.age && usr.loc && usr.fll) {
			lastUser = usr;
			nUsrs++;
		}
	});

	console.log(`Result challenge01: ${nUsrs}${lastUser.usr}`);
}


const challenge02 = () => {
	const words = fs.readFileSync(path.join(__dirname, 'inputs', 'encrypted.txt'), 'utf-8')
		.toString().trim().split(' ')
		.map((word) => {
			const { wordAcc, charAcc } = Array.from(word).reduce(({ charAcc, wordAcc }, nextDigit) => {
				if (Number.parseInt(charAcc + nextDigit) > 122) {
					wordAcc.push(Number.parseInt(charAcc));
					return { charAcc: nextDigit, wordAcc }
				} else {
					return { charAcc: charAcc + nextDigit, wordAcc }
				}
			}, { charAcc: '', wordAcc: [] })
			wordAcc.push(Number.parseInt(charAcc));
			return wordAcc;
		})
		.map((word) =>
			word.map(
				(char) => String.fromCharCode(char)
			).reduce((acc, char) => acc + char, '')
		)
		.reduce((acc, word) => acc + ' ' + word, '')
		.trim();
	console.log('Result challenge02:', words);
};

const challenge03 = () => {
	const colors = fs.readFileSync(path.join(__dirname, 'inputs', 'colors.txt'), 'utf-8').toString().trim().replace('[', '').replace(']', '').replaceAll('"', '').trim().split(', ');

	const { largestChainLastColor, largestChainLength } = colors.reduce(({ currentChainColors, currentChainLength, currentChainLastColor, largestChainLastColor, largestChainLength }, color) => {
		if (currentChainLength === 1) {
			// Solo hay un color en la cadena actual
			if (color !== currentChainLastColor)
				// No se repite color: [red, blue, ...]
				return {
					currentChainColors: currentChainColors.concat([color]),
					currentChainLength: currentChainLength + 1,
					currentChainLastColor: color,
					largestChainLastColor,
					largestChainLength
				};
			else
				// Se repite color: [red, red, ...] ( reiniciamos cadena )
				return {
					currentChainColors: [color],
					currentChainLength: 1,
					currentChainLastColor: color,
					largestChainLength: currentChainLength > largestChainLength ? currentChainLength : largestChainLength,
					largestChainLastColor: currentChainLength > largestChainLength ? currentChainLastColor : largestChainLastColor,
				}
		}
		if (currentChainColors.includes(color) && color !== currentChainLastColor) {
			// Estamos dentro de la cadena y seguimos alternando colores
			return {
				currentChainColors: currentChainColors,
				currentChainLength: currentChainLength + 1,
				currentChainLastColor: color,
				largestChainLastColor,
				largestChainLength
			};
		}
		else
			// Se rompio la cadena
			return {
				currentChainColors: [color],
				currentChainLength: 1,
				currentChainLastColor: color,
				largestChainLength: currentChainLength > largestChainLength ? currentChainLength : largestChainLength,
				largestChainLastColor: currentChainLength > largestChainLength ? currentChainLastColor : largestChainLastColor,
			};
	}, { currentChainColors: [], currentChainLength: 0, currentChainLastColor: '', largestChainLastColor: '', largestChainLength: 0 })
	console.log({ largestChainLastColor, largestChainLength });
}

const challenge04 = () => {
	const lowBound = 11098;
	const highBound = 98123;
	let number;
	let nNumbers = 0;
	let number55 = 0;
	for (let i = lowBound; i <= highBound; i++) {
		number = i.toString().split('');
		let { digits, occurrences5, rGEL } = number.reduce(({ digits, occurrences5, prevDigit, rGEL }, newDigit) => {
			return {
				digits: digits + 1,
				occurrences5: newDigit === '5' ? occurrences5 + 1 : occurrences5,
				prevDigit: newDigit,
				rGEL: rGEL && (Number.parseInt(newDigit) >= Number.parseInt(prevDigit))
			}
		}, { digits: 0, occurrences5: 0, prevDigit: 0, rGEL: true });
		if (digits === 5 && occurrences5 >= 2 && rGEL) {
			nNumbers++;
			number55 = nNumbers === 56 ? i : number55;
		}
	}
	console.log({ nNumbers, number55 });
}

challenge03();
