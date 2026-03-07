import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';

const LOADER_COLOR = '#abcdef'; // loader color
const LOADER_CSS_CLASSNAME = 'image-fallback-loader'; // add this class while loading or class specified by user
const DIR_ERROR_CSS_CLASSNAME = 'image-fallback-error'; // add class on error (for user to decide if anything else to do)
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
const DEFAULT_FALLBACK = [
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
 * Image fallback directive (standalone).
 * Use in templates: add to component/directive `imports`, or import `NgxImageFallbackModule`.
 * @category Shared
 */
@Directive({
  selector: '[ngxImageFallback]',
  standalone: true,
})
export class NgxImageFallbackDirective implements OnInit {

  @Input()
  ngxImageFallback: string = DEFAULT_FALLBACK;

  @Input()
  ngxImageFallbackStyles: LoaderStyles = { loaderClass: LOADER_CSS_CLASSNAME, loaderColor: LOADER_COLOR };

  private isBackgroundImage = true;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer2 = inject(Renderer2);

  /**
   * Angular lifecycle init
   */
  ngOnInit(): void {
    // inject native loader class if not specified by user
    if (!this.ngxImageFallbackStyles?.loaderClass || this.ngxImageFallbackStyles.loaderClass === LOADER_CSS_CLASSNAME) {
      const id = LOADER_CSS_CLASSNAME;
      if (!document.querySelector(`#${id}`)) {
        const styles = Object.entries(LOADER_STYLES).map(
          ([klassName, { separator, ...klassAttrs }]) => `${klassName}{${Object.entries(klassAttrs)
            .map(([key, val]) => `${key}${separator[0]}${val}`)
            .join(separator[1])
            }}`
        ).join(' ')
          + `.${LOADER_CSS_CLASSNAME}::after{border-top:2px solid ${this.ngxImageFallbackStyles?.loaderColor || LOADER_COLOR}}`;
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
      this.showFallback(this.ngxImageFallback || DEFAULT_FALLBACK);
      this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
    } else {
      const imageConnection = new Image();
      imageConnection.src = sanitizedSource;

      imageConnection.onerror = () => {
        this.showFallback(this.ngxImageFallback || DEFAULT_FALLBACK);
        this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
      };

      imageConnection.onload = () => {
        this.toggleLoader(false);
      };
    }
  }

  showFallback(fallbackImage: string): void {
    if (this.isBackgroundImage) {
      this.renderer2.setStyle(this.element.nativeElement, 'background-image', `url('${fallbackImage}')`);
    } else {
      this.renderer2.setAttribute(this.element.nativeElement, 'src', fallbackImage);
    }
    this.toggleLoader(false);
  }

  updateCssClass(klass: string, mode: boolean): void {
    const el = this.element.nativeElement;
    if (mode) {
      this.renderer2.addClass(el, klass);
    } else {
      this.renderer2.removeClass(el, klass);
    }
  }

  toggleLoader(mode: boolean): void {
    const el = this.element.nativeElement;
    if (!this.isBackgroundImage) {
      if (mode) {
        this.renderer2.setStyle(el, 'content', '" "');
      } else {
        this.renderer2.removeStyle(el, 'content');
      }
    }
    this.updateCssClass(this.ngxImageFallbackStyles?.loaderClass || LOADER_CSS_CLASSNAME, mode);
  }
}
