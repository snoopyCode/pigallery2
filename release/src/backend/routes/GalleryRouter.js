"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const GalleryMWs_1 = require("../middlewares/GalleryMWs");
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
const ThumbnailGeneratorMWs_1 = require("../middlewares/thumbnail/ThumbnailGeneratorMWs");
const UserDTO_1 = require("../../common/entities/UserDTO");
const PhotoWorker_1 = require("../model/threading/PhotoWorker");
const VersionMWs_1 = require("../middlewares/VersionMWs");
const SupportedFormats_1 = require("../../common/SupportedFormats");
const PhotoConverterMWs_1 = require("../middlewares/thumbnail/PhotoConverterMWs");
class GalleryRouter {
    static route(app) {
        this.addGetImageIcon(app);
        this.addGetVideoIcon(app);
        this.addGetPhotoThumbnail(app);
        this.addGetVideoThumbnail(app);
        this.addGetBestFitImage(app);
        this.addGetImage(app);
        this.addGetBestFitVideo(app);
        this.addGetVideo(app);
        this.addGetMetaFile(app);
        this.addRandom(app);
        this.addDirectoryList(app);
        this.addSearch(app);
        this.addInstantSearch(app);
        this.addAutoComplete(app);
    }
    static addDirectoryList(app) {
        app.get(['/api/gallery/content/:directory(*)', '/api/gallery/', '/api/gallery//'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('directory'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('directory', true), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        GalleryMWs_1.GalleryMWs.listDirectory, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.addThumbnailInformation, GalleryMWs_1.GalleryMWs.cleanUpGalleryResults, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addGetImage(app) {
        app.get(['/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Photos.join('|') + '))'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetBestFitImage(app) {
        app.get(['/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Photos.join('|') + '))/bestFit'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, PhotoConverterMWs_1.PhotoConverterMWs.convertPhoto, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetVideo(app) {
        app.get(['/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Videos.join('|') + '))'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetBestFitVideo(app) {
        app.get(['/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Videos.join('|') + '))/bestFit'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, GalleryMWs_1.GalleryMWs.loadBestFitVideo, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetMetaFile(app) {
        app.get(['/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.MetaFiles.join('|') + '))'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addRandom(app) {
        app.get(['/api/gallery/random'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Guest), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        GalleryMWs_1.GalleryMWs.getRandomImage, GalleryMWs_1.GalleryMWs.loadFile, RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetPhotoThumbnail(app) {
        app.get('/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Photos.join('|') + '))/thumbnail/:size?', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.generateThumbnailFactory(PhotoWorker_1.ThumbnailSourceType.Photo), RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetVideoThumbnail(app) {
        app.get('/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Videos.join('|') + '))/thumbnail/:size?', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.generateThumbnailFactory(PhotoWorker_1.ThumbnailSourceType.Video), RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetVideoIcon(app) {
        app.get('/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Videos.join('|') + '))/icon', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.generateIconFactory(PhotoWorker_1.ThumbnailSourceType.Video), RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addGetImageIcon(app) {
        app.get('/api/gallery/content/:mediaPath(*\.(' + SupportedFormats_1.SupportedFormats.Photos.join('|') + '))/icon', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('mediaPath'), AuthenticationMWs_1.AuthenticationMWs.authorisePath('mediaPath', false), 
        // specific part
        GalleryMWs_1.GalleryMWs.loadFile, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.generateIconFactory(PhotoWorker_1.ThumbnailSourceType.Photo), RenderingMWs_1.RenderingMWs.renderFile);
    }
    static addSearch(app) {
        app.get('/api/search/:text', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Guest), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        GalleryMWs_1.GalleryMWs.search, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.addThumbnailInformation, GalleryMWs_1.GalleryMWs.cleanUpGalleryResults, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addInstantSearch(app) {
        app.get('/api/instant-search/:text', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Guest), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        GalleryMWs_1.GalleryMWs.instantSearch, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.addThumbnailInformation, GalleryMWs_1.GalleryMWs.cleanUpGalleryResults, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addAutoComplete(app) {
        app.get('/api/autocomplete/:text', 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Guest), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        GalleryMWs_1.GalleryMWs.autocomplete, RenderingMWs_1.RenderingMWs.renderResult);
    }
}
exports.GalleryRouter = GalleryRouter;
