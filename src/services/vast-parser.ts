import { AdVerification, VastInformation } from "./vast-model";
import { toHttps } from "./vast-utils";

export class VastParser {
  public async getFromUrl(vastUrl: string) {
    const response = await fetch(vastUrl);
    const DOMXML = await response.text();
    return this.getInformation(DOMXML);
  }

  public getFromContent(vastText: string) {
    return this.getInformation(vastText);
  }

  private getInformation(vastText: string): VastInformation {
    try {
      const data = new window.DOMParser().parseFromString(vastText, "text/xml");
      return this.parseFile(data);
    } catch (e) {
      console.error("Could not fetch vast file", e);
      throw e;
    }
  }

  private parseFile(data: Document): VastInformation {
    return {
      mediaUrl: toHttps(this.queryXMLFile(data, "MediaFile")),
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
}
