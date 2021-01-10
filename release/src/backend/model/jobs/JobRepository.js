"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IndexingJob_1 = require("./jobs/IndexingJob");
const DBResetJob_1 = require("./jobs/DBResetJob");
const VideoConvertingJob_1 = require("./jobs/VideoConvertingJob");
const PhotoConvertingJob_1 = require("./jobs/PhotoConvertingJob");
const ThumbnailGenerationJob_1 = require("./jobs/ThumbnailGenerationJob");
const TempFolderCleaningJob_1 = require("./jobs/TempFolderCleaningJob");
class JobRepository {
    constructor() {
        this.availableJobs = {};
    }
    static get Instance() {
        if (JobRepository.instance == null) {
            JobRepository.instance = new JobRepository();
        }
        return JobRepository.instance;
    }
    getAvailableJobs() {
        return Object.values(this.availableJobs).filter(t => t.Supported);
    }
    register(job) {
        if (typeof this.availableJobs[job.Name] !== 'undefined') {
            throw new Error('Job already exist:' + job.Name);
        }
        this.availableJobs[job.Name] = job;
    }
}
JobRepository.instance = null;
exports.JobRepository = JobRepository;
JobRepository.Instance.register(new IndexingJob_1.IndexingJob());
JobRepository.Instance.register(new DBResetJob_1.DBRestJob());
JobRepository.Instance.register(new VideoConvertingJob_1.VideoConvertingJob());
JobRepository.Instance.register(new PhotoConvertingJob_1.PhotoConvertingJob());
JobRepository.Instance.register(new ThumbnailGenerationJob_1.ThumbnailGenerationJob());
JobRepository.Instance.register(new TempFolderCleaningJob_1.TempFolderCleaningJob());
