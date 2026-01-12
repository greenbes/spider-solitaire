# Tailwind Color Configuration

## Color Choices

- **Primary:** `emerald` — Used for New Game button, Deal button, selected states, toggle switches
- **Secondary:** `amber` — Used for warnings, "Default" badge, valid drop target highlights
- **Neutral:** `stone` — Used for toolbar background, text, borders, card backgrounds

## Usage Examples

### Buttons

Primary button:
```
bg-emerald-600 hover:bg-emerald-500 text-white
```

Secondary/neutral button:
```
bg-stone-700 hover:bg-stone-600 text-white
```

Disabled button:
```
disabled:bg-stone-800 disabled:text-stone-500
```

### Text

Primary text:
```
text-white
```

Secondary text:
```
text-stone-300
```

Muted text:
```
text-stone-500
```

### Backgrounds

Game board:
```
bg-emerald-900
```

Toolbar:
```
bg-stone-800
```

Modal:
```
bg-stone-800
```

### Cards

Face-up card:
```
bg-white border-stone-300
```

Face-down card:
```
bg-gradient-to-br from-emerald-700 to-emerald-900 border-emerald-600
```

### Highlights

Valid drop target:
```
border-amber-400 bg-amber-400/10
```

Selected/active state:
```
bg-emerald-600 ring-2 ring-emerald-400
```

### Warning Messages

```
text-amber-400/80
```
