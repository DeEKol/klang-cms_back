import { TLessonId, TPageNumber } from "../out/i-lesson-crud.port";

export class DeletePageCommand {
    constructor(
        private readonly _lessonId: TLessonId,
        private readonly _pageNumber: TPageNumber,
    ) {}

    get lessonId(): TLessonId {
        return this._lessonId;
    }

    get pageNumber(): TPageNumber {
        return this._pageNumber;
    }
}
