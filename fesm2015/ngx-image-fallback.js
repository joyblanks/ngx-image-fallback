import { __rest } from 'tslib';
import * as i0 from '@angular/core';
import { Directive, Input, NgModule } from '@angular/core';

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
/**
 * Image fallback directive
 * @category Shared
 */
class NgxImageFallbackDirective {
    constructor(element, renderer2) {
        this.element = element;
        this.renderer2 = renderer2;
        this.ngxImageFallback = DEFAULT_FALLBACK;
        this.ngxImageFallbackStyles = { loaderClass: LOADER_CSS_CLASSNAME, loaderColor: LOADER_COLOR };
        this.isBackgroundImage = true;
    }
    /**
     * Angular lifecycle init
     */
    ngOnInit() {
        var _a, _b, _c, _d, _e;
        // inject native loader class class if not specified by user
        if (!((_a = this.ngxImageFallbackStyles) === null || _a === void 0 ? void 0 : _a.loaderClass) || this.ngxImageFallbackStyles.loaderClass === LOADER_CSS_CLASSNAME) {
            const id = LOADER_CSS_CLASSNAME;
            if (!document.querySelector(`#${id}`)) {
                const styles = Object.entries(LOADER_STYLES).map((_a) => {
                    var [klassName, _b] = _a, { separator } = _b, klassAttrs = __rest(_b, ["separator"]);
                    return `${klassName}{${Object.entries(klassAttrs)
                        .map(([key, val]) => `${key}${separator[0]}${val}`)
                        .join(separator[1])}}`;
                }).join(' ')
                    + `.${LOADER_CSS_CLASSNAME}::after{border-top:2px solid ${((_b = this.ngxImageFallbackStyles) === null || _b === void 0 ? void 0 : _b.loaderColor) || LOADER_COLOR}}`;
                const style = this.renderer2.createElement('style');
                const styleValues = this.renderer2.createText(styles);
                this.renderer2.setAttribute(style, 'id', id);
                this.renderer2.appendChild(style, styleValues);
                this.renderer2.appendChild(document.head, style);
            }
        }
        // extract image from host element
        const source = ((_d = (_c = this.element.nativeElement) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.backgroundImage) || ((_e = this.element.nativeElement) === null || _e === void 0 ? void 0 : _e.src) || '';
        this.isBackgroundImage = BKG_REGEX.test(source) && this.element.nativeElement.nodeName.toLowerCase() !== 'img';
        const sanitaizedSource = this.isBackgroundImage ? source.slice(5, source.length - 2) : source;
        this.toggleLoader(true); // turn on loader
        // If source is null/undefined/<blank>
        if (['null', '', 'undefined'].includes(sanitaizedSource)) {
            // On error show fallback add a class for user to decide on the host
            this.showFallback(this.ngxImageFallback || DEFAULT_FALLBACK);
            this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
        }
        else {
            //Simulate image load in background
            const imageConnection = new Image();
            imageConnection.src = sanitaizedSource;
            // On error show fallback add a class for user to decide on the host
            imageConnection.onerror = () => {
                this.showFallback(this.ngxImageFallback || DEFAULT_FALLBACK);
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
    showFallback(fallbackImage) {
        if (this.isBackgroundImage) {
            // Welcome PR for multiple backgrounds
            this.renderer2.setStyle(this.element.nativeElement, 'background-image', `url('${fallbackImage}')`);
        }
        else {
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
    updateCssClass(klass, mode) {
        const el = this.element.nativeElement;
        if (mode) {
            this.renderer2.addClass(el, klass);
        }
        else {
            this.renderer2.removeClass(el, klass);
        }
    }
    /**
     * Add/Remove loader
     *
     * @param mode true to add false to remove
     */
    toggleLoader(mode) {
        var _a;
        const el = this.element.nativeElement;
        // img pseudo element hack
        if (!this.isBackgroundImage) {
            if (mode) {
                this.renderer2.setStyle(el, 'content', '" "');
            }
            else {
                this.renderer2.removeStyle(el, 'content');
            }
        }
        this.updateCssClass(((_a = this.ngxImageFallbackStyles) === null || _a === void 0 ? void 0 : _a.loaderClass) || LOADER_CSS_CLASSNAME, mode);
    }
}
NgxImageFallbackDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
NgxImageFallbackDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.2.13", type: NgxImageFallbackDirective, selector: "[ngxImageFallback]", inputs: { ngxImageFallback: "ngxImageFallback", ngxImageFallbackStyles: "ngxImageFallbackStyles" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxImageFallback]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { ngxImageFallback: [{
                type: Input
            }], ngxImageFallbackStyles: [{
                type: Input
            }] } });

class NgxImageFallbackModule {
}
NgxImageFallbackModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxImageFallbackModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackModule, declarations: [NgxImageFallbackDirective], exports: [NgxImageFallbackDirective] });
NgxImageFallbackModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackModule, imports: [[]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxImageFallbackDirective
                    ],
                    imports: [],
                    exports: [
                        NgxImageFallbackDirective
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-image-fallback
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxImageFallbackDirective, NgxImageFallbackModule };
//# sourceMappingURL=ngx-image-fallback.js.map
