/// <reference types="vitest/globals" />
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { DEFAULT_FALLBACK, NgxImageFallbackDirective } from './ngx-image-fallback.directive';

// Minimal 1x1 transparent GIF (valid data URI for tests)
const VALID_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const INVALID_IMAGE = 'data:image/jpeg;base64,invalid';

@Component({
  selector: 'ngx-test-host',
  standalone: true,
  imports: [NgxImageFallbackDirective],
  template: `
    <img ngxImageFallback [src]="invalidImage" />
    <div ngxImageFallback [style.bakground-image]="invalidBackgroundImage"></div>
    <img ngxImageFallback [src]="VALID_IMAGE" />
    <img [src]="invalidImage" />
    <div [style.bakground-image]="invalidBackgroundImage"></div>
  `,
})
class TestHostComponent {
  invalidImage: string = INVALID_IMAGE;
  invalidBackgroundImage: string = 'url("data:image/jpeg;base64,invalid")';
  VALID_IMAGE = VALID_IMAGE;
}

@Component({
  selector: 'ngx-fallback-array-host',
  standalone: true,
  imports: [NgxImageFallbackDirective],
  template: `
    <img
      ngxImageFallback
      [src]="primarySrc"
      [ngxImageFallback]="fallbackList"
      (fallbackUsed)="fallbackUsedEmitted = true"
    />
  `,
})
class FallbackArrayHostComponent {
  primarySrc = INVALID_IMAGE;
  fallbackList: string | string[] = [];
  fallbackUsedEmitted = false;
}

@Component({
  selector: 'ngx-single-fallback-host',
  standalone: true,
  imports: [NgxImageFallbackDirective],
  template: `
    <img
      ngxImageFallback
      [src]="primarySrc"
      [ngxImageFallback]="singleFallback"
      (fallbackUsed)="fallbackUsedEmitted = true"
    />
  `,
})
class SingleFallbackHostComponent {
  primarySrc = INVALID_IMAGE;
  singleFallback: string = VALID_IMAGE;
  fallbackUsedEmitted = false;
}

describe('NgxImageFallbackDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let elements: DebugElement[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(TestHostComponent);
    fixture.detectChanges();
    elements = fixture.debugElement.queryAll(By.directive(NgxImageFallbackDirective));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should have three directive elements', () => {
    expect(elements.length).toBe(3);
  });

  it('should have image-fallback-loader on applied directives right away', () => {
    vi.advanceTimersByTime(20);
    fixture.detectChanges();
    const classList = (elements[0].nativeElement as HTMLElement).classList;
    expect(classList.contains('image-fallback-loader')).toBe(true);
  });

  it('should apply fallback image when primary fails', async () => {
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    const src = (elements[0].nativeElement as HTMLImageElement).src;
    expect(src).toMatch(/^data:/);
  });

  it('should apply default data fallback when primary fails and no custom fallback', async () => {
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    const src = (elements[0].nativeElement as HTMLImageElement).src;
    expect(src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should apply fallback and error state when primary fails', async () => {
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    const el = elements[0].nativeElement as HTMLImageElement;
    expect(el.src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should not add error class when primary image loads', async () => {
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    const imgElement = elements[2].nativeElement as HTMLImageElement;
    expect(imgElement.classList.contains('image-fallback-error')).toBe(false);
  });
});

describe('NgxImageFallbackDirective with fallback array', () => {
  let fixture: ComponentFixture<FallbackArrayHostComponent>;
  let component: FallbackArrayHostComponent;
  let imgEl: HTMLImageElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.configureTestingModule({
      imports: [FallbackArrayHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(FallbackArrayHostComponent);
    component = fixture.componentInstance;
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should try fallbacks in order and use first that loads', async () => {
    component.fallbackList = [INVALID_IMAGE, DEFAULT_FALLBACK];
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    expect(imgEl.src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should use built-in default when all fallbacks in array fail', async () => {
    component.fallbackList = [INVALID_IMAGE, 'data:image/jpeg;base64,also-invalid'];
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    expect(imgEl.src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should use built-in default when fallback array is empty', async () => {
    component.fallbackList = [];
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    expect(imgEl.src).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should use first URL when it loads successfully', async () => {
    component.fallbackList = [DEFAULT_FALLBACK, INVALID_IMAGE];
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    expect(imgEl.src).toMatch(/^data:image\/jpeg;base64,/);
  });
});

describe('NgxImageFallbackDirective with single string fallback', () => {
  let fixture: ComponentFixture<SingleFallbackHostComponent>;
  let component: SingleFallbackHostComponent;
  let imgEl: HTMLImageElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.configureTestingModule({
      imports: [SingleFallbackHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(SingleFallbackHostComponent);
    component = fixture.componentInstance;
    component.singleFallback = DEFAULT_FALLBACK;
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should use single string fallback when primary fails (backward compatibility)', async () => {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(100);
    fixture.detectChanges();
    expect(imgEl.src).toMatch(/^data:image\/jpeg;base64,/);
  });
});
