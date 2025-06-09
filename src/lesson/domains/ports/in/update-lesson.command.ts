export class UpdateLessonCommand {
    constructor(
        public readonly id: string,
        public readonly text: string,
    ) {}

    static of(lesson: { id: string; text: string }): UpdateLessonCommand {
        return new UpdateLessonCommand(lesson.id, lesson.text);
    }
}
