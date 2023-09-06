/*
 * (C) Copyright 2014-2015 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let fronLogger = require("./logger");
let webrtc_const = require("./webRTC");
let socket = webrtc_const.socket;

require('webrtc-adapter');

let freeice = require('freeice');
let inherits = require('inherits');
let UAParser = require('ua-parser-js');
let uuidv4 = require('uuid/v4');
let hark = require('hark');
let AdapterJS = require("webrtc-adapter");
let EventEmitter = require('events').EventEmitter;
let recursive = require('merge').recursive.bind(undefined, true);
let sdpTranslator = require('sdp-translator');

let logger = (typeof window === 'undefined') ? console : window.Logger ||
    console;

let MEDIA_CONSTRAINTS = {
    audio: true,
    video: {
        width: 640,
        framerate: 15
    }
};

// Somehow, the UAParser constructor gets an empty window object.
// We need to pass the user agent string in order to get information
let ua = (typeof window !== 'undefined' && window.navigator) ? window.navigator
    .userAgent : '';
let parser = new UAParser(ua);
let browser = parser.getBrowser();

function insertScriptSrcInHtmlDom(scriptSrc) {
    //Create a script tag
    let script = document.createElement('script');
    // Assign a URL to the script element
    script.src = scriptSrc;
    // Get the first script tag on the page (we'll insert our new one before it)
    let ref = document.querySelector('script');
    // Insert the new node before the reference node
    ref.parentNode.insertBefore(script, ref);
}

function importScriptsDependsOnBrowser() {
    if (browser.name === 'IE') {
        insertScriptSrcInHtmlDom(
            "https://cdn.temasys.io/adapterjs/0.15.x/adapter.debug.js");
    }
}

importScriptsDependsOnBrowser();
let usePlanB = false;
if (browser.name === 'Chrome' || browser.name === 'Chromium') {
    usePlanB = true;
}

function noop(error) {
    if (error) logger.error("kurento-dev noop error. ", error);
}

function trackStop(track) {
    track.stop && track.stop();
}

function streamStop(stream) {
    stream.getTracks().forEach(trackStop);
}

/**
 * Returns a string representation of a SessionDescription object.
 */
let dumpSDP = function (description) {
    if (typeof description === 'undefined' || description === null) {
        return '';
    }
    return 'type: ' + description.type + '\r\n' + description.sdp;
};

function bufferizeCandidates(pc, onerror) {
    let candidatesQueue = [];

    function setSignalingstatechangeAccordingWwebBrowser(functionToExecute, pc) {
        if (typeof AdapterJS !== 'undefined' && AdapterJS.webrtcDetectedBrowser ===
            'IE' && AdapterJS.webrtcDetectedVersion >= 9) {
            pc.onsignalingstatechange = functionToExecute;
        } else {
            pc.addEventListener('signalingstatechange', functionToExecute);
        }
    }

    let signalingstatechangeFunction = function () {
        if (pc.signalingState === 'stable') {
            while (candidatesQueue.length) {
                let entry = candidatesQueue.shift();
                pc.addIceCandidate(entry.candidate, entry.callback, entry.callback);
            }
        }
    };

    setSignalingstatechangeAccordingWwebBrowser(signalingstatechangeFunction, pc);
    return function (candidate, callback) {
        callback = callback || onerror;
        switch (pc.signalingState) {
            case 'closed':
                callback(new Error('PeerConnection object is closed'));
                break;
            case 'stable':
                if (pc.remoteDescription) {
                    pc.addIceCandidate(candidate, callback, callback);
                    break;
                }
            default:
                candidatesQueue.push({
                    candidate: candidate,
                    callback: callback
                });
        }
    };
}

/* Simulcast utilities */
function removeFIDFromOffer(sdp) {
    let n = sdp.indexOf("a=ssrc-group:FID");
    if (n > 0) {
        return sdp.slice(0, n);
    } else {
        return sdp;
    }
}

