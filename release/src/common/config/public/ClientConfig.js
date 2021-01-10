"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-inferrable-types */
require("reflect-metadata");
const SortingMethods_1 = require("../../entities/SortingMethods");
const UserDTO_1 = require("../../entities/UserDTO");
const common_1 = require("typeconfig/common");
var ClientConfig;
(function (ClientConfig) {
    let MapProviders;
    (function (MapProviders) {
        MapProviders[MapProviders["OpenStreetMap"] = 1] = "OpenStreetMap";
        MapProviders[MapProviders["Mapbox"] = 2] = "Mapbox";
        MapProviders[MapProviders["Custom"] = 3] = "Custom";
    })(MapProviders = ClientConfig.MapProviders || (ClientConfig.MapProviders = {}));
    let AutoCompleteConfig = class AutoCompleteConfig {
        constructor() {
            this.enabled = true;
            this.maxItemsPerCategory = 5;
            this.cacheTimeout = 1000 * 60 * 60;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], AutoCompleteConfig.prototype, "enabled", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], AutoCompleteConfig.prototype, "maxItemsPerCategory", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], AutoCompleteConfig.prototype, "cacheTimeout", void 0);
    AutoCompleteConfig = __decorate([
        common_1.SubConfigClass()
    ], AutoCompleteConfig);
    ClientConfig.AutoCompleteConfig = AutoCompleteConfig;
    let SearchConfig = class SearchConfig {
        constructor() {
            this.enabled = true;
            this.instantSearchEnabled = true;
            this.InstantSearchTimeout = 3000;
            this.instantSearchCacheTimeout = 1000 * 60 * 60;
            this.searchCacheTimeout = 1000 * 60 * 60;
            this.AutoComplete = new AutoCompleteConfig();
            this.maxMediaResult = 2000;
            this.maxDirectoryResult = 200;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], SearchConfig.prototype, "enabled", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], SearchConfig.prototype, "instantSearchEnabled", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], SearchConfig.prototype, "InstantSearchTimeout", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], SearchConfig.prototype, "instantSearchCacheTimeout", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], SearchConfig.prototype, "searchCacheTimeout", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", AutoCompleteConfig)
    ], SearchConfig.prototype, "AutoComplete", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], SearchConfig.prototype, "maxMediaResult", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], SearchConfig.prototype, "maxDirectoryResult", void 0);
    SearchConfig = __decorate([
        common_1.SubConfigClass()
    ], SearchConfig);
    ClientConfig.SearchConfig = SearchConfig;
    let SharingConfig = class SharingConfig {
        constructor() {
            this.enabled = true;
            this.passwordProtected = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], SharingConfig.prototype, "enabled", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], SharingConfig.prototype, "passwordProtected", void 0);
    SharingConfig = __decorate([
        common_1.SubConfigClass()
    ], SharingConfig);
    ClientConfig.SharingConfig = SharingConfig;
    let RandomPhotoConfig = class RandomPhotoConfig {
        constructor() {
            this.enabled = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], RandomPhotoConfig.prototype, "enabled", void 0);
    RandomPhotoConfig = __decorate([
        common_1.SubConfigClass()
    ], RandomPhotoConfig);
    ClientConfig.RandomPhotoConfig = RandomPhotoConfig;
    let MapLayers = class MapLayers {
        constructor() {
            this.name = 'street';
            this.url = '';
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], MapLayers.prototype, "name", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], MapLayers.prototype, "url", void 0);
    MapLayers = __decorate([
        common_1.SubConfigClass()
    ], MapLayers);
    ClientConfig.MapLayers = MapLayers;
    let MapConfig = class MapConfig {
        constructor() {
            this.enabled = true;
            this.useImageMarkers = true;
            this.mapProvider = MapProviders.OpenStreetMap;
            this.mapboxAccessToken = '';
            this.customLayers = [new MapLayers()];
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], MapConfig.prototype, "enabled", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], MapConfig.prototype, "useImageMarkers", void 0);
    __decorate([
        common_1.ConfigProperty({ type: MapProviders }),
        __metadata("design:type", Number)
    ], MapConfig.prototype, "mapProvider", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], MapConfig.prototype, "mapboxAccessToken", void 0);
    __decorate([
        common_1.ConfigProperty({ arrayType: MapLayers }),
        __metadata("design:type", Array)
    ], MapConfig.prototype, "customLayers", void 0);
    MapConfig = __decorate([
        common_1.SubConfigClass()
    ], MapConfig);
    ClientConfig.MapConfig = MapConfig;
    let ThumbnailConfig = class ThumbnailConfig {
        constructor() {
            this.iconSize = 45;
            this.personThumbnailSize = 200;
            this.thumbnailSizes = [240, 480];
            this.concurrentThumbnailGenerations = 1;
        }
    };
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt', max: 100 }),
        __metadata("design:type", Number)
    ], ThumbnailConfig.prototype, "iconSize", void 0);
    __decorate([
        common_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], ThumbnailConfig.prototype, "personThumbnailSize", void 0);
    __decorate([
        common_1.ConfigProperty({ arrayType: 'unsignedInt' }),
        __metadata("design:type", Array)
    ], ThumbnailConfig.prototype, "thumbnailSizes", void 0);
    __decorate([
        common_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", Number)
    ], ThumbnailConfig.prototype, "concurrentThumbnailGenerations", void 0);
    ThumbnailConfig = __decorate([
        common_1.SubConfigClass()
    ], ThumbnailConfig);
    ClientConfig.ThumbnailConfig = ThumbnailConfig;
    let NavBarConfig = class NavBarConfig {
        constructor() {
            this.showItemCount = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], NavBarConfig.prototype, "showItemCount", void 0);
    NavBarConfig = __decorate([
        common_1.SubConfigClass()
    ], NavBarConfig);
    ClientConfig.NavBarConfig = NavBarConfig;
    let OtherConfig = class OtherConfig {
        constructor() {
            this.enableCache = true;
            this.enableOnScrollRendering = true;
            this.defaultPhotoSortingMethod = SortingMethods_1.SortingMethods.ascDate;
            this.enableOnScrollThumbnailPrioritising = true;
            this.NavBar = new NavBarConfig();
            this.captionFirstNaming = false; // shows the caption instead of the filename in the photo grid
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], OtherConfig.prototype, "enableCache", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], OtherConfig.prototype, "enableOnScrollRendering", void 0);
    __decorate([
        common_1.ConfigProperty({ type: SortingMethods_1.SortingMethods }),
        __metadata("design:type", Number)
    ], OtherConfig.prototype, "defaultPhotoSortingMethod", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], OtherConfig.prototype, "enableOnScrollThumbnailPrioritising", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", NavBarConfig)
    ], OtherConfig.prototype, "NavBar", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], OtherConfig.prototype, "captionFirstNaming", void 0);
    OtherConfig = __decorate([
        common_1.SubConfigClass()
    ], OtherConfig);
    ClientConfig.OtherConfig = OtherConfig;
    let VideoConfig = class VideoConfig {
        constructor() {
            this.enabled = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], VideoConfig.prototype, "enabled", void 0);
    VideoConfig = __decorate([
        common_1.SubConfigClass()
    ], VideoConfig);
    ClientConfig.VideoConfig = VideoConfig;
    let PhotoConvertingConfig = class PhotoConvertingConfig {
        constructor() {
            this.enabled = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], PhotoConvertingConfig.prototype, "enabled", void 0);
    PhotoConvertingConfig = __decorate([
        common_1.SubConfigClass()
    ], PhotoConvertingConfig);
    ClientConfig.PhotoConvertingConfig = PhotoConvertingConfig;
    let PhotoConfig = class PhotoConfig {
        constructor() {
            this.Converting = new PhotoConvertingConfig();
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", PhotoConvertingConfig)
    ], PhotoConfig.prototype, "Converting", void 0);
    PhotoConfig = __decorate([
        common_1.SubConfigClass()
    ], PhotoConfig);
    ClientConfig.PhotoConfig = PhotoConfig;
    let MediaConfig = class MediaConfig {
        constructor() {
            this.Thumbnail = new ThumbnailConfig();
            this.Video = new VideoConfig();
            this.Photo = new PhotoConfig();
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", ThumbnailConfig)
    ], MediaConfig.prototype, "Thumbnail", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", VideoConfig)
    ], MediaConfig.prototype, "Video", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", PhotoConfig)
    ], MediaConfig.prototype, "Photo", void 0);
    MediaConfig = __decorate([
        common_1.SubConfigClass()
    ], MediaConfig);
    ClientConfig.MediaConfig = MediaConfig;
    let MetaFileConfig = class MetaFileConfig {
        constructor() {
            this.enabled = true;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], MetaFileConfig.prototype, "enabled", void 0);
    MetaFileConfig = __decorate([
        common_1.SubConfigClass()
    ], MetaFileConfig);
    ClientConfig.MetaFileConfig = MetaFileConfig;
    let FacesConfig = class FacesConfig {
        constructor() {
            this.enabled = true;
            this.keywordsToPersons = true;
            this.writeAccessMinRole = UserDTO_1.UserRoles.Admin;
            this.readAccessMinRole = UserDTO_1.UserRoles.User;
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], FacesConfig.prototype, "enabled", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], FacesConfig.prototype, "keywordsToPersons", void 0);
    __decorate([
        common_1.ConfigProperty({ type: UserDTO_1.UserRoles }),
        __metadata("design:type", Number)
    ], FacesConfig.prototype, "writeAccessMinRole", void 0);
    __decorate([
        common_1.ConfigProperty({ type: UserDTO_1.UserRoles }),
        __metadata("design:type", Number)
    ], FacesConfig.prototype, "readAccessMinRole", void 0);
    FacesConfig = __decorate([
        common_1.SubConfigClass()
    ], FacesConfig);
    ClientConfig.FacesConfig = FacesConfig;
    let Config = class Config {
        constructor() {
            this.applicationTitle = 'PiGallery 2';
            this.publicUrl = '';
            this.urlBase = '';
            this.Search = new SearchConfig();
            this.Sharing = new SharingConfig();
            this.Map = new MapConfig();
            this.RandomPhoto = new RandomPhotoConfig();
            this.Other = new OtherConfig();
            this.authenticationRequired = true;
            this.unAuthenticatedUserRole = UserDTO_1.UserRoles.Admin;
            this.Media = new MediaConfig();
            this.MetaFile = new MetaFileConfig();
            this.Faces = new FacesConfig();
        }
    };
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], Config.prototype, "applicationTitle", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], Config.prototype, "publicUrl", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", String)
    ], Config.prototype, "urlBase", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", SearchConfig)
    ], Config.prototype, "Search", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", SharingConfig)
    ], Config.prototype, "Sharing", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", MapConfig)
    ], Config.prototype, "Map", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", RandomPhotoConfig)
    ], Config.prototype, "RandomPhoto", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", OtherConfig)
    ], Config.prototype, "Other", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], Config.prototype, "authenticationRequired", void 0);
    __decorate([
        common_1.ConfigProperty({ type: UserDTO_1.UserRoles }),
        __metadata("design:type", Number)
    ], Config.prototype, "unAuthenticatedUserRole", void 0);
    __decorate([
        common_1.ConfigProperty({ arrayType: 'string', volatile: true }),
        __metadata("design:type", Array)
    ], Config.prototype, "languages", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", MediaConfig)
    ], Config.prototype, "Media", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", MetaFileConfig)
    ], Config.prototype, "MetaFile", void 0);
    __decorate([
        common_1.ConfigProperty(),
        __metadata("design:type", FacesConfig)
    ], Config.prototype, "Faces", void 0);
    Config = __decorate([
        common_1.SubConfigClass()
    ], Config);
    ClientConfig.Config = Config;
})(ClientConfig = exports.ClientConfig || (exports.ClientConfig = {}));
