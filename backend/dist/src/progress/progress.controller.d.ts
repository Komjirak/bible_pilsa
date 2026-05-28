import { ProgressService, ProgressData } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getProgress(req: any): Promise<ProgressData>;
    saveProgress(req: any, body: Partial<ProgressData>): Promise<ProgressData>;
}
