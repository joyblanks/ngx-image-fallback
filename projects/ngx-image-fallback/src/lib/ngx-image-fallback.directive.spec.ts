/// <reference types="vitest/globals" />
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { NgxImageFallbackDirective } from './ngx-image-fallback.directive';

// Minimal 1x1 transparent GIF (valid data URI for tests)
const VALID_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

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
  // Use invalid data URI so onerror fires in jsdom (no network)
  invalidImage: string = 'data:image/jpeg;base64,invalid';
  invalidBackgroundImage: string = 'url("data:image/jpeg;base64,invalid")';
  VALID_IMAGE = VALID_IMAGE;
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
});
