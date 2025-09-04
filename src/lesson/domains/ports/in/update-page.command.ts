import { TLessonId, TPageId, TPageNumber, TPageText } from "../out/i-lesson-crud.ports";

export class UpdatePageCommand {
    constructor(
        private readonly _id: TPageId,
        private readonly _lessonId?: TLessonId,
        private readonly _pageNumber?: TPageNumber,
        private readonly _text?: TPageText,
    ) {}

    get id(): TPageId {
        return this._id;
    }

    get lessonId(): TLessonId | undefined {
        return this?._lessonId;
    }

    get pageNumber(): TPageNumber | undefined {
        return this?._pageNumber;
    }

    get text(): TPageText | undefined {
        return this?._text;
    }
}
