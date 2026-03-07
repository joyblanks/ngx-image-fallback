# Image Fallback Directive for Angular

[![CI](https://github.com/joyblanks/ngx-image-fallback/actions/workflows/ci.yml/badge.svg)](https://github.com/joyblanks/ngx-image-fallback/actions/workflows/ci.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![npm version](https://badge.fury.io/js/ngx-image-fallback.svg)](https://badge.fury.io/js/ngx-image-fallback)
[![GitHub version](https://badge.fury.io/gh/joyblanks%2Fngx-image-fallback.svg)](https://badge.fury.io/gh/joyblanks%2Fngx-image-fallback)



## Supported versions

| Package | Angular   | Install |
|---------|-----------|--------|
| **1.x** | 11–15     | `npm i ngx-image-fallback@^1` |
| **2.x** | 16–18     | `npm i ngx-image-fallback@^2` |

Use **2.x** for Angular 16–18 (standalone directive, `inject()`, NgModule still supported). Use **1.x** for Angular 11–15.

## Image fallback directive for img tag and background images on Angular
---



## Installation
```sh
# Angular 16–18
npm i ngx-image-fallback@^2 -S

# Angular 11–15
npm i ngx-image-fallback@^1 -S
```

### SystemJS (1.x)
In your ```system.config.js``` add to **map** and **packages**

```js
var map = {
  ...
  'ngx-image-fallback': 'node_modules/ngx-image-fallback/bundles'
}
var packages = {
  ...
  'ngx-image-fallback': { defaultExtension: 'js' }
}
```

## Usage

### Standalone (2.x, Angular 14+)

```ts
// *.component.ts
import { Component } from '@angular/core';
import { NgxImageFallbackDirective } from 'ngx-image-fallback';

@Component({
  standalone: true,
  imports: [NgxImageFallbackDirective],
  template: '<img [src]="image" ngxImageFallback [ngxImageFallback]="fallback" />',
})
export class MyComponent {
  image = 'https://example.com/photo.jpg';
  fallback = '/assets/placeholder.png';
}
```

### NgModule (1.x and 2.x)

```ts
// *.module.ts
import { NgModule } from '@angular/core';
import { NgxImageFallbackModule } from 'ngx-image-fallback';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxImageFallbackModule, ...],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

> Basic Usage in component
```ts
// *.component.ts

import { Component } from '@angular/core';
 
@Component({
  selector: 'app-root',
  template: '<img [src]="an_image_that_might_be_unavailable" [ngxImageFallback]="fallback" />'
})
export class AppComponent {
  an_image_that_might_be_unavailable: string = 'https://invalidimage12345.com/unknown.jpg';
  fallback: string = '/assets/images/fallback.jpg';
}
```

> Sample Usage 1: (Using built in default fallback image and default loader)
```html
<!-- *component.html -->

<img 
  src="an_invalid_image" 
  ngxImageFallback 
/> <!-- with img tag -->

<div 
  [style.background-image]="an_invalid_image" 
  ngxImageFallback
>&nbsp;</div> <!-- with a background image -->
```

> Sample Usage 2: (Using another image from web or assets library)
```html
<!-- *.component.html -->

<img 
  src="an_invalid_image" 
  ngxImageFallback="/assets/images/fallback.png" 
/> <!-- with img tag -->

<div 
  [style.background-image]="an_invalid_image" 
  ngxImageFallback="'url('https://ssl.gstatic.com/gb/images/p2_772b9c3b.png')'"
>&nbsp;</div> <!-- with a background image -->
```

> Sample Usage 3: (Using a loader while the image loads with success or fallback)
```css
/* *.component.css */

.image-loader::after { /* 👈 Reference this class in [ngxImageFallbackStyles]="{loaderClass:'image-loader'}" */
  border-radius: 50%;
  height: 15px;
  max-height: 100%;
  border-top: 3px solid #ffff00;
  animation: 1s rotate linear infinite;
  content: " ";
  inset: 0;
  display: block;
  aspect-ratio: 1;
  margin: auto;
}
@keyframes rotate {
  from: {transform: rotate(0deg);}
  to: {transform: rotate(360deg);}
}
```

```html
<!-- *.component.html -->

<img 
  src="an_invalid_image" 
  [ngxImageFallbackStyles]="{loaderClass:'image-loader'}"
  ngxImageFallback="https://ssl.gstatic.com/gb/images/p2_772b9c3b.png" 
/> <!-- with img tag and a loader class -->

<div 
  [style.background-image]="an_invalid_image" 
  [ngxImageFallbackStyles]="{loaderClass:'image-loader'}"
  ngxImageFallback="'url('https://ssl.gstatic.com/gb/images/p2_772b9c3b.png')'"
>&nbsp;</div> <!-- with a background image and a loader class -->
```

> Sample Usage 4: (Using the default loader while the image loads with success or fallback, but with a different color)
```html
<!-- *.component.html -->

<img 
  src="an_invalid_image" 
  [ngxImageFallbackStyles]="{loaderColor:'#ffffff'}"
  ngxImageFallback="https://ssl.gstatic.com/gb/images/p2_772b9c3b.png" 
/> <!-- with img tag and white colored default loader -->

<div 
  [style.background-image]="an_invalid_image" 
  [ngxImageFallbackStyles]="{loaderColor:'red'}"
  ngxImageFallback="'url('https://ssl.gstatic.com/gb/images/p2_772b9c3b.png')'"
>&nbsp;</div> <!-- with a background image and red colored default loader -->
```

> Sample Usage 5: (Referencing attributes with binding)
```ts
// my-component.component.ts

@Component({
  selector: 'my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponent {
  image: string = 'https://invalidimage12345.com/unknown.jpg';
  fallback: string = '/assets/images/fallback.jpg';
}
```
```html
<!-- my-component.component.html -->

<img 
  [src]="image" 
  [ngxImageFallback]="fallback" 
/> <!-- with img tag -->

<div 
  [style.background-image]="'url('+image+')'" 
  [ngxImageFallback]="fallback"
>&nbsp;</div> <!-- with a background image -->
```

---

## Publishing

Releases are automated with [GitHub Actions](.github/workflows/) and [semantic-release](https://github.com/semantic-release/semantic-release):

- **Push to `main`** with [conventional commits](https://www.conventionalcommits.org/) (e.g. `fix:`, `feat:`) runs the release workflow: it builds, then publishes to npm and creates a GitHub release if the commit history warrants a new version.
- **Manual publish:** `npm run publish:lib` (builds and runs `npm publish` from `dist/ngx-image-fallback`). You must be logged in (`npm login`) and have set **NPM_TOKEN** in the repo if using CI.

**CI setup:** In GitHub → Settings → Secrets and variables → Actions, add **NPM_TOKEN** (create an automation token at [npmjs.com/settings](https://www.npmjs.com/settings) → Access Tokens).

---

> TODO:
  - Multiple background images
  - Event emitter to loaded original or fallback
  - Add a demo

## License

[MIT](https://tldrlegal.com/license/mit-license) © [Joy Biswas](https://github.com/joyblanks)
