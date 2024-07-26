import './style.less';
import URL from '../models/URL';
import Logger from '../modules/Logger';
import $j from 'jquery';

/**
 * @param {Element} parentElement - use to append the VideoAdPlayer.
 */
export default class VideoAdPlayer {
    constructor(parentElement, renderingData, options = {}) {
        this.parentElement = parentElement;
        this.renderingData = renderingData;
        this.options = options;

        //video player settings and elements
        this.currentLoop = 1;
        this.isPlaying = false;
        this.volume = null;
        this.maxVolume = this.setMaxVolume(this.options.maxVolume);
        this.mediaURL = null;
        this.clickThroughURL = null;
        this.videoPlayerContainer = null;
        this.videoPlayer = null;
        this.controlBar = null;
        this.volumeContainer = null;
        this.volumnLowIcon = null;
        this.volumnMutedIcon = null;
        this.playPauseContainer = null;
        this.playIcon = null;
        this.pauseIcon = null;
        this.handlePlaybackEvents = this.handlePlaybackEvents.bind(this);
        this.handleAdLoaded = this.handleAdLoaded.bind(this);
        this.isBuffering = false;

        // OMID session variables
        this.adSession = null;
        this.mediaEvents = null;
        this.adEvents = null;

        //video ad event beacons and status
        this.impression = {beacon: null, sent: false};
        this.clickThrough = {beacon: null, sent: false};
        this.adStarted = {beacon: null, sent: false};
        this.adFirstQuartile = {beacon: null, sent: false};
        this.adMidpoint = {beacon: null, sent: false};
        this.adThirdQuartile = {beacon: null, sent: false};
        this.adCompleted = {beacon: null, sent: false};
        this.muteBeacon = {beacon: null, sent: false};
        this.unmuteBeacon = {beacon: null, sent: false};
        this.pauseBeacon = {beacon: null, sent: false};
        this.resumeBeacon = {beacon: null, sent: false};

        this.buildVideoComponents();
    }

    setMaxVolume(volume) {
        if (!volume) {
            return 0.5;
        }

        if (volume <= 0 || volume > 1) {
            Logger.warn('Max volume cant be less than 0 or greater than 1. Defaulting it to 0.5');
            return 0.5;
        } else {
            return volume;
        }
    }

    buildVideoComponents() {
        try {
            if (!(this.parentElement instanceof Element)) {
                throw new Error('The VideoAdPlayer constructor parameter is NOT a DOM Element.');
            }
        }
        catch (error) {
            Logger.warn(error);
            return false;
        }


        this.videoPlayerContainer = document.createElement('div');
        this.videoPlayerContainer.classList.add('rm-video-player-container');

        this.videoPlayer = document.createElement('video');
        this.videoPlayer.classList.add('rm-ad-player');
        this.videoPlayer.muted = true;

        /**
         * Apple mobile devices only support full-screen video mode unless the video
         * elements is explicitly set with the muted and playsinline attributes.
         */
        this.videoPlayer.setAttribute('muted', '');
        this.videoPlayer.setAttribute('playsinline', '');
        this.videoPlayer.setAttribute('webkit-playsinline', '');

        //OPS-1695370 - disable Picture-in-Picture mode
        this.videoPlayer.setAttribute('disablePictureInPicture', '');
        this.volume = 0;


        const playButton = this.options.playButton ?
            this.options.playButton :
            `<svg class="play-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>`;
        const pauseButton = this.options.pauseButton ?
            this.options.pauseButton :
            `<svg class="pause-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>`;
        const lowVolumeButton = this.options.lowVolumeButton ?
            this.options.lowVolumeButton :
            `<svg class="volume-low-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
            </svg>`;
        const mutedButton = this.options.lowVolumeButton ?
            this.options.lowVolumeButton :
            `<svg class="volume-muted-icon" viewBox="0 0 24 24">
                 <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
            </svg>`;

        this.controlBar = document.createElement('div');
        this.controlBar.classList.add('rm-video-controls-container');
        this.controlBar.innerHTML = `
                <div class="controls">
                    <div class="play-pause-container">
                        <button class="play-pause-btn">
                            ${playButton}
                            ${pauseButton}
                        </button>
                    </div>
                    <div class="volume-container">
                        <button class="mute-btn">
                            ${lowVolumeButton}
                            ${mutedButton}
                        </button>        
                    </div>
                </div>`;
        this.videoPlayerContainer.appendChild(this.videoPlayer);
        this.videoPlayerContainer.appendChild(this.controlBar);

        this.volumeContainer = this.videoPlayerContainer.querySelector('.volume-container');
        this.volumnLowIcon = this.videoPlayerContainer.querySelector('.volume-low-icon');
        this.volumnMutedIcon = this.videoPlayerContainer.querySelector('.volume-muted-icon');
        this.playPauseContainer = this.videoPlayerContainer.querySelector('.play-pause-container');
        this.playIcon = this.videoPlayerContainer.querySelector('.play-icon');
        this.pauseIcon = this.videoPlayerContainer.querySelector('.pause-icon');

        this.addVideoFallBackImage();
        this.addVideoAltText();

        //empty the parent element and then append the video ad player container
        $j(this.parentElement).empty().append(this.videoPlayerContainer);
    }

