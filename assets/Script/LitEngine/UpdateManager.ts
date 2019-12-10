const { ccclass, property } = cc._decorator;

export module LUpdate{
    export enum UpdateStateType {
        none = 0,
        checkFailed,
        checking,
        already,
    
        updateFailed,
        newVersion,
        needReTry,
        updateing,
        updateFinished,
    }
    
    export class UpdateProgress {
        public byteProgress: number = 0;
        public fileProgress: number = 0;
        public downloadedFiles: number = 0;
        public totalFiles: number = 0;
        public downloadedBytes: number = 0;
        public totalBytes: number = 0;
        public msg: string;
        public SetProgress(event) {
            this.byteProgress = event.getPercent();
            this.fileProgress = event.getPercentByFile();
            this.downloadedBytes = event.getDownloadedBytes();
            this.downloadedFiles = event.getDownloadedFiles();
            this.totalBytes = event.getTotalBytes();
            this.totalFiles = event.getTotalFiles();
            this.msg = event.getMessage();
        }
    
        public Rest() {
            this.byteProgress = 0;
            this.fileProgress = 0;
            this.downloadedFiles = 0;
            this.totalFiles = 0;
            this.downloadedBytes = 0;
            this.totalBytes = 0;
    
        }
    }
    
    @ccclass
    export class UpdateManager extends cc.Component {
    
        public static UpdateProgress = UpdateProgress;
        public static UpdateStateType = UpdateStateType;
    
        private manifestUrl: cc.Asset = null;
    
        private _storagePath: string;
        private versionCompareHandle;
        private _am: any;
        private _updateListener: any;
    
        private _updateState: UpdateStateType = UpdateStateType.none;
        private checkUpdateCallback: ((arr: { state: UpdateStateType, code?: number, msg?: string }) => void);
    
        private updateCallback: ((arr: { state: UpdateStateType, updateObj?: UpdateProgress, code?: number, msg?: string }) => void);
        private _upProgress: UpdateProgress;
    
        private static _instance: UpdateManager = null;
        public static get instance() {
            if (UpdateManager._instance == null) {
                var tnode = new cc.Node("UpdateManager");
                cc.game.addPersistRootNode(tnode);
                UpdateManager._instance = tnode.addComponent("UpdateManager");
            }
    
            return UpdateManager._instance;
        }
    
        public static SetManifest(mf) {
            UpdateManager.instance.manifestUrl = mf;
        }
    
        public static isNeedUpdate(cb: ((arr: { state: UpdateStateType, code?: number, msg?: string }) => void)) {
            UpdateManager.instance.checkUpdate(cb);
        }
    
        public static StartUpdate(ucb: ((arr: { state: UpdateStateType, updateObj?: UpdateProgress, code?: number, msg?: string }) => void)) {
            UpdateManager.instance.startUpdate(ucb);
        }
    
        public GetState() {
            return this._updateState;
        }
    
        public static Destory() {
            if (UpdateManager._instance)
                UpdateManager._instance.node.destroy();
        }
    
        isUpdateing() {
            return this._updateState == UpdateStateType.updateing;
        }
    
        onLoad() {
            if (!cc.sys.isNative) {
                return;
            }
            this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'GameData');
            cc.log('Storage path for remote asset : ' + this._storagePath);
    
            // Setup your own version compare handler, versionA and B is versions in string
            // if the return value greater than 0, versionA is greater than B,
            // if the return value equals 0, versionA equals to B,
            // if the return value smaller than 0, versionA is smaller than B.
            this.versionCompareHandle = function (versionA, versionB) {
                console.log("local version is " + versionA + ', server version is ' + versionB);
                var vA = versionA.split('.');
                var vB = versionB.split('.');
                for (var i = 0; i < vA.length; ++i) {
                    var a = parseInt(vA[i]);
                    var b = parseInt(vB[i] || 0);
                    if (a === b) {
                        continue;
                    }
                    else {
                        return a - b;
                    }
                }
                if (vB.length > vA.length) {
                    return -1;
                }
                else {
                    return 0;
                }
            };
    
            // Init with empty manifest url for testing custom manifest
            this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
            // Setup the verification callback, but we don't have md5 check function yet, so only print some message
            // Return true if the verification passed, otherwise return false
            this._am.setVerifyCallback(function (path, asset) {
                // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
                var compressed = asset.compressed;
                // Retrieve the correct md5 value.
                var expectedMD5 = asset.md5;
                // asset.path is relative path and path is absolute.
                var relativePath = asset.path;
                // The size of asset file, but this value could be absent.
                var size = asset.size;
    
                var cstr;
                if (compressed) {
                    cstr = "Verification passed : " + relativePath;
                }
                else {
                    cstr = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                }
                cc.log(cstr);
                return true;
            });
    
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                // Some Android device may slow down the download process when concurrent tasks is too much.
                // The value may not be accurate, please do more test and find what's most suitable for your game.
                this._am.setMaxConcurrentTask(2);
            }
    
