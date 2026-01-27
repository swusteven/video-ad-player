import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render } from '@testing-library/preact';
import { ClosedCaption } from '../closed-caption';
import * as videoUtils from '../../../services/video-utils';

vi.mock('../../../services/video-utils');

describe('ClosedCaption', () => {
  let mockTextTrack: { mode: string; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> };
  let originalTrackDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    mockTextTrack = {
      mode: 'showing',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    originalTrackDescriptor = Object.getOwnPropertyDescriptor(HTMLTrackElement.prototype, 'track');
    
    Object.defineProperty(HTMLTrackElement.prototype, 'track', {
      get: () => mockTextTrack,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    if (originalTrackDescriptor) {
      Object.defineProperty(HTMLTrackElement.prototype, 'track', originalTrackDescriptor);
    }
  });

  it('should hide native textTrack element - hideNativeCCBox()', () => {
    render(
      <ClosedCaption
        closedCaptionFile="test.vtt"
        closedCaptionLanguage="en"
        setCcContent={vi.fn()}
      />
    );

    expect(mockTextTrack.mode).toBe('hidden');
  });

  it('should have expected CC text content in track element activeCues', () => {
    const expectedText = 'Test caption text';
    const setCcContent = vi.fn();
    
    // Mock getCueText to return the expected text
    vi.mocked(videoUtils.getCueText).mockReturnValue(expectedText);
    
    // Mock a cue with the expected text
    const mockCue = {
      text: expectedText,
    };

    const mockTextTrack = {
      mode: 'showing',
      activeCues: [mockCue],
      addEventListener: vi.fn((event, handler) => {
        if (event === 'cuechange') {
          handler();
        }
      }),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(HTMLTrackElement.prototype, 'track', {
      get: () => mockTextTrack,
      configurable: true,
    });

    const trackElementAddEventListenerSpy = vi.fn((event, handler) => {
      if (event === 'load') {
        handler();
      }
    });

    Object.defineProperty(HTMLTrackElement.prototype, 'addEventListener', {
      value: trackElementAddEventListenerSpy,
      configurable: true,
    });

    render(
      <ClosedCaption
        closedCaptionFile="test.vtt"
        closedCaptionLanguage="en"
        setCcContent={setCcContent}
      />
    );

    // Verify that the track element has the expectedText in its activeCues
    expect(mockTextTrack.activeCues).toBeTruthy();
    expect(mockTextTrack.activeCues[0].text).toBe(expectedText);
    // Verify setCcContent was called with the text from activeCues
    expect(setCcContent).toHaveBeenCalledWith(expectedText);
  });
});

