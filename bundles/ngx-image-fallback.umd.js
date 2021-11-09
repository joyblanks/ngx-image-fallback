(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-image-fallback', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ngx-image-fallback"] = {}, global.ng.core));
})(this, (function (exports, i0) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var _f;
    var LOADER_COLOR = '#abcdef'; // loader color
    var LOADER_CSS_CLASSNAME = 'image-fallback-loader'; // add this class while loading or class specified by user
    var DIR_ERROR_CSS_CLASSNAME = 'image-fallback-error'; // add class on error (for user to decide if anything else to do)
    var LOADER_STYLES = (_f = {},
        _f["." + LOADER_CSS_CLASSNAME + "::after"] = {
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
        _f['@keyframes rotate'] = {
            'separator': ['', ''],
            'from': '{transform: rotate(0deg);}',
            'to': '{transform: rotate(360deg);}'
        },
        _f);
    var BKG_REGEX = /^url\(["']+.*["']+\)$/i;
    var DEFAULT_FALLBACK = [
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
    var NgxImageFallbackDirective = /** @class */ (function () {
        function NgxImageFallbackDirective(element, renderer2) {
            this.element = element;
            this.renderer2 = renderer2;
            this.ngxImageFallback = DEFAULT_FALLBACK;
            this.ngxImageFallbackStyles = { loaderClass: LOADER_CSS_CLASSNAME, loaderColor: LOADER_COLOR };
            this.isBackgroundImage = true;
        }
        /**
         * Angular lifecycle init
         */
        NgxImageFallbackDirective.prototype.ngOnInit = function () {
            var _this = this;
            var _a, _b, _c, _d, _e;
            // inject native loader class class if not specified by user
            if (!((_a = this.ngxImageFallbackStyles) === null || _a === void 0 ? void 0 : _a.loaderClass) || this.ngxImageFallbackStyles.loaderClass === LOADER_CSS_CLASSNAME) {
                var id = LOADER_CSS_CLASSNAME;
                if (!document.querySelector("#" + id)) {
                    var styles = Object.entries(LOADER_STYLES).map(function (_a) {
                        var _f = __read(_a, 2), klassName = _f[0], _b = _f[1], separator = _b.separator, klassAttrs = __rest(_b, ["separator"]);
                        return klassName + "{" + Object.entries(klassAttrs)
                            .map(function (_f) {
                            var _g = __read(_f, 2), key = _g[0], val = _g[1];
                            return "" + key + separator[0] + val;
                        })
                            .join(separator[1]) + "}";
                    }).join(' ')
                        + ("." + LOADER_CSS_CLASSNAME + "::after{border-top:2px solid " + (((_b = this.ngxImageFallbackStyles) === null || _b === void 0 ? void 0 : _b.loaderColor) || LOADER_COLOR) + "}");
                    var style = this.renderer2.createElement('style');
                    var styleValues = this.renderer2.createText(styles);
                    this.renderer2.setAttribute(style, 'id', id);
                    this.renderer2.appendChild(style, styleValues);
                    this.renderer2.appendChild(document.head, style);
                }
            }
            // extract image from host element
            var source = ((_d = (_c = this.element.nativeElement) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.backgroundImage) || ((_e = this.element.nativeElement) === null || _e === void 0 ? void 0 : _e.src) || '';
            this.isBackgroundImage = BKG_REGEX.test(source) && this.element.nativeElement.nodeName.toLowerCase() !== 'img';
            var sanitaizedSource = this.isBackgroundImage ? source.slice(5, source.length - 2) : source;
            this.toggleLoader(true); // turn on loader
            // If source is null/undefined/<blank>
            if (['null', '', 'undefined'].includes(sanitaizedSource)) {
                // On error show fallback add a class for user to decide on the host
                this.showFallback(this.ngxImageFallback || DEFAULT_FALLBACK);
                this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
            }
            else {
                //Simulate image load in background
                var imageConnection = new Image();
                imageConnection.src = sanitaizedSource;
                // On error show fallback add a class for user to decide on the host
                imageConnection.onerror = function () {
                    _this.showFallback(_this.ngxImageFallback || DEFAULT_FALLBACK);
                    _this.updateCssClass(DIR_ERROR_CSS_CLASSNAME, true);
                };
                // on success turn off the loader
                imageConnection.onload = function () {
                    _this.toggleLoader(false);
                };
            }
        };
        /**
         * Add fallback image
         *
         * @param fallbackImage fallback image url
         */
        NgxImageFallbackDirective.prototype.showFallback = function (fallbackImage) {
            if (this.isBackgroundImage) {
                // Welcome PR for multiple backgrounds
                this.renderer2.setStyle(this.element.nativeElement, 'background-image', "url('" + fallbackImage + "')");
            }
            else {
                this.renderer2.setAttribute(this.element.nativeElement, 'src', fallbackImage);
            }
            this.toggleLoader(false);
        };
        /**
         * Add or remove the given classname to host
         *
         * @param klass css classname to add or remove
         * @param mode true to add false to remove
         */
        NgxImageFallbackDirective.prototype.updateCssClass = function (klass, mode) {
            var el = this.element.nativeElement;
            if (mode) {
                this.renderer2.addClass(el, klass);
            }
            else {
                this.renderer2.removeClass(el, klass);
            }
        };
        /**
         * Add/Remove loader
         *
         * @param mode true to add false to remove
         */
        NgxImageFallbackDirective.prototype.toggleLoader = function (mode) {
            var _a;
            var el = this.element.nativeElement;
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
        };
        return NgxImageFallbackDirective;
    }());
    NgxImageFallbackDirective.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackDirective, deps: [{ token: i0__namespace.ElementRef }, { token: i0__namespace.Renderer2 }], target: i0__namespace.ɵɵFactoryTarget.Directive });
    NgxImageFallbackDirective.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.2.13", type: NgxImageFallbackDirective, selector: "[ngxImageFallback]", inputs: { ngxImageFallback: "ngxImageFallback", ngxImageFallbackStyles: "ngxImageFallbackStyles" }, ngImport: i0__namespace });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackDirective, decorators: [{
                type: i0.Directive,
                args: [{
                        selector: '[ngxImageFallback]'
                    }]
            }], ctorParameters: function () { return [{ type: i0__namespace.ElementRef }, { type: i0__namespace.Renderer2 }]; }, propDecorators: { ngxImageFallback: [{
                    type: i0.Input
                }], ngxImageFallbackStyles: [{
                    type: i0.Input
                }] } });

    var NgxImageFallbackModule = /** @class */ (function () {
        function NgxImageFallbackModule() {
        }
        return NgxImageFallbackModule;
    }());
    NgxImageFallbackModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    NgxImageFallbackModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackModule, declarations: [NgxImageFallbackDirective], exports: [NgxImageFallbackDirective] });
    NgxImageFallbackModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackModule, imports: [[]] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: NgxImageFallbackModule, decorators: [{
                type: i0.NgModule,
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

    exports.NgxImageFallbackDirective = NgxImageFallbackDirective;
    exports.NgxImageFallbackModule = NgxImageFallbackModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-image-fallback.umd.js.map
