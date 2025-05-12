export class SaveLessonCommand {
    constructor(private readonly _lesson: { text: string }) {}

    static of(lesson: { text: string }): SaveLessonCommand {
        return new SaveLessonCommand(lesson);
    }
    get text() {
        return this._lesson.text;
    }
}
