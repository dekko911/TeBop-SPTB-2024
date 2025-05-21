function filterDuplicates(arr) {
	return arr.filter((item, index) => arr.indexOf(item) === index);
}

const data = [1, 2, 2, 3, 4, 4, 5];
const filteredData = filterDuplicates(data);
console.log(filteredData); // Output: [1, 2, 3, 4, 5]
