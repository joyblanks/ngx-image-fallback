import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

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

interface LoaderStyles {
  loaderClass?: string;
  loaderColor?: string;
}

/**
 * Image fallback directive
 * @category Shared
 */
@Directive({
  selector: '[ngxImageFallback]'
})
export class NgxImageFallbackDirective implements OnInit {

  @Input()
  imageFallback: string = DEFAULT_FALLBACK;

  @Input()
  imageFallbackStyles: LoaderStyles = { loaderClass: LOADER_CSS_CLASSNAME, loaderColor: LOADER_COLOR };

  private isBackgroundImage = true;

  constructor(
    private readonly element: ElementRef,
    private readonly renderer2: Renderer2
  ) { }

  /**
   * Angular lifecycle init
   */
  ngOnInit(): void {
    // inject native loader class class if not specified by user
    if (!this.imageFallbackStyles?.loaderClass || this.imageFallbackStyles.loaderClass === LOADER_CSS_CLASSNAME) {
      const id = LOADER_CSS_CLASSNAME;
      if (!document.querySelector(`#${id}`)) {
        const styles = Object.entries(LOADER_STYLES).map(
          ([klassName, { separator, ...klassAttrs }]) => `${klassName}{${Object.entries(klassAttrs)
            .map(([key, val]) => `${key}${separator[0]}${val}`)
            .join(separator[1])
            }}`
        ).join(' ')
          + `.${LOADER_CSS_CLASSNAME}::after{border-top:2px solid ${this.imageFallbackStyles?.loaderColor || LOADER_COLOR}}`;
        const style = this.renderer2.createElement('style');
        const styleValues = this.renderer2.createText(styles);
        this.renderer2.setAttribute(style, 'id', id);
        this.renderer2.appendChild(style, styleValues);
        this.renderer2.appendChild(document.head, style);
      }
    }

    // extract image from host element
    const source: string = this.element.nativeElement?.style?.backgroundImage || this.element.nativeElement?.src || '';
    this.isBackgroundImage = BKG_REGEX.test(source) && this.element.nativeElement.nodeName.toLowerCase() !== 'img';
    const sanitaizedSource = this.isBackgroundImage ? source.slice(5, source.length - 2) : source;
    this.toggleLoader(true); // turn on loader

    // If source is null/undefined/<blank>
    if (['null', '', 'undefined'].includes(sanitaizedSource)) {
      // On error show fallback add a class for user to decide on the host
      this.showFallback(this.imageFallback || DEFAULT_FALLBACK);
      this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
    } else {
      //Simulate image load in background
      const imageConnection = new Image();
      imageConnection.src = sanitaizedSource;

      // On error show fallback add a class for user to decide on the host
      imageConnection.onerror = () => {
        this.showFallback(this.imageFallback || DEFAULT_FALLBACK);
        this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
      };

      // on success turn off the loader
      imageConnection.onload = () => {
        this.toggleLoader(false);
      };
    }
  }

  /**
   * Add fallback image
   * 
   * @param fallbackImage fallback image url
   */
  showFallback(fallbackImage: string): void {
    if (this.isBackgroundImage) {
      // Welcome PR for multiple backgrounds
      this.renderer2.setStyle(this.element.nativeElement, 'background-image', `url('${fallbackImage}')`);
    } else {
      this.renderer2.setAttribute(this.element.nativeElement, 'src', fallbackImage);
    }
    this.toggleLoader(false);
  }

  /**
   * Add or remove the given classname to host
   * 
   * @param klass css classname to add or remove
   * @param mode true to add false to remove
   */
  updateCssClass(klass: string, mode: boolean): void {
    const el = this.element.nativeElement;
    if (mode) {
      this.renderer2.addClass(el, klass);
    } else {
      this.renderer2.removeClass(el, klass);
    }
  }

  /**
   * Add/Remove loader
   * 
   * @param mode true to add false to remove
   */
  toggleLoader(mode: boolean): void {
    const el = this.element.nativeElement;
    // img pseudo element hack
    if (!this.isBackgroundImage) {
      if (mode) {
        this.renderer2.setStyle(el, 'content', '" "');
      } else {
        this.renderer2.removeStyle(el, 'content');
      }
    }
    this.updateCssClass(this.imageFallbackStyles?.loaderClass || LOADER_CSS_CLASSNAME, mode);
  }

}