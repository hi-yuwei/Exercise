/**
 * Created by yy on 2016/5/5.
 */
var person = {
    name: 'beck',
    age: 28,
    height: 178,
    active: {
        say: '说',
        eat: '吃'
    }
}
console.log(person.name);
console.log(person.age);
console.log(person.b.c);


var x = {y: 1, z: {a: 5}, r: "hello,word"};
console.log(x.p);   //undefined
console.log(x.z.a); //5
console.log(x.c.b); //报错,对象不存在对象属性返回undefined,undefined没有属性，所以报错
console.log(b.x);   //报错，原始对象不存在
console.log(x.c.length); //报错，对象的c属性不存在是undefined，undefined没有属性，所以报错
console.log(x.y.length);    //undefined，对象存在y属性，但属性y的值是数字，数字没有length属性
console.log(x.r.length);    //10,对象存在r属性，r属性的值是字符串，字符串拥有length属性



var name='beck';
function say(){
    var name='xiaowang';
    console.log(this.name);
}
say();  //beck