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
	const colors = fs.readFileSync(path.join(__dirname, 'inputs', 'colors.txt'), 'utf-8').toString().trim().replace('[', '').replace(']', '').trim().split(', ');
	colors.map((color) => console.log(color));
}

challenge03();
