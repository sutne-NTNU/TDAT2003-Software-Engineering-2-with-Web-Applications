// @flow


console.log("\n\n\nOPPGAVE 1");
let v1 = [1, 2, 3];
let v2 = [4, 5, 6];

console.log("v1 + 2: "               , v1.map(e => e + 2));
console.log("v1 * 2: "               , v1.map(e => e * 2));
console.log("mean of v1: "           , v1.reduce((sum, e) => sum + e) / v1.length);
console.log("v1 dot v2: "            , v1.map((v1e, i) => v1e * v2[i]).reduce((sum, e) => sum + e));    //32
console.log("sum of v1 + (2 * v2): " , v1.reduce((sum1, e) => sum1 + e) + v2.reduce((sum2, e) => sum2 + (2 * e), 0));
console.log("v1 as String: "         , v1.map((e, i) => "v1[" + i + "]=" + e));



console.log("\n\n\nOPPGAVE 2");
class Complex
{
	real: number;
	imag: number;
	constructor(real: number, img: number)
	{
		this.real = real;
		this.imag = img;
	}
}
let v = [new Complex(2, 2), new Complex(1, 1)];

console.log("v elements as strings: "    , v.map(e => e.real + " + " + e.imag + "i"));
console.log("magnitude of v elements: "  , v.map(e => Math.sqrt(e.real * e.real + e.imag * e.imag)));
console.log("sum of v: Complex{ real: "  , v.reduce((real, e) => real + e.real, 0) + ", imag: " + v.reduce((imag, e) => imag + e.imag, 0) + " }");



console.log("\n\n\nOPPGAVE 3");
let students = [{name: 'Ola', grade: 'A'}, {name: 'Kari', grade: 'C'}, {name: 'Knut', grade: 'C'}];

console.log("student elements as strings: " , students.map(student => student.name + " got " + student.grade));
console.log("How many got C: "               , students.filter(student => student.grade === 'C').length);
console.log("Percentage of C grades: "       , 100 * students.filter(student => student.grade === 'C').length / (students.length));
console.log("Did anyone get A: "             , students.some(student => student.grade === 'A') ? "Yes" : "No");
console.log("Did anyone get F: "             , students.some(student => student.grade === 'F') ? "Yes" : "No");
console.log("\n\n");
