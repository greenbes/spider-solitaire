# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Or import in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

## Font Usage

### DM Sans (Heading & Body)

Used for all UI text including:
- Modal titles
- Button labels
- Form labels
- General text

```css
font-family: 'DM Sans', sans-serif;
```

Tailwind classes use `font-['DM_Sans']` for inline font-family.

**Weight usage:**
- `font-normal` (400) — Body text
- `font-medium` (500) — Button labels, form labels
- `font-semibold` (600) — Modal titles, statistics
- `font-bold` (700) — Card ranks

### IBM Plex Mono (Mono)

Used for:
- Statistics display (moves count, suits count)
- Numbers in game UI

```css
font-family: 'IBM Plex Mono', monospace;
```

Tailwind: `font-mono`
