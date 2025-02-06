import React, { useState, useRef, useEffect } from 'react';

/**
 * usePrevious<T>
 *
 * Tracks the previous value of a prop or state. On each render,
 * it stores the incoming value in a ref, then returns the value
 * from the previous render.
 */
function usePrevious<T>(value: T): T | undefined {
  // Make this ref type T or undefined so it starts as undefined
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // ref.current here is the previous value
  return ref.current;
}

export default function UseReference() {
  // State to track mouse coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // State to track an input value
  const [inputValue, setInputValue] = useState('');

  /**
   * We'll store our mouse event handler in a ref so we can attach
   * the same listener once and still always have the latest logic.
   *
   * Type is either a function that takes a DOM MouseEvent, or null.
   */
  const handlerRef = useRef<((event: MouseEvent) => void) | null>(null);

  /**
   * We'll store a reference to an HTML input element so we can
   * call inputRef.current.focus() from an event handler.
   */
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Use our custom hook to track the previous input value
  const previousValue = usePrevious(inputValue);

  /**
   * On every render, update handlerRef.current to a fresh function.
   * The function sets the mouse coords in state.
   */
  useEffect(() => {
    handlerRef.current = (event: MouseEvent) => {
      setCoords({ x: event.clientX, y: event.clientY });
    };
  }, []);

  /**
   * Attach a single mousemove event listener once (on mount).
   * That listener will call handlerRef.current(e) so it can
   * always have access to the latest version of the callback.
   */
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (handlerRef.current) {
        handlerRef.current(e);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /**
   * When the button is clicked, focus the input if it exists.
   */
  function handleFocusClick() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Advanced useRef Examples (TypeScript)</h2>

      {/* Example: Mousemove handler ref usage */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>Current Mouse Position:</strong> (X: {coords.x}, Y: {coords.y})
      </div>

      {/* Example: usePrevious hook */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Type something:
        </label>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={handleFocusClick}>Focus the input</button>
        <p>
          <em>Previous Value:</em> {previousValue ?? '(none yet)'}
        </p>
      </div>

      <p>
        Key points:
        <ul>
          <li>
            The <strong>mousemove</strong> event is attached only once, but the
            handler is always “fresh” because it’s stored in a ref.
          </li>
          <li>
            The <code>usePrevious</code> hook lets us see the previous value of
            the input.
          </li>
          <li>
            The <code>inputRef</code> helps us call <code>.focus()</code>{' '}
            imperatively on the input element.
          </li>
        </ul>
      </p>
    </div>
  );
}
