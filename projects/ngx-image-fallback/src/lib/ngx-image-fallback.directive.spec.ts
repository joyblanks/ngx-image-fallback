import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxImageFallbackDirective } from './ngx-image-fallback.directive';

const VALID_IMAGE = [
  'data:image/jpeg;base64,',
  '/9j/4AAQSkZJRgABAQEAYABgAAD/',
  '/gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gODAK/',
  '9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/',
  '9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/',
  '8AAEQgAIAAgAwEiAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAAEBQj/xAAcEAADAQEBAAMAAAAAAAAAAAAAAQIDERIEMVH/',
  'xAAXAQEAAwAAAAAAAAAAAAAAAAAAAQID/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEh/9oADAMBAAIRAxEAPwDocAjrTTutVus4m/',
  'CThM0UWAi97RvM1o6n2pfYST7+MtAGdv8AG00u04bl26XKS+zRAmIZ+WOy0z7NeZpPtWnxLpoAAf/Z',
].join('');

@Component({
  selector: 'ngx-test-host',
  template: `
    <img ngxImageFallback [src]="invalidImage" />
    <div ngxImageFallback [style.bakground-image]="invalidBackgroundImage"></div>
    <img ngxImageFallback [src]="VALID_IMAGE" />
    <img [src]="invalidImage" />
    <div [style.bakground-image]="invalidBackgroundImage"></div>
  `,
})
class TestHostComponent {
  invalidImage: string = 'http://someinvalidimage.com/noimg.jpg';
  invalidBackgroundImage: string = 'url("http://someinvalidimage.com/noimg.jpg")';
}

describe('NgxImageFallbackDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let elements: DebugElement[] = [];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestHostComponent, NgxImageFallbackDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .createComponent(TestHostComponent);
    fixture.detectChanges(); // initial binding
    // all elements with an attached directive
    elements = fixture.debugElement.queryAll(By.directive(NgxImageFallbackDirective));
  });

  it('should have three directive elements', () => {
    expect(elements.length).toBe(3);
  });

  it('should have image-fallback-loader on applied directives rightaway', waitForAsync(() => {
    setTimeout(() => {
      const classList = (elements[0].nativeElement as HTMLElement).classList;
      expect(classList.contains('image-fallback-loader')).toBeTruthy();
    }, 10);
  }));

  it('should have image-fallback-error on applied directives', waitForAsync(() => {
    setTimeout(() => {
      const classList = (elements[0].nativeElement as HTMLElement).classList;
      expect(classList.contains('image-fallback-error')).toBeTruthy();
    }, 4500);
  }));

  it('should have image-fallback on applied directives', waitForAsync(() => {
    setTimeout(() => {
      const src = (elements[0].nativeElement as HTMLImageElement).src;
      expect(src).toBe(VALID_IMAGE);
    }, 4500);
  }));

});

