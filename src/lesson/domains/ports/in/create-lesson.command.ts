import { TLessonText } from "./i-lesson.use-cases";

export class CreateLessonCommand {
    constructor(private readonly _text: TLessonText) {}

    get text(): TLessonText {
        return this._text;
    }
}