function getSimulcastInfo(videoStream) {
    let videoTracks = videoStream.getVideoTracks();
    if (!videoTracks.length) {
        logger.warn('No video tracks available in the video stream (kurento-dev)');
        return '';
    }
    let lines = [
        'a=x-google-flag:conference',
        'a=ssrc-group:SIM 1 2 3',
        'a=ssrc:1 cname:localVideo',
        'a=ssrc:1 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:1 mslabel:' + videoStream.id,
        'a=ssrc:1 label:' + videoTracks[0].id,
        'a=ssrc:2 cname:localVideo',
        'a=ssrc:2 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:2 mslabel:' + videoStream.id,
        'a=ssrc:2 label:' + videoTracks[0].id,
        'a=ssrc:3 cname:localVideo',
        'a=ssrc:3 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:3 mslabel:' + videoStream.id,
        'a=ssrc:3 label:' + videoTracks[0].id
    ];

    lines.push('');
    return lines.join('\n');
}

function sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function setIceCandidateAccordingWebBrowser(functionToExecute, pc) {
    if (typeof AdapterJS !== 'undefined' && AdapterJS.webrtcDetectedBrowser ===
        'IE' && AdapterJS.webrtcDetectedVersion >= 9) {
        pc.onicecandidate = functionToExecute;
    } else {
        pc.addEventListener('icecandidate', functionToExecute);
    }
}

/**
 * Wrapper object of an RTCPeerConnection. This object is aimed to simplify the
 * development of WebRTC-based applications.
 *
 * @constructor module:kurentoUtils.WebRtcPeer
 *
 * @param {String} mode Mode in which the PeerConnection will be configured.
 *  Valid values are: 'recvonly', 'sendonly', and 'sendrecv'
 * @param localVideo Video tag for the local stream
 * @param remoteVideo Video tag for the remote stream
 * @param {MediaStream} videoStream Stream to be used as primary source
 *  (typically video and audio, or only video if combined with audioStream) for
 *  localVideo and to be added as stream to the RTCPeerConnection
 * @param {MediaStream} audioStream Stream to be used as second source
 *  (typically for audio) for localVideo and to be added as stream to the
 *  RTCPeerConnection
 */

