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
        this.imageFallback = DEFAULT_FALLBACK;
        this.imageFallbackStyles = { loaderClass: LOADER_CSS_CLASSNAME, loaderColor: LOADER_COLOR };
        this.isBackgroundImage = true;
    }
    /**
     * Angular lifecycle init
     */
    ngOnInit() {
        var _a, _b, _c, _d, _e;
        // inject native loader class class if not specified by user
        if (!((_a = this.imageFallbackStyles) === null || _a === void 0 ? void 0 : _a.loaderClass) || this.imageFallbackStyles.loaderClass === LOADER_CSS_CLASSNAME) {
            const id = LOADER_CSS_CLASSNAME;
            if (!document.querySelector(`#${id}`)) {
                const styles = Object.entries(LOADER_STYLES).map((_a) => {
                    var [klassName, _b] = _a, { separator } = _b, klassAttrs = __rest(_b, ["separator"]);
                    return `${klassName}{${Object.entries(klassAttrs)
                        .map(([key, val]) => `${key}${separator[0]}${val}`)
                        .join(separator[1])}}`;
                }).join(' ')
                    + `.${LOADER_CSS_CLASSNAME}::after{border-top:2px solid ${((_b = this.imageFallbackStyles) === null || _b === void 0 ? void 0 : _b.loaderColor) || LOADER_COLOR}}`;
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
            this.showFallback(this.imageFallback || DEFAULT_FALLBACK);
            this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
        }
        else {
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
        this.updateCssClass(((_a = this.imageFallbackStyles) === null || _a === void 0 ? void 0 : _a.loaderClass) || LOADER_CSS_CLASSNAME, mode);
    }
}
NgxImageFallbackDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
NgxImageFallbackDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.2.13", type: NgxImageFallbackDirective, selector: "[ngxImageFallback]", inputs: { imageFallback: "imageFallback", imageFallbackStyles: "imageFallbackStyles" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0, type: NgxImageFallbackDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxImageFallback]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { imageFallback: [{
                type: Input
            }], imageFallbackStyles: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLWZhbGxiYWNrLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbWFnZS1mYWxsYmFjay9zcmMvbGliL25neC1pbWFnZS1mYWxsYmFjay5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFxQixNQUFNLGVBQWUsQ0FBQzs7QUFFaEYsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsZUFBZTtBQUMvQyxNQUFNLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDLENBQUMsMERBQTBEO0FBQ2hILE1BQU0sdUJBQXVCLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxpRUFBaUU7QUFDekgsTUFBTSxhQUFhLEdBQUc7SUFDcEIsQ0FBQyxJQUFJLG9CQUFvQixTQUFTLENBQUMsRUFBRTtRQUNuQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3ZCLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLEdBQUc7UUFDWixTQUFTLEVBQUUsT0FBTztRQUNsQixjQUFjLEVBQUUsR0FBRztRQUNuQixRQUFRLEVBQUUsTUFBTTtLQUNqQjtJQUNELG1CQUFtQixFQUFFO1FBQ25CLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDckIsTUFBTSxFQUFFLDRCQUE0QjtRQUNwQyxJQUFJLEVBQUUsOEJBQThCO0tBQ3JDO0NBQ0YsQ0FBQztBQUNGLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFDO0FBQzNDLE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIseUJBQXlCO0lBQ3pCLDhCQUE4QjtJQUM5QixtRkFBbUY7SUFDbkYsOEZBQThGO0lBQzlGLDhGQUE4RjtJQUM5RixxR0FBcUc7SUFDckcsb0dBQW9HO0lBQ3BHLGdGQUFnRjtDQUNqRixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQU9YOzs7R0FHRztBQUlILE1BQU0sT0FBTyx5QkFBeUI7SUFVcEMsWUFDbUIsT0FBbUIsRUFDbkIsU0FBb0I7UUFEcEIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBVHZDLGtCQUFhLEdBQVcsZ0JBQWdCLENBQUM7UUFHekMsd0JBQW1CLEdBQWlCLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUU3RixzQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFLN0IsQ0FBQztJQUVMOztPQUVHO0lBQ0gsUUFBUTs7UUFDTiw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLENBQUEsTUFBQSxJQUFJLENBQUMsbUJBQW1CLDBDQUFFLFdBQVcsQ0FBQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEtBQUssb0JBQW9CLEVBQUU7WUFDM0csTUFBTSxFQUFFLEdBQUcsb0JBQW9CLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FDOUMsQ0FBQyxFQUF5QyxFQUFFLEVBQUU7d0JBQTdDLENBQUMsU0FBUyxVQUErQixFQUE3QixFQUFFLFNBQVMsT0FBaUIsRUFBWixVQUFVLGNBQTFCLGFBQTRCLENBQUY7b0JBQVEsT0FBQSxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt5QkFDdEYsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQzt5QkFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FDbEIsR0FBRyxDQUFBO2lCQUFBLENBQ04sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO3NCQUNQLElBQUksb0JBQW9CLGdDQUFnQyxDQUFBLE1BQUEsSUFBSSxDQUFDLG1CQUFtQiwwQ0FBRSxXQUFXLEtBQUksWUFBWSxHQUFHLENBQUM7Z0JBQ3JILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2xEO1NBQ0Y7UUFFRCxrQ0FBa0M7UUFDbEMsTUFBTSxNQUFNLEdBQVcsQ0FBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLDBDQUFFLEtBQUssMENBQUUsZUFBZSxNQUFJLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLDBDQUFFLEdBQUcsQ0FBQSxJQUFJLEVBQUUsQ0FBQztRQUNuSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFDO1FBQy9HLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDOUYsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUUxQyxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDeEQsb0VBQW9FO1lBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEQ7YUFBTTtZQUNMLG1DQUFtQztZQUNuQyxNQUFNLGVBQWUsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3BDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsZ0JBQWdCLENBQUM7WUFFdkMsb0VBQW9FO1lBQ3BFLGVBQWUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksZ0JBQWdCLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUM7WUFFRixpQ0FBaUM7WUFDakMsZUFBZSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFlBQVksQ0FBQyxhQUFxQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixzQ0FBc0M7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxhQUFhLElBQUksQ0FBQyxDQUFDO1NBQ3BHO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDL0U7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGNBQWMsQ0FBQyxLQUFhLEVBQUUsSUFBYTtRQUN6QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUN0QyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsSUFBYTs7UUFDeEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDdEMsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMvQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDM0M7U0FDRjtRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQSxNQUFBLElBQUksQ0FBQyxtQkFBbUIsMENBQUUsV0FBVyxLQUFJLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNGLENBQUM7O3VIQWpIVSx5QkFBeUI7MkdBQXpCLHlCQUF5Qjs0RkFBekIseUJBQXlCO2tCQUhyQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9CO3lIQUlDLGFBQWE7c0JBRFosS0FBSztnQkFJTixtQkFBbUI7c0JBRGxCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5jb25zdCBMT0FERVJfQ09MT1IgPSAnI2FiY2RlZic7IC8vIGxvYWRlciBjb2xvclxuY29uc3QgTE9BREVSX0NTU19DTEFTU05BTUUgPSAnaW1hZ2UtZmFsbGJhY2stbG9hZGVyJzsgLy8gYWRkIHRoaXMgY2xhc3Mgd2hpbGUgbG9hZGluZyBvciBjbGFzcyBzcGVjaWZpZWQgYnkgdXNlclxuY29uc3QgRElSX0VSUk9SX0NTU19DTEFTU05BTUUgPSAnaW1hZ2UtZmFsbGJhY2stZXJyb3InOyAvLyBhZGQgY2xhc3Mgb24gZXJyb3IgKGZvciB1c2VyIHRvIGRlY2lkZSBpZiBhbnl0aGluZyBlbHNlIHRvIGRvKVxuY29uc3QgTE9BREVSX1NUWUxFUyA9IHtcbiAgW2AuJHtMT0FERVJfQ1NTX0NMQVNTTkFNRX06OmFmdGVyYF06IHtcbiAgICAnc2VwYXJhdG9yJzogWyc6JywgJzsnXSxcbiAgICAnYm9yZGVyLXJhZGl1cyc6ICc1MCUnLFxuICAgICdoZWlnaHQnOiAnMTVweCcsXG4gICAgJ21heC1oZWlnaHQnOiAnMTAwJScsXG4gICAgJ2FuaW1hdGlvbic6ICcxcyByb3RhdGUgbGluZWFyIGluZmluaXRlJyxcbiAgICAnY29udGVudCc6ICdcIiBcIicsXG4gICAgJ2luc2V0JzogJzAnLFxuICAgICdkaXNwbGF5JzogJ2Jsb2NrJyxcbiAgICAnYXNwZWN0LXJhdGlvJzogJzEnLFxuICAgICdtYXJnaW4nOiAnYXV0bycsXG4gIH0sXG4gICdAa2V5ZnJhbWVzIHJvdGF0ZSc6IHtcbiAgICAnc2VwYXJhdG9yJzogWycnLCAnJ10sXG4gICAgJ2Zyb20nOiAne3RyYW5zZm9ybTogcm90YXRlKDBkZWcpO30nLFxuICAgICd0byc6ICd7dHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTt9J1xuICB9XG59O1xuY29uc3QgQktHX1JFR0VYID0gL151cmxcXChbXCInXSsuKltcIiddK1xcKSQvaTtcbmNvbnN0IERFRkFVTFRfRkFMTEJBQ0sgPSBbXG4gICdkYXRhOmltYWdlL2pwZWc7YmFzZTY0LCcsXG4gICcvOWovNEFBUVNrWkpSZ0FCQVFFQVlBQmdBQUQvJyxcbiAgJy9nQTdRMUpGUVZSUFVqb2daMlF0YW5CbFp5QjJNUzR3SUNoMWMybHVaeUJKU2tjZ1NsQkZSeUIyT0RBcExDQnhkV0ZzYVhSNUlEMGdPREFLLycsXG4gICc5c0FRd0FHQkFVR0JRUUdCZ1VHQndjR0NBb1FDZ29KQ1FvVURnOE1FQmNVR0JnWEZCWVdHaDBsSHhvYkl4d1dGaUFzSUNNbUp5a3FLUmtmTFRBdEtEQWxLQ2tvLycsXG4gICc5c0FRd0VIQndjS0NBb1RDZ29US0JvV0dpZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvLycsXG4gICc4QUFFUWdBSUFBZ0F3RWlBQUlSQVFNUkFmL0VBQmNBQVFFQkFRQUFBQUFBQUFBQUFBQUFBQUFFQlFqL3hBQWNFQUFEQVFFQkFBTUFBQUFBQUFBQUFBQUFBUUlERVJJRU1WSC8nLFxuICAneEFBWEFRRUFBd0FBQUFBQUFBQUFBQUFBQUFBQUFRSUQvOFFBRmhFQkFRRUFBQUFBQUFBQUFBQUFBQUFBQUFFaC85b0FEQU1CQUFJUkF4RUFQd0RvY0FqclRUdXRWdXM0bS8nLFxuICAnQ1RoTTBVV0FpOTdSdk0xbzZuMnBmWVNUNytNdEFHZHY4QUcwMHUwNGJsMjZYS1MrelJBbUlaK1dPeTB6N05lWnBQdFdueExwb0FBZi9aJyxcbl0uam9pbignJyk7XG5cbmludGVyZmFjZSBMb2FkZXJTdHlsZXMge1xuICBsb2FkZXJDbGFzcz86IHN0cmluZztcbiAgbG9hZGVyQ29sb3I/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogSW1hZ2UgZmFsbGJhY2sgZGlyZWN0aXZlXG4gKiBAY2F0ZWdvcnkgU2hhcmVkXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ3hJbWFnZUZhbGxiYWNrXSdcbn0pXG5leHBvcnQgY2xhc3MgTmd4SW1hZ2VGYWxsYmFja0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KClcbiAgaW1hZ2VGYWxsYmFjazogc3RyaW5nID0gREVGQVVMVF9GQUxMQkFDSztcblxuICBASW5wdXQoKVxuICBpbWFnZUZhbGxiYWNrU3R5bGVzOiBMb2FkZXJTdHlsZXMgPSB7IGxvYWRlckNsYXNzOiBMT0FERVJfQ1NTX0NMQVNTTkFNRSwgbG9hZGVyQ29sb3I6IExPQURFUl9DT0xPUiB9O1xuXG4gIHByaXZhdGUgaXNCYWNrZ3JvdW5kSW1hZ2UgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyMjogUmVuZGVyZXIyXG4gICkgeyB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbGlmZWN5Y2xlIGluaXRcbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIGluamVjdCBuYXRpdmUgbG9hZGVyIGNsYXNzIGNsYXNzIGlmIG5vdCBzcGVjaWZpZWQgYnkgdXNlclxuICAgIGlmICghdGhpcy5pbWFnZUZhbGxiYWNrU3R5bGVzPy5sb2FkZXJDbGFzcyB8fCB0aGlzLmltYWdlRmFsbGJhY2tTdHlsZXMubG9hZGVyQ2xhc3MgPT09IExPQURFUl9DU1NfQ0xBU1NOQU1FKSB7XG4gICAgICBjb25zdCBpZCA9IExPQURFUl9DU1NfQ0xBU1NOQU1FO1xuICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKSkge1xuICAgICAgICBjb25zdCBzdHlsZXMgPSBPYmplY3QuZW50cmllcyhMT0FERVJfU1RZTEVTKS5tYXAoXG4gICAgICAgICAgKFtrbGFzc05hbWUsIHsgc2VwYXJhdG9yLCAuLi5rbGFzc0F0dHJzIH1dKSA9PiBgJHtrbGFzc05hbWV9eyR7T2JqZWN0LmVudHJpZXMoa2xhc3NBdHRycylcbiAgICAgICAgICAgIC5tYXAoKFtrZXksIHZhbF0pID0+IGAke2tleX0ke3NlcGFyYXRvclswXX0ke3ZhbH1gKVxuICAgICAgICAgICAgLmpvaW4oc2VwYXJhdG9yWzFdKVxuICAgICAgICAgICAgfX1gXG4gICAgICAgICkuam9pbignICcpXG4gICAgICAgICAgKyBgLiR7TE9BREVSX0NTU19DTEFTU05BTUV9OjphZnRlcntib3JkZXItdG9wOjJweCBzb2xpZCAke3RoaXMuaW1hZ2VGYWxsYmFja1N0eWxlcz8ubG9hZGVyQ29sb3IgfHwgTE9BREVSX0NPTE9SfX1gO1xuICAgICAgICBjb25zdCBzdHlsZSA9IHRoaXMucmVuZGVyZXIyLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIGNvbnN0IHN0eWxlVmFsdWVzID0gdGhpcy5yZW5kZXJlcjIuY3JlYXRlVGV4dChzdHlsZXMpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyMi5zZXRBdHRyaWJ1dGUoc3R5bGUsICdpZCcsIGlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIuYXBwZW5kQ2hpbGQoc3R5bGUsIHN0eWxlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuaGVhZCwgc3R5bGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV4dHJhY3QgaW1hZ2UgZnJvbSBob3N0IGVsZW1lbnRcbiAgICBjb25zdCBzb3VyY2U6IHN0cmluZyA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Py5zdHlsZT8uYmFja2dyb3VuZEltYWdlIHx8IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Py5zcmMgfHwgJyc7XG4gICAgdGhpcy5pc0JhY2tncm91bmRJbWFnZSA9IEJLR19SRUdFWC50ZXN0KHNvdXJjZSkgJiYgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2ltZyc7XG4gICAgY29uc3Qgc2FuaXRhaXplZFNvdXJjZSA9IHRoaXMuaXNCYWNrZ3JvdW5kSW1hZ2UgPyBzb3VyY2Uuc2xpY2UoNSwgc291cmNlLmxlbmd0aCAtIDIpIDogc291cmNlO1xuICAgIHRoaXMudG9nZ2xlTG9hZGVyKHRydWUpOyAvLyB0dXJuIG9uIGxvYWRlclxuXG4gICAgLy8gSWYgc291cmNlIGlzIG51bGwvdW5kZWZpbmVkLzxibGFuaz5cbiAgICBpZiAoWydudWxsJywgJycsICd1bmRlZmluZWQnXS5pbmNsdWRlcyhzYW5pdGFpemVkU291cmNlKSkge1xuICAgICAgLy8gT24gZXJyb3Igc2hvdyBmYWxsYmFjayBhZGQgYSBjbGFzcyBmb3IgdXNlciB0byBkZWNpZGUgb24gdGhlIGhvc3RcbiAgICAgIHRoaXMuc2hvd0ZhbGxiYWNrKHRoaXMuaW1hZ2VGYWxsYmFjayB8fCBERUZBVUxUX0ZBTExCQUNLKTtcbiAgICAgIHRoaXMudXBkYXRlQ3NzQ2xhc3MoRElSX0VSUk9SX0NTU19DTEFTU05BTUUsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1NpbXVsYXRlIGltYWdlIGxvYWQgaW4gYmFja2dyb3VuZFxuICAgICAgY29uc3QgaW1hZ2VDb25uZWN0aW9uID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZUNvbm5lY3Rpb24uc3JjID0gc2FuaXRhaXplZFNvdXJjZTtcblxuICAgICAgLy8gT24gZXJyb3Igc2hvdyBmYWxsYmFjayBhZGQgYSBjbGFzcyBmb3IgdXNlciB0byBkZWNpZGUgb24gdGhlIGhvc3RcbiAgICAgIGltYWdlQ29ubmVjdGlvbi5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3dGYWxsYmFjayh0aGlzLmltYWdlRmFsbGJhY2sgfHwgREVGQVVMVF9GQUxMQkFDSyk7XG4gICAgICAgIHRoaXMudXBkYXRlQ3NzQ2xhc3MoRElSX0VSUk9SX0NTU19DTEFTU05BTUUsIHRydWUpO1xuICAgICAgfTtcblxuICAgICAgLy8gb24gc3VjY2VzcyB0dXJuIG9mZiB0aGUgbG9hZGVyXG4gICAgICBpbWFnZUNvbm5lY3Rpb24ub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUxvYWRlcihmYWxzZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZmFsbGJhY2sgaW1hZ2VcbiAgICogXG4gICAqIEBwYXJhbSBmYWxsYmFja0ltYWdlIGZhbGxiYWNrIGltYWdlIHVybFxuICAgKi9cbiAgc2hvd0ZhbGxiYWNrKGZhbGxiYWNrSW1hZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzQmFja2dyb3VuZEltYWdlKSB7XG4gICAgICAvLyBXZWxjb21lIFBSIGZvciBtdWx0aXBsZSBiYWNrZ3JvdW5kc1xuICAgICAgdGhpcy5yZW5kZXJlcjIuc2V0U3R5bGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdiYWNrZ3JvdW5kLWltYWdlJywgYHVybCgnJHtmYWxsYmFja0ltYWdlfScpYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3NyYycsIGZhbGxiYWNrSW1hZ2UpO1xuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUxvYWRlcihmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHJlbW92ZSB0aGUgZ2l2ZW4gY2xhc3NuYW1lIHRvIGhvc3RcbiAgICogXG4gICAqIEBwYXJhbSBrbGFzcyBjc3MgY2xhc3NuYW1lIHRvIGFkZCBvciByZW1vdmVcbiAgICogQHBhcmFtIG1vZGUgdHJ1ZSB0byBhZGQgZmFsc2UgdG8gcmVtb3ZlXG4gICAqL1xuICB1cGRhdGVDc3NDbGFzcyhrbGFzczogc3RyaW5nLCBtb2RlOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgZWwgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICBpZiAobW9kZSkge1xuICAgICAgdGhpcy5yZW5kZXJlcjIuYWRkQ2xhc3MoZWwsIGtsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlcjIucmVtb3ZlQ2xhc3MoZWwsIGtsYXNzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkL1JlbW92ZSBsb2FkZXJcbiAgICogXG4gICAqIEBwYXJhbSBtb2RlIHRydWUgdG8gYWRkIGZhbHNlIHRvIHJlbW92ZVxuICAgKi9cbiAgdG9nZ2xlTG9hZGVyKG1vZGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIC8vIGltZyBwc2V1ZG8gZWxlbWVudCBoYWNrXG4gICAgaWYgKCF0aGlzLmlzQmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBpZiAobW9kZSkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyMi5zZXRTdHlsZShlbCwgJ2NvbnRlbnQnLCAnXCIgXCInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIyLnJlbW92ZVN0eWxlKGVsLCAnY29udGVudCcpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUNzc0NsYXNzKHRoaXMuaW1hZ2VGYWxsYmFja1N0eWxlcz8ubG9hZGVyQ2xhc3MgfHwgTE9BREVSX0NTU19DTEFTU05BTUUsIG1vZGUpO1xuICB9XG5cbn0iXX0=