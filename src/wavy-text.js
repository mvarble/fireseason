import React from 'react';
import { map, scan } from 'rxjs/operators';

import timer$ from './timer';

export default function WavyText({ children, scale=20, period=1, ...props }) {
  // create a state for the transforms of each letter
  const [positions, set] = React.useState([]);

  // initialize the state stream
  React.useEffect(() => {
    // make sure there is a single string as the child
    if (typeof children !== 'string') {
      throw new Error('WavyText: children must be string');
    }

    // create an array stream, with each element encoding a letter's position
    const positions$ = timer$().pipe(
      scan(
        (data, dt) => data.map(({ w: [wx, wy], time }, i) => ({
          w: [
            (wx + dt * Math.random() / 1000) % (Math.PI * 2),
            (wy + dt * Math.random() / 1000) % (Math.PI * 2),
          ],
          time: time + dt / 1000,
        })), 
        Array(children.length).fill({ w: [0, 0], time: 0 }),
      ),
      map(data => data.map(({ w: [wx, wy], time }, i) => [
        scale * 0.05 * Math.cos(wx * (i + 1)),
        scale * (
          0.5 * Math.sin(Math.PI * 2 * (time / period + i / data.length)) 
          + 0.1 * Math.sin(wy * (i + 1))
        ),
      ])),
    );

    // subscribe to the stream with the React state update
    const subscription = positions$.subscribe(set);
    return () => subscription.unsubscribe();
  }, [children, period, scale, set]);

  // create the characters
  return (
    <span { ...props }>
      {
        children.split('').map((char, i) => {
          const [x, y] = (
            (positions.length >= children.length)
            ? positions[i].map(x => x.toFixed(2))
            : [0, 0]
          );
          return (
            <span key={ i } style={{ position: 'relative' }}>
              <span style={{ translate: `${x}px ${y}px`,position: 'absolute' }}>
                { char }
              </span>
              <span style={{ visibility: 'hidden' }}>{ char }</span>
            </span>
          );
        })
      }
    </span>
  );
} 

export const WavyTitle = ({ children }) => (
  <WavyText 
    scale={ 48 } 
    style={{ 
      fontSize: '72pt', 
      color: 'var(--logoLine)',
      fontFamily: 'cokobi',
      margin: '0.5em auto',
      display: 'inline-block',
    }}>
    { children }
  </WavyText>
)