function WebRtcPeer(mode, options, callback) {
    if (!(this instanceof WebRtcPeer)) {
        return new WebRtcPeer(mode, options, callback);
    }

    WebRtcPeer.super_.call(this);

    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }

    options = options || {};
    callback = (callback || noop).bind(this);

    let self = this;
    let localVideo = options.localVideo;
    let remoteVideo = options.remoteVideo;
    let videoStream = options.videoStream;
    let audioStream = options.audioStream;
    let mediaConstraints = options.mediaConstraints;
    let sessionToken = options.roomName;

    let pc = options.peerConnection;
    let sendSource = options.sendSource || 'webcam';
    let setVideoStream = options.stateChange; // this si state from react

    let dataChannelConfig = options.dataChannelConfig;
    let useDataChannels = options.dataChannels || false;
    let dataChannel;

    let guid = uuidv4();
    let configuration = {iceServers: options.configuration}


    //let configuration = recursive({
    //    iceServers: [
    //        {
    //            url: "stun:74.125.192.127:19305",
    //            urls: ["stun:74.125.192.127:19305"]
    //        }
    //    ]
    //}, options.configuration);

    console.log('CONFIGURATION !!!   ', configuration);

    let onicecandidate = options.onicecandidate;
    if (onicecandidate) this.on('icecandidate', onicecandidate);

    let oncandidategatheringdone = options.oncandidategatheringdone;
    if (oncandidategatheringdone) {
        this.on('candidategatheringdone', oncandidategatheringdone);
    }

    let simulcast = options.simulcast;
    let multistream = options.multistream;
    let interop = new sdpTranslator.Interop();
    let candidatesQueueOut = [];
    let candidategatheringdone = false;

    Object.defineProperties(this, {
        'peerConnection': {
            get: function () {
                return pc;
            }
        },

        'id': {
            value: options.id || guid,
            writable: false
        },

        'remoteVideo': {
            get: function () {
                return remoteVideo;
            }
        },

        'localVideo': {
            get: function () {
                return localVideo;
            }
        },

        'dataChannel': {
            get: function () {
                return dataChannel;
            }
        },

        /**
         * @member {(external:ImageData|undefined)} currentFrame
         */
        'currentFrame': {
            get: function () {
                // [ToDo] Find solution when we have a remote stream but we didn't set
                // a remoteVideo tag
                if (!remoteVideo) return;

                if (remoteVideo.readyState < remoteVideo.HAVE_CURRENT_DATA)
                    throw new Error('No video stream data available');

                let canvas = document.createElement('canvas');
                canvas.width = remoteVideo.videoWidth;
                canvas.height = remoteVideo.videoHeight;

                canvas.getContext('2d').drawImage(remoteVideo, 0, 0);
                return canvas;
            }
        }
    });

    // Init PeerConnection
    if (!pc) {
        pc = new RTCPeerConnection(configuration);
        if (useDataChannels && !dataChannel) {
            let dcId = 'WebRtcPeer-' + self.id;
            let dcOptions = undefined;
            if (dataChannelConfig) {
                dcId = dataChannelConfig.id || dcId;
                dcOptions = dataChannelConfig.options;
            }
            dataChannel = pc.createDataChannel(dcId, dcOptions);
            if (dataChannelConfig) {
                dataChannel.onopen = dataChannelConfig.onopen;
                dataChannel.onclose = dataChannelConfig.onclose;
                dataChannel.onmessage = dataChannelConfig.onmessage;
                dataChannel.onbufferedamountlow = dataChannelConfig.onbufferedamountlow;
                dataChannel.onerror = dataChannelConfig.onerror || noop;
            }
        }
    }

    // Shims over the now deprecated getLocalStreams() and getRemoteStreams()
    // (usage of these methods should be dropped altogether)
    if (!pc.getLocalStreams && pc.getSenders) {
        pc.getLocalStreams = function () {
            let stream = new MediaStream();
            pc.getSenders().forEach(function (sender) {
                stream.addTrack(sender.track);
            });
            return [stream];
        };
    }
    if (!pc.getRemoteStreams && pc.getReceivers) {
        pc.getRemoteStreams = function () {
            let stream = new MediaStream();
            pc.getReceivers().forEach(function (sender) {
                stream.addTrack(sender.track);
            });
            return [stream];
        };
    }

    // If event.candidate == null, it means that candidate gathering has finished
    // and RTCPeerConnection.iceGatheringState == "complete".
    // Such candidate does not need to be sent to the remote peer.
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event#Indicating_that_ICE_gathering_is_complete
    let iceCandidateFunction = function (event) {
        let cand;
        let candidate = event.candidate;
        if (EventEmitter.listenerCount(self, 'icecandidate') || EventEmitter
            .listenerCount(self, 'candidategatheringdone')) {
            if (candidate) {
                if (multistream && usePlanB) {
                    cand = interop.candidateToUnifiedPlan(candidate);
                } else {
                    cand = candidate;
                }
                if (typeof AdapterJS === 'undefined') {
                    self.emit('icecandidate', cand);

                }
                candidategatheringdone = false;
            } else if (!candidategatheringdone) {
                if (typeof AdapterJS !== 'undefined' && AdapterJS
                    .webrtcDetectedBrowser === 'IE' && AdapterJS
                    .webrtcDetectedVersion >= 9) {
                    EventEmitter.prototype.emit('candidategatheringdone', cand);
                } else {
                    self.emit('candidategatheringdone');
                }
                candidategatheringdone = true;
            }
        } else if (!candidategatheringdone) {
            candidatesQueueOut.push(candidate);
            if (!candidate)
                candidategatheringdone = true;
        }
    };

    setIceCandidateAccordingWebBrowser(iceCandidateFunction, pc);
    pc.onaddstream = options.onaddstream;
    pc.onnegotiationneeded = options.onnegotiationneeded;
    this.on('newListener', function (event, listener) {
        if (event === 'icecandidate' || event === 'candidategatheringdone') {
            while (candidatesQueueOut.length) {
                let candidate = candidatesQueueOut.shift();
                if (!candidate === (event === 'candidategatheringdone')) {
                    listener(candidate);
                }
            }
        }
    });

    let addIceCandidate = bufferizeCandidates(pc);

    /**
     * Callback function invoked when an ICE candidate is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.addIceCandidate
     *
     * @param iceCandidate - Literal object with the ICE candidate description
     * @param callback - Called when the ICE candidate has been added.
     */
    this.addIceCandidate = function (iceCandidate, callback) {
        let candidate;
        if (multistream && usePlanB) {
            candidate = interop.candidateToPlanB(iceCandidate);
        } else {
            candidate = new RTCIceCandidate(iceCandidate);
        }

        // logger.debug('Remote ICE candidate received', iceCandidate);
        callback = (callback || noop).bind(this);
        addIceCandidate(candidate, callback);
    };

    this.generateOffer = function (callback) {
        callback = callback.bind(this);

        if (mode === 'recvonly') {
            /* Add reception tracks on the RTCPeerConnection. Send tracks are
             * unconditionally added to "sendonly" and "sendrecv" modes, in the
             * constructor's "start()" method, but nothing is done for "recvonly".
             *
             * Here, we add new transceivers to receive audio and/or video, so the
             * SDP Offer that will be generated by the PC includes these medias
             * with the "a=recvonly" attribute.
             */
            let useAudio =
                (mediaConstraints && typeof mediaConstraints.audio === 'boolean') ?
                    mediaConstraints.audio : true;
            let useVideo =
                (mediaConstraints && typeof mediaConstraints.video === 'boolean') ?
                    mediaConstraints.video : true;

            if (useAudio) {
                pc.addTransceiver('audio', {
                    direction: 'recvonly'
                });
            }

            if (useVideo) {
                pc.addTransceiver('video', {
                    direction: 'recvonly'
                });
            }
        }

        if (typeof AdapterJS !== 'undefined' && AdapterJS
            .webrtcDetectedBrowser === 'IE' && AdapterJS.webrtcDetectedVersion >= 9
        ) {
            let setLocalDescriptionOnSuccess = function () {
                sleep(1000);
                let localDescription = pc.localDescription;
                logger.debug('Local description set\n', localDescription.sdp);
                if (multistream && usePlanB) {
                    localDescription = interop.toUnifiedPlan(localDescription);
                    logger.debug('offer::origPlanB->UnifiedPlan', dumpSDP(localDescription));
                }
                callback(null, localDescription.sdp, self.processAnswer.bind(self));
            };
            let createOfferOnSuccess = function (offer) {
                logger.debug('Created SDP offer');
                logger.debug('Local description set\n', pc.localDescription);
                pc.setLocalDescription(offer, setLocalDescriptionOnSuccess,
                    callback);
            };
            pc.createOffer(createOfferOnSuccess, callback);
        } else {
            pc.createOffer()
                .then(function (offer) {
                    logger.debug('Created SDP offer');
                    offer = mangleSdpToAddSimulcast(offer);
                    return pc.setLocalDescription(offer);
                })
                .then(function () {
                    let localDescription = pc.localDescription;
                    if (multistream && usePlanB) {
                        localDescription = interop.toUnifiedPlan(localDescription);
                        // logger.debug('offer::origPlanB->UnifiedPlan', dumpSDP(localDescription));
                    }
                    callback(null, localDescription.sdp, self.processAnswer.bind(
                        self));
                })
                .catch(callback);
        }
    };

    this.getLocalSessionDescriptor = function () {
        return pc.localDescription;
    };

    this.getRemoteSessionDescriptor = function () {
        return pc.remoteDescription;
    };

    function setRemoteVideo() {
        //if (remoteVideo){
        if (true){
            let stream = pc.getRemoteStreams()[0];
            if (setVideoStream)
                setVideoStream(stream);
            else
                console.warn('NO SETVIDEPSTREAM');
        }
    }

    this.showLocalVideo = function () {
        localVideo.srcObject = videoStream;
        localVideo.muted = true;

        if (typeof AdapterJS !== 'undefined' && AdapterJS
            .webrtcDetectedBrowser === 'IE' && AdapterJS.webrtcDetectedVersion >= 9
        ) {
            localVideo.srcObject = videoStream;
        }
    };
    this.send = function (data) {
        if (dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send(data);
        } else {
            logger.warn('Trying to send data over a non-existing or closed data channel (kurento-dev)');
        }
    };

    /**
     * Callback function invoked when a SDP answer is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.processAnswer
     *
     * @param sdpAnswer - Description of sdpAnswer
     * @param callback -
     *            Invoked after the SDP answer is processed, or there is an error.
     */
    this.processAnswer = function (sdpAnswer, callback) {
        callback = (callback || noop).bind(this);

        let answer = new RTCSessionDescription({
            type: 'answer',
            sdp: sdpAnswer
        });

        if (multistream && usePlanB) {
            let planBAnswer = interop.toPlanB(answer);
            answer = planBAnswer;
        }

        if (pc.signalingState === 'closed') {
            return callback('PeerConnection is closed');
        }

        pc.setRemoteDescription(answer).then(function () {
                setRemoteVideo();
                callback();
            },
            callback);
    };

    /**
     * Callback function invoked when a SDP offer is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.processOffer
     *
     * @param sdpOffer - Description of sdpOffer
     * @param callback - Called when the remote description has been set
     *  successfully.
     */
    this.processOffer = function (sdpOffer, callback) {
        callback = callback.bind(this);
        logger.debug('SDP_OFFER: ', sdpOffer);
        let offer = new RTCSessionDescription({
            type: 'offer',
            sdp: sdpOffer
        });

        if (multistream && usePlanB) {
            let planBOffer = interop.toPlanB(offer);
            // logger.debug('offer::planB', dumpSDP(planBOffer));
            offer = planBOffer;
        }

        if (pc.signalingState === 'closed') {
            return callback('PeerConnection is closed');
        }

        pc.setRemoteDescription(offer).then(function () {
            return setRemoteVideo();
        }).then(function () {
            return pc.createAnswer();
        }).then(function (answer) {
            answer = mangleSdpToAddSimulcast(answer);
            return pc.setLocalDescription(answer);
        }).then(function () {
            let localDescription = pc.localDescription;
            if (multistream && usePlanB) {
                localDescription = interop.toUnifiedPlan(localDescription);
            }
            callback(null, localDescription.sdp);
        }).catch(callback);
    };

    function mangleSdpToAddSimulcast(answer) {
        if (simulcast) {
            if (browser.name === 'Chrome' || browser.name === 'Chromium') {
                answer = new RTCSessionDescription({
                    'type': answer.type,
                    'sdp': removeFIDFromOffer(answer.sdp) + getSimulcastInfo(
                        videoStream)
                });
            } else {
                logger.warn('Simulcast is only available in Chrome browser (kurento-dev)');
            }
        }
        return answer;
    }

    /**
     * This function creates the RTCPeerConnection object taking into account the
     * properties received in the constructor. It starts the SDP negotiation
     * process: generates the SDP offer and invokes the onsdpoffer callback. This
     * callback is expected to send the SDP offer, in order to obtain an SDP
     * answer from another peer.
     */
    function start() {
        if (pc.signalingState === 'closed') {
            callback(
                'The peer connection object is in "closed" state. This is most likely due to an invocation of the dispose method before accepting in the dialogue'
            );
        }

        if (videoStream && localVideo) {
            self.showLocalVideo();
        }

        if (videoStream) {
            videoStream.getTracks().forEach(function (track) {
                pc.addTrack(track, videoStream);
            });
        }

        if (audioStream) {
            audioStream.getTracks().forEach(function (track) {
                pc.addTrack(track, audioStream);
            });
        }

        // [Hack] https://code.google.com/p/chromium/issues/detail?id=443558
        let browser = parser.getBrowser();
        if (mode === 'sendonly' &&
            (browser.name === 'Chrome' || browser.name === 'Chromium') &&
            browser.major === 39) {
            mode = 'sendrecv';
        }
        callback();
    }

    if (mode !== 'recvonly' && !videoStream && !audioStream) {
        function getMedia(constraints) {
            if (constraints === undefined) {
                constraints = MEDIA_CONSTRAINTS;
            }

            if (typeof AdapterJS !== 'undefined' && AdapterJS
                .webrtcDetectedBrowser === 'IE' && AdapterJS.webrtcDetectedVersion >= 9
            ) {
                navigator.getUserMedia(constraints).then(stream =>{
                    videoStream = stream;
                    start();
                }).catch(err => {
                    //fronLogger(sessionToken, `FAILED WEBCAM (${err})`, "error", "kurento-dev.js");
                });
            } else {

                navigator.getUserMedia(constraints, function (stream) {
                    videoStream = stream;

                    start();
                }, function (e) {
                    let message;
                    switch (e.name) {
                        case 'NotFoundError':
                        case 'DevicesNotFoundError':
                            message = 'Please setup your webcam first. (' + e + ')';
                            break;
                        case 'SourceUnavailableError':
                            message = 'Webcam is busy (' + e + ')';
                            break;
                        case 'PermissionDeniedError':
                        case 'SecurityError':
                            message = 'Permission denied! (' + e + ')';
                            break;
                        default: message = 'Rejected! (' + e + ')';
                            break;
                    }
                    let startWithoutMicAndWeb = window.confirm("У вас не работает веб-камера или микрофон.\nУверены, что хотите начать запись?");
                    if(startWithoutMicAndWeb){
                        message += "\nThe user wants to continue without a microphone or webcam.";
                        console.log(message);
                        //fronLogger(sessionToken, message, "info", "kurento-dev.js");  
                        callback("withoutWebAndMic");
                    }else{
                        message += "\nUser doesn't want to continue without microphone or webcam";
                        console.log(message);
                        //fronLogger(sessionToken, message, "warning", "kurento-dev.js");

                    }

                });
            }
        }

        function getMediaStream() {
            navigator.mediaDevices.getDisplayMedia({video: true}).then(function(stream){
                let displaySurface = stream.getVideoTracks()[0].getSettings().displaySurface;
                if (displaySurface === "monitor"){
                    videoStream = stream;
                    start();
                } else{
                    alert('Выберите монитор, а не какую-то область');
                    getMediaStream();
                }
            }).catch(callback);
        }

        logger.log("Send source (kurento-dev): ", sendSource);
        if (sendSource === 'webcam') {
            getMedia(mediaConstraints);
        } else if(sendSource === 'window') // this part was changed by me
        {
            getMediaStream();
        }

    } else {
        setTimeout(start, 0);
    }

    this.on('_dispose', function () {
        if (localVideo) {
            localVideo.pause();
            localVideo.srcObject = null;

            if (typeof AdapterJS === 'undefined') {
                localVideo.load();
            }
            localVideo.muted = false;

        }
        if (remoteVideo) {
            remoteVideo.pause();
            remoteVideo.srcObject = null;
            if (typeof AdapterJS === 'undefined') {
                remoteVideo.load();

            }
        }
        self.removeAllListeners();

        if (typeof window !== 'undefined' && window.cancelChooseDesktopMedia !==
            undefined) {
            window.cancelChooseDesktopMedia(guid);
        }
    });
}
inherits(WebRtcPeer, EventEmitter);

