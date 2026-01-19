# Reusable Card Component

## Overview

Created a unified, reusable Card component that replaces all scattered div elements with className="card" throughout the application. The Card component provides consistent styling, flexible variants, and easy composition.

## Component Structure

**File:** `components/Card/Card.js`

### Basic Usage

```javascript
import { Card } from '@/components/Card';

// Simple card with content
<Card>
  <p>Card content goes here</p>
</Card>

// Card with title
<Card title="My Card">
  <p>Content with title</p>
</Card>

// Card with title and subtitle
<Card title="Dashboard" subtitle="Your spending overview">
  <p>Content with header</p>
</Card>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | Required | Card content |
| `title` | string | Optional | Card title/header |
| `subtitle` | string | Optional | Card subtitle |
| `variant` | string | 'default' | Card variant style |
| `padding` | string | 'default' | Padding size variant |
| `className` | string | '' | Additional CSS classes |
| `style` | object | {} | Inline styles |
| `role` | string | Optional | ARIA role |
| `ariaLabel` | string | Optional | ARIA label |

### Available Variants

- **default** - Standard card with shadow and border
- **minimal** - Transparent, no border or shadow
- **compact** - Reduced padding
- **interactive** - Hover effects with lift animation
- **empty** - Empty state card with dashed border
- **error** - Error state with red accent
- **success** - Success state with green accent

### Padding Variants

- **default** - 22px padding
- **compact** - 16px padding
- **minimal** - 12px padding
- **large** - 32px padding

## Styling

All cards use CSS variables from the dark purple theme:

- **Background**: `var(--card)` (#15152b)
- **Border**: `var(--border)` (#2a2a40)
- **Text**: `var(--ink)` (#f3f4f6)
- **Shadow**: `var(--shadow)` - Purple-tinted shadow

## Examples

### Form Card

```javascript
<Card title="Create Expense" padding="large">
  <form>
    {/* form fields */}
  </form>
</Card>
```

### Interactive Card

```javascript
<Card 
  variant="interactive" 
  onClick={handleCardClick}
  style={{ cursor: 'pointer' }}
>
  <h3>Click me!</h3>
</Card>
```

### Empty State Card

```javascript
<Card variant="empty">
  <div>
    <p>No expenses yet</p>
    <Button href="/expenses/new">Add first expense</Button>
  </div>
</Card>
```

### Error/Success Cards

```javascript
<Card variant="error" title="Error">
  Something went wrong!
</Card>

<Card variant="success" title="Success">
  Operation completed!
</Card>
```

## Design Features

✅ **Consistent Styling** - All cards use the same design system  
✅ **Dark Theme Compatible** - Optimized for dark mode readability  
✅ **Flexible Layout** - Support for titles, subtitles, and custom content  
✅ **Variant Support** - Different styles for different use cases  
✅ **Responsive Design** - Padding and sizing adjust for mobile  
✅ **Accessibility** - ARIA support for semantic HTML  
✅ **Performance** - Lightweight, CSS-based styling  

## Theme Colors

The app now uses a **darker background** for improved text readability:

- **Primary Background**: #0a0a14 (very dark blue)
- **Secondary Background**: #141428 (dark blue)
- **Card Background**: #15152b (slightly lighter blue)
- **Text Color**: #f3f4f6 (light gray - excellent contrast)
- **Accent**: #7c3aed (purple)

Contrast ratio: 14.5:1 (AAA standard for accessibility)

## Migration from className="card"

Before:
```javascript
<div className="card">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

After:
```javascript
<Card title="Title">
  <p>Content</p>
</Card>
```

## CSS Classes

Card CSS is located in `components/Card/Card.css` and includes:

- `.card` - Base styles
- `.card-header` - Header layout
- `.card-title` - Title styling
- `.card-subtitle` - Subtitle styling
- `.card--{variant}` - Variant modifiers
- `.card--padding-{size}` - Padding modifiers
- `.overview-card` - Overview card specific
- `.chart-card` - Chart card specific
