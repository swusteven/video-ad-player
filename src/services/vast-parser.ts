import { AdVerification, MediaFile, VastInformation } from "./vast-model";
import { VideoOptions} from "./../components/video/video";
import { toHttps } from "./vast-utils";

export class VastParser {
  
  public async getFromUrl(vastUrl: string, options: Pick<VideoOptions, "onError">) {
    let response: Response;

    try {
      response = await fetch(vastUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP Status Code:${response.status}`);
      }

    } catch (e) {
      const message =
        e instanceof Error && e.message.startsWith("HTTP")
          ? `VAST request failed (${e.message})`
          : "Invalid VAST URL or network error";

      options?.onError?.({
        source: "vast",
        element: null,
        src: vastUrl,
        message,
        nativeEvent: e,
    });
      throw e;
    }

    const DOMXML = await response.text();
    return this.getInformation(DOMXML, vastUrl, options);
  }

  public getFromContent(vastText: string, options: Pick<VideoOptions, "onError"> ) {
    return this.getInformation(vastText, "vast-content", options);
  }

  private getInformation(vastText: string, sourceUrl?: string, options?: Pick<VideoOptions, "onError"> ): VastInformation {
    try {
      const data = new window.DOMParser().parseFromString(vastText, "text/xml");
      return this.parseFile(data);
    } catch (e) {      
      options?.onError?.({
        source: "vast",
        element: null,
        src: sourceUrl,
        message: "Could not parse VAST XML",
      });      
      throw e;
    }
  }

  private parseFile(data: Document): VastInformation {
    return {      
      clickThroughUrl: this.queryXMLFile(data, "ClickThrough"),
      beacons: {
        adFirstQuartile: this.queryXMLFile(
          data,
          "Tracking[event='firstQuartile']"
        ),
        adMidpoint: this.queryXMLFile(data, "Tracking[event='midpoint']"),
        adThirdQuartile: this.queryXMLFile(
          data,
          "Tracking[event='thirdQuartile']"
        ),
        adCompleted: this.queryXMLFile(data, "Tracking[event='complete']"),
        mute: this.queryXMLFile(data, "Tracking[event='mute']"),
        unmute: this.queryXMLFile(data, "Tracking[event='unmute']"),
        pause: this.queryXMLFile(data, "Tracking[event='pause']"),
        resume: this.queryXMLFile(data, "Tracking[event='resume']"),
        impression: this.queryXMLFile(data, "Impression"),
        adStarted: this.queryXMLFile(data, "Tracking[event='start']"),
        clickThrough: this.queryXMLFile(data, "ClickTracking"),
        verificationNotExecuted: this.queryXMLFile(
          data,
          'TrackingEvents Tracking[event="verificationNotExecuted"]'
        ),
      },
      adVerifications: this.loadAdVerifications(data),
      mediaFiles: this.queryMediaFiles(data),      
    };
  }

  private loadAdVerifications(data: Document): AdVerification[] {
    let adVerifications = data.querySelectorAll("AdVerifications Verification");
    if (!adVerifications.length) {
      return [];
    }
    return Array.from(adVerifications).map((adVerification) => {
      return {
        javascriptResource: this.queryXMLFile(
          adVerification,
          "JavaScriptResource"
        ),
        apiFramework: this.queryXMLAttribute(
          adVerification.querySelector("JavaScriptResource"),
          "apiFramework"
        ),
        vendor: this.queryXMLAttribute(adVerification, "vendor"),
        verificationParameters: this.queryXMLFile(
          adVerification,
          "VerificationParameters"
        ),
      };
    });
  }

  queryXMLFile(data: Document | Element, field: string): string | undefined {
    // @ts-ignore
    return data.querySelector(field)?.firstChild.wholeText.trim();
  }

  queryXMLAttribute(
    data: Element | null,
    attributeId: string
  ): string | undefined {
    return data?.getAttribute(attributeId) ?? undefined;
  }

  queryXMLText(field: Element | null): string | undefined {
    if (!field || !field.firstChild) {
      return undefined;
    }
    // @ts-ignore
    return field.firstChild.wholeText.trim();
  }

  queryMediaFiles(data: Document): MediaFile[] {
    
    // Try to find a top-level ClosedCaptionFile
    const topLevelCCFile = data.querySelector('MediaFiles > ClosedCaptionFiles > ClosedCaptionFile');
    const mediaFileElements = data.querySelectorAll('MediaFile');
    
    // Extract top-level closed caption data once if present
    const topLevelClosedCaptionFile = topLevelCCFile
    ? this.queryXMLFile(data, 'MediaFiles > ClosedCaptionFiles > ClosedCaptionFile')
    : undefined;
    const topLevelClosedCaptionLanguage = topLevelCCFile
    ? this.queryXMLAttribute(topLevelCCFile, 'language')
    : undefined;
    
    const mediaFiles: MediaFile[] = Array.from(mediaFileElements).map(
      (field) => {
        const mediaUrl = toHttps(this.queryXMLText(field));
        const width = this.queryXMLAttribute(field, "width");
        const height = this.queryXMLAttribute(field, "height");
        const aspectRatio =
          width && height ? parseInt(width) / parseInt(height) : undefined;

        // Use top-level CC info if present, else fallback to per-field
        const closedCaptionFile =
          topLevelClosedCaptionFile ??
          this.queryXMLFile(field, "ClosedCaptionFiles > ClosedCaptionFile");
        const closedCaptionLanguage =
          topLevelClosedCaptionLanguage ??
          this.queryXMLAttribute(
            field.querySelector("ClosedCaptionFiles > ClosedCaptionFile"),
            "language"
          );

        return {
          mediaUrl,
          width,
          height,
          aspectRatio,
          closedCaptionFile,
          closedCaptionLanguage,
        };
      }
    );
    
    return mediaFiles;
  }

}
