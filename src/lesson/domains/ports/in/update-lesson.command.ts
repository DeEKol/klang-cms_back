import { TLessonId, TLessonText } from "../out/i-lesson-crud.ports";

export class UpdateLessonCommand {
    constructor(
        private readonly _id: TLessonId,
        private readonly _text?: TLessonText,
    ) {}

    get id(): TLessonId {
        return this._id;
    }

    get text(): TLessonText | undefined {
        return this?._text;
    }
}
