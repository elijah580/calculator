// ---------- Helpers that do the math ----------

// sin/cos/tan in DEGREES (JavaScript's Math.sin uses radians)
function sinDeg(x) { return Math.sin(x * Math.PI / 180); }
function cosDeg(x) { return Math.cos(x * Math.PI / 180); }
function tanDeg(x) { return Math.tan(x * Math.PI / 180); }

// Turn what's on the screen into something JavaScript understands
function toJsExpression(text) {
    let expr = text
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("−", "-")
        .replaceAll("sin(", "sinDeg(")
        .replaceAll("cos(", "cosDeg(")
        .replaceAll("tan(", "tanDeg(")
        .replaceAll("√(", "Math.sqrt(");

    // Auto-close any parentheses the user forgot to close
    const opens = (expr.match(/\(/g) || []).length;
    const closes = (expr.match(/\)/g) || []).length;
    expr += ")".repeat(Math.max(0, opens - closes));
    return expr;
}

function calculate(text) {
    try {
        const result = eval(toJsExpression(text));
        if (typeof result !== "number" || !isFinite(result)) {
            return "Error";
        }
        // Round away tiny errors like 0.30000000000000004
        return String(parseFloat(result.toFixed(10)));
    } catch {
        return "Error";
    }
}

// ---------- Wiring up the page ----------

document.addEventListener("DOMContentLoaded", function () {
    const screen = document.querySelector("#input1");

    // What each button adds to the screen (button id -> text)
    const values = {
        zero: "0", one: "1", two: "2", three: "3", four: "4",
        five: "5", six: "6", seven: "7", eight: "8", nine: "9",
        dot: ".",
        add: "+", subtract: "−", multiply: "×", divide: "÷",
        open: "(", close: ")",
        sin: "sin(", cos: "cos(", tan: "tan(", sqrt: "√("
    };

    const operators = ["+", "−", "×", "÷"];
    const functionIds = ["sin", "cos", "tan", "sqrt"];

    let currentValue = "0";
    let justCalculated = false; // true right after pressing =

    function show() {
        screen.value = currentValue;
    }

    function lastChar() {
        return currentValue.slice(-1);
    }

    function press(id) {
        const value = values[id];

        // After an error, any button starts fresh
        if (currentValue === "Error") {
            currentValue = "0";
        }

        // ----- Special buttons -----
        if (id === "clear") {
            currentValue = "0";
            justCalculated = false;
            return show();
        }

        if (id === "delete") {
            currentValue = currentValue.slice(0, -1);
            // sin( cos( tan( √( should disappear together
            if (currentValue === "") currentValue = "0";
            justCalculated = false;
            return show();
        }

        if (id === "eq") {
            currentValue = calculate(currentValue);
            justCalculated = true;
            return show();
        }

        // ----- Buttons that add text -----
        const isDigitOrDot = (value >= "0" && value <= "9") || value === ".";
        const isOperator = operators.includes(value);
        const isFunction = functionIds.includes(id);

        // Start fresh if the user types a number/function right after "="
        if (justCalculated && (isDigitOrDot || isFunction || value === "(")) {
            currentValue = "0";
        }
        justCalculated = false;

        if (isOperator) {
            // Allow a leading minus for negative numbers
            if (currentValue === "0" && value === "−") {
                currentValue = "−";
            } else if (operators.includes(lastChar())) {
                // Two operators in a row: replace the old one
                currentValue = currentValue.slice(0, -1) + value;
            } else if (lastChar() !== "(") {
                currentValue += value;
            }
        } else if (id === "dot") {
            // Only one dot per number: look at the number after the last operator/bracket
            const parts = currentValue.split(/[+−×÷()]/);
            const currentNumber = parts[parts.length - 1];
            if (!currentNumber.includes(".")) {
                currentValue += currentNumber === "" ? "0." : ".";
            }
        } else if (isDigitOrDot) {
            currentValue = currentValue === "0" ? value : currentValue + value;
        } else if (isFunction || value === "(") {
            // 5sin( means 5 × sin(
            const needsTimes = /[0-9.)]/.test(lastChar());
            if (currentValue === "0") {
                currentValue = value;
            } else {
                currentValue += (needsTimes ? "×" : "") + value;
            }
        } else if (value === ")") {
            const opens = (currentValue.match(/\(/g) || []).length;
            const closes = (currentValue.match(/\)/g) || []).length;
            // Only close if there's something open and a number just before
            if (opens > closes && /[0-9.)]/.test(lastChar())) {
                currentValue += ")";
            }
        }

        show();
    }

    // One click listener for ALL buttons
    document.querySelectorAll(".keys button").forEach(function (button) {
        button.addEventListener("click", function () {
            press(button.id);
        });
    });

    // Keyboard support
    const keyMap = {
        "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
        "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
        ".": "dot", "+": "add", "-": "subtract", "*": "multiply", "/": "divide",
        "(": "open", ")": "close",
        "Enter": "eq", "=": "eq", "Backspace": "delete", "Escape": "clear"
    };

    document.addEventListener("keydown", function (event) {
        const id = keyMap[event.key];
        if (id) {
            event.preventDefault();
            press(id);
        }
    });

    show();
});