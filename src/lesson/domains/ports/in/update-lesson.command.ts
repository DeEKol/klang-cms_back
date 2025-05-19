export class UpdateLessonCommand {
    constructor(
        public readonly id: number,
        public readonly text: string,
    ) {}

    static of(lesson: { id: number; text: string }): UpdateLessonCommand {
        return new UpdateLessonCommand(lesson.id, lesson.text);
    }
}
