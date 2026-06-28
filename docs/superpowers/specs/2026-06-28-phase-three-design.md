# Phase Three Design

## Scope

Phase three keeps the existing application shell, routes, storage key, matrix module, and Markov module. It opens graph theory and probability as full study modules, adds two interactive labs, closes the due-review mastery loop, and introduces a 50-mark beta exam structure.

## Service boundaries

- `progress.js` owns the pure decision that maps a graded attempt plus an existing review item to a mastery event and next review item. A correct due review emits `review-correct-48h`; a wrong attempt always emits `wrong`.
- `graphMath.js` owns adjacency, degree, Laplacian, matrix powers, cofactors, and Matrix-tree calculations. The Cytoscape view only edits graph state and renders these results.
- `probabilityMath.js` owns the triangular density, piecewise interval integration, expectation, second moment, and variance. The Chart.js view only visualizes sampled density and selected intervals.
- Route entries receive optional cleanup hooks. Chart.js and Cytoscape instances are destroyed before their page DOM is replaced.

## Learning experience

- K4 is represented with six persistent Cytoscape edges. Clicking an edge toggles its active state instead of deleting the edge, so it can be restored by clicking again. Accessible edge buttons mirror the same behavior.
- Graph matrices update immediately. Walk calculations expose `A^k` and the selected entry. Tree calculations expose the chosen Laplacian minor and determinant.
- The probability lab shades the selected interval, explains one-piece or split integration, and provides separate moment buttons.
- Graph and probability lessons use the same ten-part course renderer and connect to their labs and question sets.

## Assessment and compatibility

- Sixteen new module questions follow the existing schema. Five additional stepped questions form the 50-mark beta exam.
- Existing localStorage data remains readable. New module ids already exist in the module and topic catalog.
- Browser validation covers every route, repeated chart-page entry, K4 walks/tree results, triangular density results, practice filters, and mobile overflow.
