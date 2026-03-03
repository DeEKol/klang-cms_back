import { TPageId } from "../out/i-lesson-crud.port";

export class DeletePageCommand {
    constructor(
        private readonly _id: TPageId,
        // private readonly _lessonId: TLessonId,
        // private readonly _pageNumber: TPageNumber,
    ) {}

    get id(): TPageId {
        return this._id;
    }

    // get lessonId(): TLessonId {
    //     return this._lessonId;
    // }
    //
    // get pageNumber(): TPageNumber {
    //     return this._pageNumber;
    // }
}
