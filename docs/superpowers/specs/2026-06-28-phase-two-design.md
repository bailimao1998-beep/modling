# Phase Two Design

## Product direction

Phase two turns the existing F11MT prototype into a calm, durable study workspace. The existing matrix, Markov, grading, mistake, exam, and localStorage flows remain intact. New work is incremental and data-driven.

## Architecture

- Keep the current hash router and native ES module structure.
- Add a shared application header beside the existing sidebar, with route title, due-review count, overall mastery, and local-save state.
- Expand the data layer with topics, exam templates, error types, and review schedule metadata. Lessons adopt one stable schema while preserving the two existing interactive modules.
- Add pure analytics functions for dashboard recommendations, score estimates, practice filtering, mistake summaries, and seven-day activity. Pages consume these functions without duplicating calculations.
- Add Labs and Reports routes. Labs reuse the existing matrix and Markov bind/render functions; graph and probability labs are polished previews.
- Keep localStorage version compatible, enriching attempts and mistake records without invalidating phase-one data.

## Experience

- Desktop uses a fixed sidebar, compact utility header, and a constrained reading canvas. Mobile uses a top utility bar plus a bottom navigation for primary routes.
- Dashboard prioritizes today's recommendation, genuine learning evidence, module progress, due reviews, and a clearly labelled reference score estimate.
- Lessons follow the requested ten-part learning sequence and include a module knowledge map.
- Practice filters update the question list in place. Cards show metadata, prior-error state, step score, progressive hints, and completion summaries.
- Mistakes combine charts and actionable cards. Users can redo a question, mark it understood, and expand the stored context.
- Exams begin with a mode chooser, support answered/marked states, and finish with score, step marks, error types, and revision suggestions.

## Visual system

CSS custom properties define color, type, spacing, radius, and shadow tokens. Surfaces are white and cool neutral, primary actions use restrained teal-blue, and status colors pair text with color. Cards remain compact with at most 8px radius. Motion is limited to navigation and state transitions.

## Testing

Pure services are covered first with Node tests. Existing math, grading, mastery, and spacing tests remain. Browser verification covers every route, mobile layout, filters, labs, mistake actions, exam submission, reports charts, persistence, and console errors. Production build is the final gate.