function createEnableDescriptor(type) {
    let method = 'get' + type + 'Tracks';

    return {
        enumerable: true,
        get: function () {
            if (!this.peerConnection) return;

            let streams = this.peerConnection.getLocalStreams();
            if (!streams.length) return;

            for (let i = 0, stream; stream = streams[i]; i++) {
                let tracks = stream[method]();
                for (let j = 0, track; track = tracks[j]; j++)
                    if (!track.enabled) return false;
            }
            return true;
        },
        set: function (value) {
            function trackSetEnable(track) {
                track.enabled = value;
            }

            this.peerConnection.getLocalStreams().forEach(function (stream) {
                stream[method]().forEach(trackSetEnable);
            });
        }
    };
}

Object.defineProperties(WebRtcPeer.prototype, {
    'enabled': {
        enumerable: true,
        get: function () {
            return this.audioEnabled && this.videoEnabled;
        },
        set: function (value) {
            this.audioEnabled = this.videoEnabled = value;
        }
    },
    'audioEnabled': createEnableDescriptor('Audio'),
    'videoEnabled': createEnableDescriptor('Video')
});

WebRtcPeer.prototype.getLocalStream = function (index) {
    if (this.peerConnection) {
        return this.peerConnection.getLocalStreams()[index || 0];
    }
};

