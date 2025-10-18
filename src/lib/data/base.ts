const firstName = 'Fikri';
const lastName = 'Hisham';
const suffix = 'My blogs';

const BaseData = {
	firstName,
	lastName,
	suffix,
	get fullName() {
		return `${firstName} ${lastName}`;
	}
};

export default BaseData;
