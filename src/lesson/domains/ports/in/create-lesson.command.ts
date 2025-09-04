import { TLessonText } from "../out/i-lesson-crud.ports";

export class CreateLessonCommand {
    constructor(private readonly _text: TLessonText) {}

    get text(): TLessonText {
        return this._text;
    }
}
