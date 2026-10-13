function calculate(val) {
    if (!val) {
        return 0
    }
    try {
        return eval(val)
    } catch {
        return 'invalid input'
    }

}

function checkErrormg(val) {
    if (val.toString().includes('invalid') || val.toString().includes(0)) {
        return val = ''
    } else {
        return val
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const screen = document.querySelector("#input1");
    const add = document.querySelector("#add");
    const subtract = document.querySelector("#subtract");
    const one = document.querySelector("#one");
    const two = document.querySelector("#two");
    const three = document.querySelector("#three");
    const four = document.querySelector("#four");
    const five = document.querySelector("#five");
    const clear = document.querySelector("#clear");
    const equal = document.querySelector("#eq");


    let currentValue = screen.value


    function helper(v) {
        currentValue = checkErrormg(currentValue)
        currentValue += v
    }

    add.addEventListener("click", function () {
        helper('+')
        screen.value = currentValue
    })

    subtract.addEventListener("click", function () {
        helper('-')
        screen.value = currentValue
    })

    one.addEventListener("click", function () {
        helper('1')
        screen.value = currentValue
    })

    two.addEventListener("click", function () {
        helper('2')
        screen.value = currentValue

    })

    three.addEventListener("click", function () {
        helper('3')
        screen.value = currentValue

    })

    four.addEventListener("click", function () {
        helper('4')
        screen.value = currentValue

    })

    five.addEventListener("click", function () {
        helper('5')
        screen.value = currentValue

    })

    clear.addEventListener("click", function () {
        currentValue = "0"
        screen.value = currentValue
    })

    equal.addEventListener('click', function () {
        let answer = calculate(currentValue)
        currentValue = answer
        screen.value = currentValue
    })



});