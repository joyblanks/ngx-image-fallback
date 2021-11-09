import { __rest } from "tslib";
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
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
export class NgxImageFallbackDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLWZhbGxiYWNrLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbWFnZS1mYWxsYmFjay9zcmMvbGliL25neC1pbWFnZS1mYWxsYmFjay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFxQixNQUFNLGVBQWUsQ0FBQzs7QUFFaEYsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsZUFBZTtBQUMvQyxNQUFNLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDLENBQUMsMERBQTBEO0FBQ2hILE1BQU0sdUJBQXVCLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxpRUFBaUU7QUFDekgsTUFBTSxhQUFhLEdBQUc7SUFDcEIsQ0FBQyxJQUFJLG9CQUFvQixTQUFTLENBQUMsRUFBRTtRQUNuQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3ZCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLEdBQUc7UUFDWixTQUFTLEVBQUUsT0FBTztRQUNsQixjQUFjLEVBQUUsR0FBRztRQUNuQixRQUFRLEVBQUUsTUFBTTtLQUNqQjtJQUNELG1CQUFtQixFQUFFO1FBQ25CLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDckIsTUFBTSxFQUFFLDRCQUE0QjtRQUNwQyxJQUFJLEVBQUUsOEJBQThCO0tBQ3JDO0NBQ0YsQ0FBQztBQUNGLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFDO0FBQzNDLE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIseUJBQXlCO0lBQ3pCLDhCQUE4QjtJQUM5QixtRkFBbUY7SUFDbkYsOEZBQThGO0lB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QUF6Qix5QkFBeUI7a0JBSHJDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtpQkFDL0I7eUhBSUMsZ0JBQWdCO3NCQURmLEtBQUs7Z0JBSU4sc0JBQXNCO3NCQURyQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgTE9BREVSX0NPTE9SID0gJyNhYmNkZWYnOyAvLyBsb2FkZXIgY29sb3JcbmNvbnN0IExPQURFUl9DU1NfQ0xBU1NOQU1FID0gJ2ltYWdlLWZhbGxiYWNrLWxvYWRlcic7IC8vIGFkZCB0aGlzIGNsYXNzIHdoaWxlIGxvYWRpbmcgb3IgY2xhc3Mgc3BlY2lmaWVkIGJ5IHVzZXJcbmNvbnN0IERJUl9FUlJPUl9DU1NfQ0xBU1NOQU1FID0gJ2ltYWdlLWZhbGxiYWNrLWVycm9yJzsgLy8gYWRkIGNsYXNzIG9uIGVycm9yIChmb3IgdXNlciB0byBkZWNpZGUgaWYgYW55dGhpbmcgZWxzZSB0byBkbylcbmNvbnN0IExPQURFUl9TVFlMRVMgPSB7XG4gIFtgLiR7TE9BREVSX0NTU19DTEFTU05BTUV9OjphZnRlcmBdOiB7XG4gICAgJ3NlcGFyYXRvcic6IFsnOicsICc7J10sXG4gICAgJ2JvcmRlci1yYWRpdXMnOiAnNTAlJyxcbiAgICAnaGVpZ2h0JzogJzE1cHgnLFxuICAgICdtYXgtaGVpZ2h0JzogJzEwMCUnLFxuICAgICdhbmltYXRpb24nOiAnMXMgcm90YXRlIGxpbmVhciBpbmZpbml0ZScsXG4gICAgJ2NvbnRlbnQnOiAnXCIgXCInLFxuICAgICdpbnNldCc6ICcwJyxcbiAgICAnZGlzcGxheSc6ICdibG9jaycsXG4gICAgJ2FzcGVjdC1yYXRpbyc6ICcxJyxcbiAgICAnbWFyZ2luJzogJ2F1dG8nLFxuICB9LFxuICAnQGtleWZyYW1lcyByb3RhdGUnOiB7XG4gICAgJ3NlcGFyYXRvcic6IFsnJywgJyddLFxuICAgICdmcm9tJzogJ3t0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTt9JyxcbiAgICAndG8nOiAne3RyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7fSdcbiAgfVxufTtcbmNvbnN0IEJLR19SRUdFWCA9IC9edXJsXFwoW1wiJ10rLipbXCInXStcXCkkL2k7XG5jb25zdCBERUZBVUxUX0ZBTExCQUNLID0gW1xuICAnZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwnLFxuICAnLzlqLzRBQVFTa1pKUmdBQkFRRUFZQUJnQUFELycsXG4gICcvZ0E3UTFKRlFWUlBVam9nWjJRdGFuQmxaeUIyTVM0d0lDaDFjMmx1WnlCSlNrY2dTbEJGUnlCMk9EQXBMQ0J4ZFdGc2FYUjVJRDBnT0RBSy8nLFxuICAnOXNBUXdBR0JBVUdCUVFHQmdVR0J3Y0dDQW9RQ2dvSkNRb1VEZzhNRUJjVUdCZ1hGQllXR2gwbEh4b2JJeHdXRmlBc0lDTW1KeWtxS1JrZkxUQXRLREFsS0Nrby8nLFxuICAnOXNBUXdFSEJ3Y0tDQW9UQ2dvVEtCb1dHaWdvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnby8nLFxuICAnOEFBRVFnQUlBQWdBd0VpQUFJUkFRTVJBZi9FQUJjQUFRRUJBUUFBQUFBQUFBQUFBQUFBQUFBRUJRai94QUFjRUFBREFRRUJBQU1BQUFBQUFBQUFBQUFBQVFJREVSSUVNVkgvJyxcbiAgJ3hBQVhBUUVBQXdBQUFBQUFBQUFBQUFBQUFBQUFBUUlELzhRQUZoRUJBUUVBQUFBQUFBQUFBQUFBQUFBQUFBRWgvOW9BREFNQkFBSVJBeEVBUHdEb2NBanJUVHV0VnVzNG0vJyxcbiAgJ0NUaE0wVVdBaTk3UnZNMW82bjJwZllTVDcrTXRBR2R2OEFHMDB1MDRibDI2WEtTK3pSQW1JWitXT3kwejdOZVpwUHRXbnhMcG9BQWYvWicsXG5dLmpvaW4oJycpO1xuXG5pbnRlcmZhY2UgTG9hZGVyU3R5bGVzIHtcbiAgbG9hZGVyQ2xhc3M/OiBzdHJpbmc7XG4gIGxvYWRlckNvbG9yPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEltYWdlIGZhbGxiYWNrIGRpcmVjdGl2ZVxuICogQGNhdGVnb3J5IFNoYXJlZFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmd4SW1hZ2VGYWxsYmFja10nXG59KVxuZXhwb3J0IGNsYXNzIE5neEltYWdlRmFsbGJhY2tEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpXG4gIG5neEltYWdlRmFsbGJhY2s6IHN0cmluZyA9IERFRkFVTFRfRkFMTEJBQ0s7XG5cbiAgQElucHV0KClcbiAgbmd4SW1hZ2VGYWxsYmFja1N0eWxlczogTG9hZGVyU3R5bGVzID0geyBsb2FkZXJDbGFzczogTE9BREVSX0NTU19DTEFTU05BTUUsIGxvYWRlckNvbG9yOiBMT0FERVJfQ09MT1IgfTtcblxuICBwcml2YXRlIGlzQmFja2dyb3VuZEltYWdlID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMlxuICApIHsgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIGxpZmVjeWNsZSBpbml0XG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBpbmplY3QgbmF0aXZlIGxvYWRlciBjbGFzcyBjbGFzcyBpZiBub3Qgc3BlY2lmaWVkIGJ5IHVzZXJcbiAgICBpZiAoIXRoaXMubmd4SW1hZ2VGYWxsYmFja1N0eWxlcz8ubG9hZGVyQ2xhc3MgfHwgdGhpcy5uZ3hJbWFnZUZhbGxiYWNrU3R5bGVzLmxvYWRlckNsYXNzID09PSBMT0FERVJfQ1NTX0NMQVNTTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBMT0FERVJfQ1NTX0NMQVNTTkFNRTtcbiAgICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCkpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gT2JqZWN0LmVudHJpZXMoTE9BREVSX1NUWUxFUykubWFwKFxuICAgICAgICAgIChba2xhc3NOYW1lLCB7IHNlcGFyYXRvciwgLi4ua2xhc3NBdHRycyB9XSkgPT4gYCR7a2xhc3NOYW1lfXske09iamVjdC5lbnRyaWVzKGtsYXNzQXR0cnMpXG4gICAgICAgICAgICAubWFwKChba2V5LCB2YWxdKSA9PiBgJHtrZXl9JHtzZXBhcmF0b3JbMF19JHt2YWx9YClcbiAgICAgICAgICAgIC5qb2luKHNlcGFyYXRvclsxXSlcbiAgICAgICAgICAgIH19YFxuICAgICAgICApLmpvaW4oJyAnKVxuICAgICAgICAgICsgYC4ke0xPQURFUl9DU1NfQ0xBU1NOQU1FfTo6YWZ0ZXJ7Ym9yZGVyLXRvcDoycHggc29saWQgJHt0aGlzLm5neEltYWdlRmFsbGJhY2tTdHlsZXM/LmxvYWRlckNvbG9yIHx8IExPQURFUl9DT0xPUn19YDtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLnJlbmRlcmVyMi5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBjb25zdCBzdHlsZVZhbHVlcyA9IHRoaXMucmVuZGVyZXIyLmNyZWF0ZVRleHQoc3R5bGVzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIuc2V0QXR0cmlidXRlKHN0eWxlLCAnaWQnLCBpZCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIyLmFwcGVuZENoaWxkKHN0eWxlLCBzdHlsZVZhbHVlcyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIyLmFwcGVuZENoaWxkKGRvY3VtZW50LmhlYWQsIHN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IGltYWdlIGZyb20gaG9zdCBlbGVtZW50XG4gICAgY29uc3Qgc291cmNlOiBzdHJpbmcgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudD8uc3R5bGU/LmJhY2tncm91bmRJbWFnZSB8fCB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudD8uc3JjIHx8ICcnO1xuICAgIHRoaXMuaXNCYWNrZ3JvdW5kSW1hZ2UgPSBCS0dfUkVHRVgudGVzdChzb3VyY2UpICYmIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbWcnO1xuICAgIGNvbnN0IHNhbml0YWl6ZWRTb3VyY2UgPSB0aGlzLmlzQmFja2dyb3VuZEltYWdlID8gc291cmNlLnNsaWNlKDUsIHNvdXJjZS5sZW5ndGggLSAyKSA6IHNvdXJjZTtcbiAgICB0aGlzLnRvZ2dsZUxvYWRlcih0cnVlKTsgLy8gdHVybiBvbiBsb2FkZXJcblxuICAgIC8vIElmIHNvdXJjZSBpcyBudWxsL3VuZGVmaW5lZC88Ymxhbms+XG4gICAgaWYgKFsnbnVsbCcsICcnLCAndW5kZWZpbmVkJ10uaW5jbHVkZXMoc2FuaXRhaXplZFNvdXJjZSkpIHtcbiAgICAgIC8vIE9uIGVycm9yIHNob3cgZmFsbGJhY2sgYWRkIGEgY2xhc3MgZm9yIHVzZXIgdG8gZGVjaWRlIG9uIHRoZSBob3N0XG4gICAgICB0aGlzLnNob3dGYWxsYmFjayh0aGlzLm5neEltYWdlRmFsbGJhY2sgfHwgREVGQVVMVF9GQUxMQkFDSyk7XG4gICAgICB0aGlzLnVwZGF0ZUNzc0NsYXNzKERJUl9FUlJPUl9DU1NfQ0xBU1NOQU1FLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9TaW11bGF0ZSBpbWFnZSBsb2FkIGluIGJhY2tncm91bmRcbiAgICAgIGNvbnN0IGltYWdlQ29ubmVjdGlvbiA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2VDb25uZWN0aW9uLnNyYyA9IHNhbml0YWl6ZWRTb3VyY2U7XG5cbiAgICAgIC8vIE9uIGVycm9yIHNob3cgZmFsbGJhY2sgYWRkIGEgY2xhc3MgZm9yIHVzZXIgdG8gZGVjaWRlIG9uIHRoZSBob3N0XG4gICAgICBpbWFnZUNvbm5lY3Rpb24ub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zaG93RmFsbGJhY2sodGhpcy5uZ3hJbWFnZUZhbGxiYWNrIHx8IERFRkFVTFRfRkFMTEJBQ0spO1xuICAgICAgICB0aGlzLnVwZGF0ZUNzc0NsYXNzKERJUl9FUlJPUl9DU1NfQ0xBU1NOQU1FLCB0cnVlKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIG9uIHN1Y2Nlc3MgdHVybiBvZmYgdGhlIGxvYWRlclxuICAgICAgaW1hZ2VDb25uZWN0aW9uLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVMb2FkZXIoZmFsc2UpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGZhbGxiYWNrIGltYWdlXG4gICAqIFxuICAgKiBAcGFyYW0gZmFsbGJhY2tJbWFnZSBmYWxsYmFjayBpbWFnZSB1cmxcbiAgICovXG4gIHNob3dGYWxsYmFjayhmYWxsYmFja0ltYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0JhY2tncm91bmRJbWFnZSkge1xuICAgICAgLy8gV2VsY29tZSBQUiBmb3IgbXVsdGlwbGUgYmFja2dyb3VuZHNcbiAgICAgIHRoaXMucmVuZGVyZXIyLnNldFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYmFja2dyb3VuZC1pbWFnZScsIGB1cmwoJyR7ZmFsbGJhY2tJbWFnZX0nKWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyMi5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzcmMnLCBmYWxsYmFja0ltYWdlKTtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVMb2FkZXIoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgdGhlIGdpdmVuIGNsYXNzbmFtZSB0byBob3N0XG4gICAqIFxuICAgKiBAcGFyYW0ga2xhc3MgY3NzIGNsYXNzbmFtZSB0byBhZGQgb3IgcmVtb3ZlXG4gICAqIEBwYXJhbSBtb2RlIHRydWUgdG8gYWRkIGZhbHNlIHRvIHJlbW92ZVxuICAgKi9cbiAgdXBkYXRlQ3NzQ2xhc3Moa2xhc3M6IHN0cmluZywgbW9kZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKG1vZGUpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIyLmFkZENsYXNzKGVsLCBrbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIyLnJlbW92ZUNsYXNzKGVsLCBrbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZC9SZW1vdmUgbG9hZGVyXG4gICAqIFxuICAgKiBAcGFyYW0gbW9kZSB0cnVlIHRvIGFkZCBmYWxzZSB0byByZW1vdmVcbiAgICovXG4gIHRvZ2dsZUxvYWRlcihtb2RlOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgZWwgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICAvLyBpbWcgcHNldWRvIGVsZW1lbnQgaGFja1xuICAgIGlmICghdGhpcy5pc0JhY2tncm91bmRJbWFnZSkge1xuICAgICAgaWYgKG1vZGUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIuc2V0U3R5bGUoZWwsICdjb250ZW50JywgJ1wiIFwiJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlcmVyMi5yZW1vdmVTdHlsZShlbCwgJ2NvbnRlbnQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51cGRhdGVDc3NDbGFzcyh0aGlzLm5neEltYWdlRmFsbGJhY2tTdHlsZXM/LmxvYWRlckNsYXNzIHx8IExPQURFUl9DU1NfQ0xBU1NOQU1FLCBtb2RlKTtcbiAgfVxuXG59Il19