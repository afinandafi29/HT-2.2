import React, { useState } from 'react';
import { Delete } from 'lucide-react';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(String(digit));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (firstValue, secondValue, operation) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return firstValue / secondValue;
            case '%':
                return firstValue % secondValue;
            default:
                return secondValue;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
        }
    };

    const toggleSign = () => {
        const value = parseFloat(display);
        setDisplay(String(value * -1));
    };

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[50px] p-8 shadow-2xl border border-white/10">
                    {/* Display */}
                    <div className="bg-black/50 rounded-3xl p-8 mb-6 min-h-[120px] flex items-end justify-end border border-white/5">
                        <div className="text-right">
                            {operation && <div className="text-orange-400 text-sm mb-2">{previousValue} {operation}</div>}
                            <div className="text-white text-6xl font-light tracking-tight break-all">{display}</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* Row 1 */}
                        <button onClick={clear} className="calc-btn bg-gray-600 hover:bg-gray-500 col-span-1">AC</button>
                        <button onClick={toggleSign} className="calc-btn bg-gray-600 hover:bg-gray-500">+/-</button>
                        <button onClick={() => performOperation('%')} className="calc-btn bg-gray-600 hover:bg-gray-500">%</button>
                        <button onClick={() => performOperation('÷')} className="calc-btn bg-orange-500 hover:bg-orange-400">÷</button>

                        {/* Row 2 */}
                        <button onClick={() => inputDigit(7)} className="calc-btn bg-gray-700 hover:bg-gray-600">7</button>
                        <button onClick={() => inputDigit(8)} className="calc-btn bg-gray-700 hover:bg-gray-600">8</button>
                        <button onClick={() => inputDigit(9)} className="calc-btn bg-gray-700 hover:bg-gray-600">9</button>
                        <button onClick={() => performOperation('×')} className="calc-btn bg-orange-500 hover:bg-orange-400">×</button>

                        {/* Row 3 */}
                        <button onClick={() => inputDigit(4)} className="calc-btn bg-gray-700 hover:bg-gray-600">4</button>
                        <button onClick={() => inputDigit(5)} className="calc-btn bg-gray-700 hover:bg-gray-600">5</button>
                        <button onClick={() => inputDigit(6)} className="calc-btn bg-gray-700 hover:bg-gray-600">6</button>
                        <button onClick={() => performOperation('-')} className="calc-btn bg-orange-500 hover:bg-orange-400">-</button>

                        {/* Row 4 */}
                        <button onClick={() => inputDigit(1)} className="calc-btn bg-gray-700 hover:bg-gray-600">1</button>
                        <button onClick={() => inputDigit(2)} className="calc-btn bg-gray-700 hover:bg-gray-600">2</button>
                        <button onClick={() => inputDigit(3)} className="calc-btn bg-gray-700 hover:bg-gray-600">3</button>
                        <button onClick={() => performOperation('+')} className="calc-btn bg-orange-500 hover:bg-orange-400">+</button>

                        {/* Row 5 */}
                        <button onClick={() => inputDigit(0)} className="calc-btn bg-gray-700 hover:bg-gray-600 col-span-2">0</button>
                        <button onClick={inputDecimal} className="calc-btn bg-gray-700 hover:bg-gray-600">.</button>
                        <button onClick={handleEquals} className="calc-btn bg-orange-500 hover:bg-orange-400">=</button>
                    </div>
                </div>
            </div>

            <style>{`
        .calc-btn {
          padding: 24px;
          border-radius: 20px;
          font-size: 28px;
          font-weight: 500;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .calc-btn:active {
          transform: scale(0.95);
        }
      `}</style>
        </div>
    );
};

export default Calculator;