WebRtcPeer.prototype.getRemoteStream = function (index) {
    if (this.peerConnection) {
        return this.peerConnection.getRemoteStreams()[index || 0];
    }
};

/**
 * @description This method frees the resources used by WebRtcPeer.
 *
 * @function module:kurentoUtils.WebRtcPeer.prototype.dispose
 */
WebRtcPeer.prototype.dispose = function () {
    // logger.debug('Disposing WebRtcPeer');

    let pc = this.peerConnection;
    let dc = this.dataChannel;
    try {
        if (dc) {
            if (dc.readyState === 'closed') return;

            dc.close();
        }

        if (pc) {
            if (pc.signalingState === 'closed') return;

            pc.getLocalStreams().forEach(streamStop);

            pc.close();
        }
    } catch (err) {
        logger.warn('Exception disposing webrtc peer (kurento-dev) ' + err);
    }

    if (typeof AdapterJS === 'undefined') {
        this.emit('_dispose');
    }
};

//
// Specialized child classes
//
function WebRtcPeerRecvonly(options, callback) {
    if (!(this instanceof WebRtcPeerRecvonly)) {
        return new WebRtcPeerRecvonly(options, callback);
    }

    WebRtcPeerRecvonly.super_.call(this, 'recvonly', options, callback);
}
inherits(WebRtcPeerRecvonly, WebRtcPeer);