    async injectJSScriptToDom(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.addEventListener('load', resolve);
            script.addEventListener('error', e => reject(e.error));
            document.head.appendChild(script);
        });
    }

    async setupOmidVerificationClient(adVerifications) {

        // Load OMID Scripts from CDN
        let sessionClient;
        try {
            await Promise.all([
                this.injectJSScriptToDom('https://static.criteo.net/banners/js/omidjs/stable/omid-session-client-v1.js'),
                this.injectJSScriptToDom('https://static.criteo.net/banners/js/omidjs/stable/omweb-v1.js')
            ]);

            sessionClient = OmidSessionClient['default'];
        } catch (e) {
            Logger.info('OMID Error: could not load OMID session client to window');
            return false;
        }
        if (!sessionClient) {
            Logger.info('OMID Error: invalid omid session client');
            return false;
        }

        const AdSession = sessionClient.AdSession;
        const Partner = sessionClient.Partner;
        const Context = sessionClient.Context;
        const VerificationScriptResource = sessionClient.VerificationScriptResource;
        const MediaEvents = sessionClient.MediaEvents;
        const AdEvents = sessionClient.AdEvents;
        const CONTENT_URL = window.location.href;
        const PARTNER_NAME = 'criteo';
        const PARTNER_VERSION = Object.keys(OmidSessionClient)[0];
        const partner = new Partner(PARTNER_NAME, PARTNER_VERSION);
        const OMSDK_SERVICE_WINDOW = window.top;

        const resources = [];
        for (const verification of adVerifications) {
            const jsResource = verification.querySelector("JavaScriptResource");

            /**
             * per the VAST spec we drop this if we do not load one of the possibly many verications
             * in the tag. From here we continue looping and add any valid verifications to be sent to omid context
             * see section 2.4.2 of the official spec https://iabtechlab.com/wp-content/uploads/2022/09/VAST_4.3.pdf
             */ 
            if (jsResource.getAttribute('apiFramework') != 'omid') {
                Logger.info('detected non-omid compatible script, skipping load, attempting to fire verificationNotExecuted');
                const notExecutedBeacon = verification.querySelector('TrackingEvents Tracking[event="verificationNotExecuted"]');
                if (!notExecutedBeacon || !notExecutedBeacon.firstChild) {
                    Logger.info('Failed to load verificationNotExecuted beacon');
                    continue;
                }
                const beacon = new URL(notExecutedBeacon.firstChild.wholeText.trim());
                beacon.drop();
                Logger.info('verificationNotExecuted beacon dropped');
                continue;
            }
            const scriptUrl = jsResource.firstChild.wholeText.trim();
            const vendor = verification.getAttribute('vendor');
            const params = verification.querySelector("VerificationParameters").firstChild.wholeText.trim();
            const accessMode = 'full';
            resources.push(new VerificationScriptResource(scriptUrl, vendor, params, accessMode));
        }

        if (resources.length < 1) {
            Logger.info('no valid verification tags detected');
            return false;
        }

        const context = new Context(partner, resources, CONTENT_URL);
        context.setVideoElement(this.videoPlayer);
        context.setServiceWindow(OMSDK_SERVICE_WINDOW);
        this.adSession = new AdSession(context);
        this.adSession.setCreativeType('video');

        // See impression type documentation to determine which type you should use.
        this.adSession.setImpressionType('beginToRender');

        if (!this.adSession.isSupported()) {
            console.log('This AdSession is not supported');
            return false;
        }

        this.adEvents = new AdEvents(this.adSession);
        this.VastProperties = sessionClient.VastProperties;
        this.mediaEvents = new MediaEvents(this.adSession);
        this.adSession.start();
        return true;
    }

    async loadAd() {
        try {
            const response = await fetch(this.renderingData.TagVideoVAST);
            const DOMXML = await response.text();
            const data = new window.DOMParser().parseFromString(DOMXML, 'text/xml');

            // OPS-1503431 extract all third party scripts
            const adVerifications = data.querySelectorAll("AdVerifications Verification");
            if (adVerifications.length) {
                const didLoadVerifications = await this.setupOmidVerificationClient(adVerifications);
                if (!didLoadVerifications) {
                    Logger.info('failed to load verifications');
                }
            }

            //get the video and clickThrough links
            this.mediaURL = data.querySelector('MediaFile').firstChild.wholeText.trim();
            this.clickThroughURL = data.querySelector('ClickThrough')?.firstChild.wholeText.trim();

            //get various beacons
            this.impression.beacon = data.querySelector('Impression').firstChild.wholeText.trim();
            this.adStarted.beacon = data.querySelector("Tracking[event='start']").firstChild.wholeText.trim();
            this.adFirstQuartile.beacon = data.querySelector("Tracking[event='firstQuartile']").firstChild.wholeText.trim();
            this.adMidpoint.beacon = data.querySelector("Tracking[event='midpoint']").firstChild.wholeText.trim();
            this.adThirdQuartile.beacon = data.querySelector("Tracking[event='thirdQuartile']").firstChild.wholeText.trim();
            this.adCompleted.beacon = data.querySelector("Tracking[event='complete']").firstChild.wholeText.trim();
            this.clickThrough.beacon = data.querySelector('ClickTracking')?.firstChild.wholeText.trim();

            /**
             * these beacons only available behind a CaC activation at retailer level:
             * https://cac.prod.crto.in/parameter/BBT/EnableAdditionalVastTrackingEvents
             */
            this.muteBeacon.beacon = data.querySelector("Tracking[event='mute']")?.firstChild?.wholeText?.trim();
            this.unmuteBeacon.beacon = data.querySelector("Tracking[event='unmute']")?.firstChild?.wholeText?.trim();
            this.pauseBeacon.beacon = data.querySelector("Tracking[event='pause']")?.firstChild?.wholeText?.trim();
            this.resumeBeacon.beacon = data.querySelector("Tracking[event='resume']")?.firstChild?.wholeText?.trim();


            // OPS-1482454 - replace the http protocol to https, otherwise Chrome will flag as unsecure;
            const firstFiveChar = this.mediaURL.slice(0, 5);
            if (firstFiveChar != 'https' && firstFiveChar.slice(0, 4) === 'http' ) {
                this.mediaURL =  this.mediaURL.replace('http', 'https');
            }

            //set the video URL
            this.videoPlayer.src = this.mediaURL;

            /**
             * OPS-1494149 / https://criteo.slack.com/archives/C04QHLFLH60/p1691509451660609
             * The 'canplay' event listener listens for 'playable' status.
             * drop the Impression beacon as soon as the video has been painted on the website, is ready to be played,
             * regardless if the video is in the viewport or not.
             */
            this.startToLoad = Date.now();
            this.videoPlayer.addEventListener('canplay', this.handleAdLoaded);

            return true;
        } catch (err) {
            throw new Error(`Unable to parse all necessary VAST data. Error:  ${err}`);
        }
    }

    handleAdLoaded () {
        Logger.info(`Video took ${Math.floor(Date.now() - this.startToLoad) / 1000} second(s) to load / reached a playable state`);

        //drop Criteo Impresion beacon
        Logger.info('Sent video ad Impression beacon');
        this.impression.sent = true;
        const beacon = new URL(this.impression.beacon);
        beacon.drop();


        //OMID: Signal Ad Load and Impression Events.
        const {adEvents, adSession, VastProperties} = this;
        adSession.registerSessionObserver((event) => {
            if (event.type === 'sessionStart') {
                const vastProperties = new VastProperties(false, 0, true, 'standalone');

                //https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/#5-signal-ad-load-event
                adEvents.loaded(vastProperties);

                // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/#6-signal-the-impression-event
                adEvents.impressionOccurred();
                Logger.info('OMID AdEvent loaded and impression occurred');

            }
        });

        //remove the canplay event as it's only needed for the first loop
        this.videoPlayer.removeEventListener('canplay', this.handleAdLoaded);
    }

    handleUIevents(entries, observer) {
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let isVisible = entry.isIntersecting;

            if (isVisible) {

                //register necessary events for video controls, clickThrough, loop etc.
                this.registerEvents();

                //destry the observer as we only need to perform actions for the above once.
                observer.unobserve(entry.target);
            }
        }
    }

    handleVideoPlayPauseObserver(entries, observer2) {
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let isVisible = entry.isIntersecting;

            if (isVisible) {
                this.playVideo();
            } else if (!isVisible && this.isPlaying) {
                this.pauseVideo();
            }
        }
    }

    startVideoAdObserver() {
        try {

            //When the video is 50% or more in the viewport, drop the Impression beacon and add necessary event listeners
            const observer = new IntersectionObserver(this.handleUIevents.bind(this), {threshold: 0.5});
            observer.observe(this.videoPlayerContainer);

            //play the video unless the video is 50% or more in the viewport.
            const observer2 = new IntersectionObserver(this.handleVideoPlayPauseObserver.bind(this), {threshold: 0.5});
            observer2.observe(this.videoPlayerContainer);
        } catch (error) {
            throw new Error(`Unable to start video ad or observer. Error:  ${error}`);
        }
    }

    registerEvents() {
        this.handleClickThrough();
        this.handleBuffering();
        this.playPauseContainer.addEventListener('click', this.handlePlayPause.bind(this));
        this.volumeContainer.addEventListener('click', this.handleVolumeChange.bind(this));
        this.videoPlayer.addEventListener('timeupdate', this.handlePlaybackEvents);
        this.videoPlayer.addEventListener('ended', this.handleLoop.bind(this));
    }

    //overwrite this if you like to register the click through event on any other element;
    handleClickThrough() {

        if (this.clickThroughURL) {
            this.videoPlayer.addEventListener('click', this.clickThroughHandler.bind(this));
        } else {

            // OPS-1694156: when there's no clickThroughURL, play or pause the video when clicked on the video player
            this.videoPlayer.addEventListener('click', this.handlePlayPause.bind(this));
        }
    }

    /**
     * OPS-1694156:
     *    If <ClickThrough> and <clickTracking> are present, send beacon and trigger a redirect
     *    If <ClickThrough> is present but <clickTracking> is missing, trigger a redirect in this case and display a warning message
     *    Anythign else, do nothing
     */
    clickThroughHandler() {

        if (this.clickThrough.beacon) {
            Logger.info('Sent video ad Click Through beacon');
            const clickThroughBeacon = new URL(this.clickThrough.beacon);
            clickThroughBeacon.drop();
        } else {
            Logger.warning('Video click tracking is missing from the response');
        }

        window.open(this.clickThroughURL, '_self');
    }

    handlePlayPause() {
        if (this.isPlaying) {
            this.pauseVideo();
            const pauseBeacon = this.pauseBeacon;
            this.sendBeacon(pauseBeacon.beacon, () => pauseBeacon.sent = true, 'pause');
        } else {
            this.playVideo();
            const resumeBeacon = this.resumeBeacon;
            this.sendBeacon(resumeBeacon.beacon, () => resumeBeacon.sent = true, 'resume');
        }
    }

    pauseVideo() {
        this.videoPlayer.pause();
        this.isPlaying = false;
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        if (this.mediaEvents) {
            this.mediaEvents.pause();
        }
        Logger.info('Paused video');
    }

    playVideo() {
        this.videoPlayer.play();
        this.isPlaying = true;
        this.pauseIcon.style.display = 'block';
        this.playIcon.style.display = 'none';
        if (this.mediaEvents) {
            this.mediaEvents.resume();
        }
        Logger.info('Playing video');
    }

    handleVolumeChange() {
        if (this.volume === 0) {

            // umute
            this.videoPlayer.volume = this.maxVolume;
            this.volume = this.maxVolume;
            this.videoPlayer.muted = false;
            this.volumnMutedIcon.style.display = 'none';
            this.volumnLowIcon.style.display = 'block';
            const unmuteBeacon = this.unmuteBeacon;
            this.sendBeacon(unmuteBeacon.beacon, () => unmuteBeacon.sent = true, 'unmute');
        } else {

            // mute
            this.videoPlayer.volume = 0;
            this.volume = 0;
            this.videoPlayer.muted = true;
            this.volumnLowIcon.style.display = 'none';
            this.volumnMutedIcon.style.display = 'block';
            const muteBeacon = this.muteBeacon;
            this.sendBeacon(muteBeacon.beacon, () => muteBeacon.sent = true, 'mute');
        }

        if (this.mediaEvents) {
            this.mediaEvents.volumeChange(this.volume);
        }
        Logger.info(`current volume is: ${this.volume}`);
    }

    handlePlaybackEvents() {
        const percent = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100;

        //only fire these beacons during the first loop
        if (this.currentLoop === 1 ) {
            if (percent >= 0.01 && !this.adStarted.sent) {
                this.adStarted.sent = true;

                Logger.info('Sent video ad start beacon');
                const adStartedBeacon = new URL(this.adStarted.beacon);
                adStartedBeacon.drop();

                if (this.mediaEvents) {
                    this.mediaEvents.start(this.videoPlayer.duration, this.videoPlayer.muted ? 0 : this.videoPlayer.volume);
                }
            }

            if (percent >= 25 && !this.adFirstQuartile.sent) {
                this.adFirstQuartile.sent = true;

                Logger.info('Sent video ad first quartile beacon');
                const adFirstQuartileBeacon = new URL(this.adFirstQuartile.beacon);
                adFirstQuartileBeacon.drop();
                if (this.mediaEvents) {
                    this.mediaEvents.firstQuartile();
                }
            }

            if (percent >= 50 && !this.adMidpoint.sent) {
                this.adMidpoint.sent = true;

                Logger.info('Sent video ad midpoint beacon');
                const adMidpointBeacon = new URL(this.adMidpoint.beacon);
                adMidpointBeacon.drop();
                if (this.mediaEvents) {
                    this.mediaEvents.midpoint();
                }
            }

            if (percent >= 75 && !this.adThirdQuartile.sent) {
                this.adThirdQuartile.sent = true;

                Logger.info('Sent video ad third quartile beacon');
                const adThirdQuartileBeacon = new URL(this.adThirdQuartile.beacon);
                adThirdQuartileBeacon.drop();
                if (this.mediaEvents) {
                    this.mediaEvents.thirdQuartile();
                }
            }
        }
    }

    /**
     * Once the first loop is completed,
     * drop the Ad Completed Beacon and then play the video again.
     */
    handleLoop() {
        if (this.currentLoop === 1) {
            Logger.info('Sent video ad completed beacon');
            const adCompletedBeacon = new URL(this.adCompleted.beacon);
            adCompletedBeacon.drop();
            if (this.mediaEvents) {
                this.mediaEvents.complete();
            }
        }

        this.videoPlayer.removeEventListener('timeupdate', this.handlePlaybackEvents);
        this.currentLoop++;
        this.videoPlayer.play();
    }

    addVideoFallBackImage() {
        const {
            fallback_image,
            optional_video_redirect_url,
            optional_redirect_target
        } = this.renderingData;


        if (!fallback_image || !optional_video_redirect_url || !optional_redirect_target) {
            Logger.error('Video fallback image or redirect URL  or redirect target cant be blank');
        } else {
            const $img = $j(`
                <a href="${optional_video_redirect_url}" target="${optional_redirect_target}">
                    <img class="rm-video-fallback-image" src="${fallback_image}">
                </a>        
            `);
            $j(this.videoPlayer).append($img);
        }
    }

    addVideoAltText() {
        const text = this.renderingData.video_alt_text;
        if (!text) {
            Logger.error('Video alt text cannot be blank');
        } else {
            $j(this.videoPlayer).attr('alt', text);
        }
    }

    sendBeacon(beaconURl, callback = undefined, beaconName = undefined) {
        if (beaconURl) {
            const url = new URL(beaconURl);
            url.drop();

            if (beaconName) {
                Logger.info(`Sent ${beaconName} beacon`);
            }

            if (callback) {
                callback();
            }
        }
    }

    handleBuffering() {
        const handleWaitingEvent = () => {
            this.isBuffering = true;
            this.mediaEvents?.bufferStart();
        };

        const handleTimeUpdateEvent = () => {
            if (this.isBuffering) {
                this.isBuffering = false;
                this.mediaEvents?.bufferFinish();
            }
        };

        this.videoPlayer.addEventListener('waiting', handleWaitingEvent.bind(this));
        this.videoPlayer.addEventListener('timeupdate', handleTimeUpdateEvent.bind(this));
    }
}