            this._upProgress = new UpdateProgress();
        }
    
        checkCb(event) {
            var tmsg;
            var tcode = event.getEventCode();
            //cc.log('Code: ' + event.getEventCode());
            switch (tcode) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    this._updateState = UpdateStateType.checkFailed;
                    tmsg = "No local manifest file found, hot update skipped.";
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    this._updateState = UpdateStateType.checkFailed;
                    tmsg = "Fail to download manifest file, hot update skipped.";
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    this._updateState = UpdateStateType.already;
                    tmsg = "Already up to date with the latest remote version.";
                    break;
                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    this._updateState = UpdateStateType.newVersion;
                    tmsg = 'New version found, please try to update.';
                    break;
                default:
                    return;
            }
    
            this._am.setEventCallback(null);
            if (this.checkUpdateCallback)
                this.checkUpdateCallback({ state: this._updateState, msg: tmsg, code: tcode });
        }
    
    
        updateCb(event) {
            var needRestart = false;
            var failed = false;
            var infoStr: string;
            var tcode = event.getEventCode();
            switch (tcode) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    infoStr = 'No local manifest file found, hot update skipped.';
                    this._updateState = UpdateStateType.updateFailed;
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    this._upProgress.SetProgress(event);
                    this.updateCallback({ state: UpdateStateType.updateing, updateObj: this._upProgress, code: tcode });
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    infoStr = 'Fail to download manifest file, hot update skipped.';
                    this._updateState = UpdateStateType.updateFailed;
                    failed = true;
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    infoStr = 'Already up to date with the latest remote version.';
                    this._updateState = UpdateStateType.updateFailed;
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    infoStr = 'Update finished. ' + event.getMessage();
                    this._updateState = UpdateStateType.updateFinished;
                    needRestart = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    infoStr = 'Update failed. ' + event.getMessage();
                    this._updateState = UpdateStateType.needReTry;
                    failed = true;
                    //錯誤處理
                    break;
                case jsb.EventAssetsManager.ERROR_UPDATING:
                    infoStr = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                    this._updateState = UpdateStateType.updateFailed;
                    failed = true;
                    break;
                case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                    infoStr = event.getMessage();
                    this._updateState = UpdateStateType.updateFailed;
                    failed = true;
                    break;
                default:
                    break;
            }
    
            if (failed) {
                this._am.setEventCallback(null);
                this._updateListener = null;
                this.updateCallback({ state: this._updateState, code: tcode, msg: infoStr });
            }
    
            if (needRestart) {
                this._updateState = UpdateStateType.updateFinished;
                this._am.setEventCallback(null);
                this._updateListener = null;
                // Prepend the manifest's search path
                var searchPaths = jsb.fileUtils.getSearchPaths();
                var newPaths = this._am.getLocalManifest().getSearchPaths();
                Array.prototype.unshift.apply(searchPaths, newPaths);
                // This value will be retrieved and appended to the default search path during game startup,
                // please refer to samples/js-tests/main.js for detailed usage.
                // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                //console.log(JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                this.updateCallback({ state: this._updateState, code: tcode });
                //cc.audioEngine.stopAll();
                //cc.game.restart();
    
                //js code
                // if (cc.sys.isNative) {
                //     var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');
                //      if (hotUpdateSearchPaths) {
                //           jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
                //      }
                //  }
            }
        }
    
        retry() {
            if (this._updateState == UpdateStateType.updateFailed) {
                this._am.downloadFailedAssets();
            }
        }
    
        checkUpdate(cb: ((arr: { state: UpdateStateType, code?: number, msg?: string }) => void)) {
            if (this._updateState >= UpdateStateType.checking) {
                cb({ state: this._updateState, msg: 'checked.', code: UpdateStateType.none });
                return;
            }
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }
            
            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                cb({ state: UpdateStateType.checkFailed, msg: 'Failed to load local manifest ...', code: UpdateStateType.none });
                return;
            }
            
            this.checkUpdateCallback = cb;
            this._am.setEventCallback(this.checkCb.bind(this));
            this._am.checkUpdate();
            this._updateState = UpdateStateType.checking;
        }
    
        startUpdate(ucb: ((arr: { state: UpdateStateType, updateObj?: UpdateProgress, code?: number, msg?: string }) => void)) {
            if (this._updateState > UpdateStateType.newVersion || this._updateState < UpdateStateType.updateFailed) return;
    
            if (this._am) {
                this.updateCallback = ucb;
                this._am.setEventCallback(this.updateCb.bind(this));
    
                if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                    // Resolve md5 url
                    var url = this.manifestUrl.nativeUrl;
                    if (cc.loader.md5Pipe) {
                        url = cc.loader.md5Pipe.transformURL(url);
                    }
                    this._am.loadLocalManifest(url);
                }
    
                this._am.update();
                this._updateState = UpdateStateType.updateing;
            }
        }
    
        onDestroy() {
            if (this._updateListener) {
                this._am.setEventCallback(null);
                this._updateListener = null;
            }
        }
    }
}

