/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');
  const [operation, setOperation] = useState('');

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      const firstOperationPart = operation.split(' ').at(0);
      setOperation(`${firstOperationPart} ${lastOperation.current} ${number}`);
    } else {
      setOperation(number);
    }
  }, [number]);

  useEffect(() => {
    const result = calculateSubResult();
    setPrevNumber(`${result}`);
  }, [operation]);

  const clean = () => {
    setNumber('0');
    setPrevNumber('0');
    lastOperation.current = undefined;
    setOperation('');
  };

  const deleteLastDigit = () => {
    if (number.length === 1 || (number.length === 2 && number.includes('-'))) {
      return setNumber('0');
    }

    return setNumber(number.slice(0, -1));
  };

  const toggleSign = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    } else {
      setNumber(`-${number}`);
    }
  };

  const buildNumber = (textNumber: string) => {
    if (number.includes('.') && textNumber === '.') {
      return;
    }

    if (number.startsWith('0') || number.startsWith('-0')) {
      if (textNumber === '.') {
        return setNumber(number + textNumber);
      }

      if (textNumber === '0' && number.includes('.')) {
        return setNumber(number + textNumber);
      }

      if (textNumber !== '0' && !number.includes('.')) {
        return setNumber(textNumber);
      }

      if (textNumber === '0' && !number.includes('.')) {
        return;
      }

      return setNumber(number + textNumber);
    }

    setNumber(number + textNumber);
  };

  const setLastNumber = () => {
    calculateResult();

    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }

    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const calculateResult = () => {
    const result = calculateSubResult();
    setOperation(`${result}`);
    lastOperation.current = undefined;
    setPrevNumber('0');
  };

  const calculateSubResult = () => {
    const [firstNumber, mathSign, secondNumber] = operation.split(' ');

    const num1 = Number(firstNumber);
    const num2 = Number(secondNumber);

    if (isNaN(num2)) {
      return num1;
    }

    switch (mathSign) {
      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        if (num1 === 0) {
          throw new Error('Cannot divide by zero');
        }
        return num1 / num2;

      default:
        throw new Error('Invalid operation');
    }
  };

  return {
    number,
    prevNumber,
    operation,
    buildNumber,
    toggleSign,
    clean,
    deleteLastDigit,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateResult,
  };
};
