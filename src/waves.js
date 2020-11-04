import React from 'react';
import * as rx from 'rxjs';
import { scan, map, skip } from 'rxjs/operators';

import timer$ from './timer';

export default function Shore({ frequency=1, delay=8, ...props }) {
  // create a state of the shore
  const [cycles, setCycles] = React.useState([0, 0])
  const [cycle1, cycle2, cycle3] = cycles;

  // mount the state to a reactive stream
  React.useEffect(() => {
    const time$ = timer$().pipe(scan((time, dt) => time + dt, 0));
    const cycle1$ = time$.pipe(
      map(time => Math.sin(0.005 * time * frequency / Math.PI))
    );
    const cycle2$ = cycle1$.pipe(skip(delay));
    const cycle3$ = time$.pipe(
      map(time => Math.sin(0.005 * time * frequency / Math.PI - 1))
    );
    const cycles$ = rx.zip(cycle1$, cycle2$, cycle3$);
    const subscription = cycles$.subscribe(setCycles);
    return () => subscription.unsubscribe();
  }, [frequency, delay]);

  // render the svg
  return (
    <svg { ...props } viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M 0 0 L 0 80 C 20 80, 40 98, 60 98 S 80 90, 100 90 L 100 0 Z"
        style={{ fill: 'rgba(174, 165, 130, 0.5)' }}
      />
      <path
        d={ `
          M 0 0 
          L 0 ${ 75 + 3 * cycle2  }
          C 20 ${ 75 + 2 * cycle2 }, 
            40 ${ 93 - 0.5 * cycle2 }, 
            60 ${ 93 - 0.8 * cycle2 }
          S 80 ${ 85 - 2.1 * cycle2 }, 
            100 ${ 85 - 1.2 * cycle2 }
          L 100 0 Z` 
        }
        style={{ fill: 'rgba(255, 255, 255, 0.7)' }}
      />
      <path
        d={ `
          M 0 0 
          L 0 ${ 70 + 3 * cycle1 + cycle3 }
          C 20 ${ 70 + 2 * cycle1 + cycle3 }, 
            40 ${ 88 - 0.5 * cycle1 + cycle3 }, 
            60 ${ 88 - 0.8 * cycle1 + cycle3 }
          S 80 ${ 80 - 2.1 * cycle1 + cycle3 }, 
            100 ${ 80 - 1.2 * cycle1 + cycle3 }
          L 100 0 Z` 
        }
        style={{ fill: 'rgb(123, 157, 146)' }}
      />
      <path
        d={ `
          M 0 0 
          L 0 ${ 55 + 6 * cycle2  }
          C 20 ${ 55 + 4 * cycle2 }, 
            40 ${ 73 - 1 * cycle2 }, 
            60 ${ 73 - 1.6 * cycle2 }
          S 80 ${ 65 - 4.2 * cycle2 }, 
            100 ${ 65 - 2.4 * cycle2 }
          L 100 0 Z` 
        }
        style={{ fill: 'rgba(60, 117, 112, 0.5)' }}
      />
    </svg>
  );
}
