import { TLessonId, TPageNumber, TPageText } from "../out/i-lesson-crud.ports";

export class CreatePageCommand {
    constructor(
        private readonly _text: TPageText,
        private readonly _pageNumber: TPageNumber,
        private readonly _lessonId: TLessonId,
    ) {}

    get text(): TPageText {
        return this._text;
    }

    get pageNumber(): TPageNumber {
        return this._pageNumber;
    }

    get lessonId(): TLessonId {
        return this._lessonId;
    }
}
