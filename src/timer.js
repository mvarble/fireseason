import * as rx from 'rxjs';
import { map, filter, pairwise } from 'rxjs/operators';

export default () =>  rx.interval(0, rx.animationFrameScheduler).pipe(
  map(() => (new Date()).getTime()),
  pairwise(),
  map(([t0, t1]) => t1 - t0),
  filter(x => x > 12)
);


