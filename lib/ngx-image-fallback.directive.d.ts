import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
interface LoaderStyles {
    loaderClass?: string;
    loaderColor?: string;
}
/**
 * Image fallback directive
 * @category Shared
 */
export declare class NgxImageFallbackDirective implements OnInit {
    private readonly element;
    private readonly renderer2;
    ngxImageFallback: string;
    ngxImageFallbackStyles: LoaderStyles;
    private isBackgroundImage;
    constructor(element: ElementRef, renderer2: Renderer2);
    /**
     * Angular lifecycle init
     */
    ngOnInit(): void;
    /**
     * Add fallback image
     *
     * @param fallbackImage fallback image url
     */
    showFallback(fallbackImage: string): void;
    /**
     * Add or remove the given classname to host
     *
     * @param klass css classname to add or remove
     * @param mode true to add false to remove
     */
    updateCssClass(klass: string, mode: boolean): void;
    /**
     * Add/Remove loader
     *
     * @param mode true to add false to remove
     */
    toggleLoader(mode: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxImageFallbackDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxImageFallbackDirective, "[ngxImageFallback]", never, { "ngxImageFallback": "ngxImageFallback"; "ngxImageFallbackStyles": "ngxImageFallbackStyles"; }, {}, never>;
}
export {};
