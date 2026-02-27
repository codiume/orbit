# AGENTS.md

## Install

```bash
pnpm add astro-ui-avatars
```

Or:

```bash
npm install astro-ui-avatars
```

## Usage

```astro
---
import { Avatar } from 'astro-ui-avatars';
---

<Avatar name="John Doe" />
```

## API Props

| Prop         | Required | Default    | Description                                |
| ------------ | -------- | ---------- | ------------------------------------------ |
| `name`       | No       | `John Doe` | Name for initials                          |
| `size`       | No       | `64`       | Size in pixels                             |
| `background` | No       | `#007bff`  | Background color (use `random` for random) |
| `color`      | No       | `#FFFFFF`  | Text color                                 |
| `length`     | No       | `2`        | Number of initials                         |
| `fontSize`   | No       | `0.5`      | Font size (0.1-1)                          |
| `rounded`    | No       | `true`     | Rounded corners                            |
| `uppercase`  | No       | `true`     | Uppercase initials                         |
| `bold`       | No       | `true`     | Bold text                                  |

## Examples

```astro
<Avatar background="#0D8ABC" color="#fff" />
<Avatar background="random" />
<Avatar rounded={true} />
```

## Build

No build step required. Package exports SVG component.

## Test

Verify avatar renders with correct initials and colors.
