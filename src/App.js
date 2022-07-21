import { useReducer } from 'react';
import './styles.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


//Reducer takes in (state and { types of ACTIONS from ACTIONS object, gives us payload/result}) 
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentOperand === "0") return state;
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) { // if no user input, do nothing - return state
          return state;
        }

        if (state.currentOperand == null) { // if user inputs but changes mind, they switch - overwrites/updates operation.
          return {
            ...state,
            operation: payload.operation,        
          }
        }

        if (state.previousOperand == null) { // if no previous operand, switch current to previous.
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
      default: case ACTIONS.CLEAR: // labeled as default as best practice but not necessary
        return {};
      case  ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null) return state; 
        if (state.currentOperand.length === 1) {
          return { ...state, currentOperand: null }
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      case ACTIONS.EVALUATE:
        // If not enough info, do nothing/return state  -- else return state after computation.
        if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state;
        }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }        
  }
}

// Takes in operands input by user. Each case/operation has different computation.
// switch makes it easy to change states/cases
function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = previous + current
      break
    case "-":
      computation = previous - current
      break
    case "*":
      computation = previous * current
      break
    case "÷":
      computation = previous / current
      break
  }
  return computation.toString();
}

// We use the .split method to split the integer and decimal.
// We use the .format method to format integers
// formatOperand adds commas for longer values and makes them easier to read

// formats integer only, nothing after period. 
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return // if no operand, do nothing
  const [ integer, decimal] = operand.split('.') 
  if (decimal == null) return INTEGER_FORMATTER.format(integer) // if no decimal, return formatted integer
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}` //return formatted integer and decimal afterwards - no formatting on decimal.
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>
          {formatOperand(previousOperand)} {operation}
          </div>
        <div className='current-operand'>
          {formatOperand(currentOperand)}
          </div>
      </div>
      <button 
      className='span-two' 
      onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
        </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      >
        DEL
        </button>
      <OperationButton operation='÷' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button 
        className='span-two' 
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
    </div>
  )
}

export default App;
