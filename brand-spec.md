# VANTA brand specification

## Identity source

- The VANTA logo and wordmark in `public/brand/vanta-logo.png` are a direct crop of the user-provided VANTA brand identity reference image (provided with the task).
- Crop bounds in the 1536 × 1024 reference: x=88–530, y=26–147. The logo was not redrawn or redesigned.
- The crop retains the reference's dark background so the original mark and wordmark remain intact. Replace it only if the user supplies an official standalone asset with equivalent or higher fidelity.
- The original HTML exercise is preserved as content data in `src/content/initialHtmlExercise.ts` for a later learning feature; it is not presented as a working code runner in this landing-page task.

## Design tokens

| Role | Value | Use |
|---|---|---|
| Deep charcoal | `#090B10` | Main canvas |
| Dark graphite | `#171A20` | Cards and inset surfaces |
| Burnt copper | `#C8794F` | Brand accent, focus and key actions |
| Warm sand | `#E9D5C8` | Primary type and light accents |
| Soft ash | `#A8A9AD` | Secondary copy |
| Hairline | `rgba(233, 213, 200, 0.14)` | Subtle borders |

## Type and layout

- Latin display: Space Grotesk Variable.
- Arabic and body: IBM Plex Sans Arabic.
- Code reference: JetBrains Mono, reserved for code-related views.
- Spacing base: 8 px, with 4 px for fine adjustments.
- Corner radius: 4–12 px; prefer crisp panels over pill-heavy UI.
- Motion: 160–220 ms ease-out; honor `prefers-reduced-motion`.
- Arabic uses RTL document direction; English uses LTR. Code remains LTR regardless of UI locale.
