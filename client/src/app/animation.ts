// src/app/animations.ts
import {
  trigger,
  transition,
  style,
  query,
  animate,
  group,
  animateChild,
} from '@angular/animations';

export const animation1 = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          height: '100%', // Ensure height is set to avoid layout shifts
          opacity: 1,
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('200ms ease-out', style({ opacity: 0.5 }))], {
        optional: true,
      }),
      query(':enter', [animate('200ms ease-out', style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);
