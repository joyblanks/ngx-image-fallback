import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  Renderer2,
} from '@angular/core';

const LOADER_COLOR = '#abcdef';
const LOADER_CSS_CLASSNAME = 'image-fallback-loader';
const DIR_ERROR_CSS_CLASSNAME = 'image-fallback-error';
const LOADER_STYLES = {
  [`.${LOADER_CSS_CLASSNAME}::after`]: {
    'separator': [':', ';'],
    'border-radius': '50%',
    'height': '15px',
    'max-height': '100%',
    'animation': '1s rotate linear infinite',
    'content': '" "',
    'inset': '0',
    'display': 'block',
    'aspect-ratio': '1',
    'margin': 'auto',
  },
  '@keyframes rotate': {
    'separator': ['', ''],
    'from': '{transform: rotate(0deg);}',
    'to': '{transform: rotate(360deg);}'
  }
};
const BKG_REGEX = /^url\(["']+.*["']+\)$/i;
/** Built-in data URI used when all fallbacks fail. Exported for tests. */
export const DEFAULT_FALLBACK = [
  'data:image/jpeg;base64,',
  '/9j/4AAQSkZJRgABAQEAYABgAAD/',
  '/gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gODAK/',
  '9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/',
  '9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/',
  '8AAEQgAIAAgAwEiAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAAEBQj/xAAcEAADAQEBAAMAAAAAAAAAAAAAAQIDERIEMVH/',
  'xAAXAQEAAwAAAAAAAAAAAAAAAAAAAQID/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEh/9oADAMBAAIRAxEAPwDocAjrTTutVus4m/',
  'CThM0UWAi97RvM1o6n2pfYST7+MtAGdv8AG00u04bl26XKS+zRAmIZ+WOy0z7NeZpPtWnxLpoAAf/Z',
].join('');

export interface LoaderStyles {
  loaderClass?: string;
  loaderColor?: string;
}

/**
 * Image fallback directive (standalone, Angular 19+).
 * Uses signal inputs and is zoneless-safe (works without zone.js in Angular 21+).
 * Add to your component or route `imports`: [NgxImageFallbackDirective].
 */
@Directive({
  selector: '[ngxImageFallback]',
  standalone: true,
})
export class NgxImageFallbackDirective implements OnInit {

  /** Fallback image URL(s) when the primary source fails or is empty. Can be a single string or an array tried in order; if all fail, the built-in data fallback is shown. */
  ngxImageFallback = input<string | string[]>(DEFAULT_FALLBACK);

  /** Loader appearance (CSS class and color). */
  ngxImageFallbackStyles = input<LoaderStyles>({
    loaderClass: LOADER_CSS_CLASSNAME,
    loaderColor: LOADER_COLOR,
  });

  /** Emitted when the fallback image is shown (primary failed or empty). */
  fallbackUsed = output<void>();

  /** Emitted when the primary image loads successfully. */
  imageLoaded = output<void>();

  private isBackgroundImage = true;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer2 = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const stylesConfig = this.ngxImageFallbackStyles();
    if (!stylesConfig?.loaderClass || stylesConfig.loaderClass === LOADER_CSS_CLASSNAME) {
      const id = LOADER_CSS_CLASSNAME;
      if (!document.querySelector(`#${id}`)) {
        const styles = Object.entries(LOADER_STYLES).map(
          ([klassName, { separator, ...klassAttrs }]) => `${klassName}{${Object.entries(klassAttrs)
            .map(([key, val]) => `${key}${separator[0]}${val}`)
            .join(separator[1])
            }}`
        ).join(' ')
          + `.${LOADER_CSS_CLASSNAME}::after{border-top:2px solid ${stylesConfig?.loaderColor ?? LOADER_COLOR}}`;
        const style = this.renderer2.createElement('style');
        const styleValues = this.renderer2.createText(styles);
        this.renderer2.setAttribute(style, 'id', id);
        this.renderer2.appendChild(style, styleValues);
        this.renderer2.appendChild(document.head, style);
      }
    }

    const el = this.element.nativeElement;
    const source: string = el?.style?.backgroundImage || (el as HTMLImageElement)?.src || '';
    this.isBackgroundImage = BKG_REGEX.test(source) && el.nodeName.toLowerCase() !== 'img';
    const sanitizedSource = this.isBackgroundImage ? source.slice(5, source.length - 2) : source;
    this.toggleLoader(true);

    if (['null', '', 'undefined'].includes(sanitizedSource)) {
      this.tryFallbackList(this.getFallbackList(), 0);
    } else {
      const imageConnection = new Image();
      imageConnection.src = sanitizedSource;

      imageConnection.onerror = () => {
        this.tryFallbackList(this.getFallbackList(), 0);
      };

      imageConnection.onload = () => {
        this.toggleLoader(false);
        this.imageLoaded.emit();
        this.cdr.markForCheck();
      };
    }
  }

  /** Normalize fallback input to a non-empty array of URLs (strings only). */
  private getFallbackList(): string[] {
    const value = this.ngxImageFallback();
    if (value == null || value === '') {
      return [];
    }
    const list = Array.isArray(value) ? value.filter((u): u is string => typeof u === 'string' && u !== '') : [value];
    return list;
  }

  /** Try fallback URLs in order; if all fail, show the built-in default data fallback. */
  private tryFallbackList(list: string[], index: number): void {
    if (index >= list.length) {
      this.applyFallbackAndEmit(DEFAULT_FALLBACK);
      return;
    }
    const url = list[index];
    const img = new Image();
    img.onload = () => {
      this.showFallback(url);
      this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
      this.fallbackUsed.emit();
      this.cdr.markForCheck();
    };
    img.onerror = () => {
      this.tryFallbackList(list, index + 1);
    };
    img.src = url;
  }

  private applyFallbackAndEmit(fallbackImage: string): void {
    this.showFallback(fallbackImage);
    this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
    this.fallbackUsed.emit();
    this.cdr.markForCheck();
  }

  private showFallback(fallbackImage: string): void {
    if (this.isBackgroundImage) {
      this.renderer2.setStyle(this.element.nativeElement, 'background-image', `url('${fallbackImage}')`);
    } else {
      this.renderer2.setAttribute(this.element.nativeElement, 'src', fallbackImage);
    }
    this.toggleLoader(false);
  }

  private updateCssClass(klass: string, mode: boolean): void {
    const el = this.element.nativeElement;
    if (mode) {
      this.renderer2.addClass(el, klass);
    } else {
      this.renderer2.removeClass(el, klass);
    }
  }

  private toggleLoader(mode: boolean): void {
    const el = this.element.nativeElement;
    const loaderClass = this.ngxImageFallbackStyles()?.loaderClass ?? LOADER_CSS_CLASSNAME;
    if (!this.isBackgroundImage) {
      if (mode) {
        this.renderer2.setStyle(el, 'content', '" "');
      } else {
        this.renderer2.removeStyle(el, 'content');
      }
    }
    this.updateCssClass(loaderClass, mode);
  }
}