function WebRtcPeerSendonly(options, callback) {
    if (!(this instanceof WebRtcPeerSendonly)) {
        return new WebRtcPeerSendonly(options, callback);
    }

    WebRtcPeerSendonly.super_.call(this, 'sendonly', options, callback);
}
inherits(WebRtcPeerSendonly, WebRtcPeer);

function WebRtcPeerSendrecv(options, callback) {
    if (!(this instanceof WebRtcPeerSendrecv)) {
        return new WebRtcPeerSendrecv(options, callback);
    }
    WebRtcPeerSendrecv.super_.call(this, 'sendrecv', options, callback);
}
inherits(WebRtcPeerSendrecv, WebRtcPeer);

function harkUtils(stream, options) {
    return hark(stream, options);
}

const STATE_WEBCAM = 'webcam';
const STATE_WINDOW = 'window';
const stateSetters = {
    STATE_WEBCAM: null,
    STATE_WINDOW: null
};

function reactIntegration(type, stateSetter) {
    if (type === STATE_WEBCAM)
        stateSetters[STATE_WEBCAM] = stateSetters;
    else
        stateSetters[STATE_WINDOW] = stateSetters;
}

exports.bufferizeCandidates = bufferizeCandidates;
exports.WebRtcPeerRecvonly = WebRtcPeerRecvonly;
exports.WebRtcPeerSendonly = WebRtcPeerSendonly;
exports.WebRtcPeerSendrecv = WebRtcPeerSendrecv;
exports.hark = harkUtils;
exports.setReactState = reactIntegration;
