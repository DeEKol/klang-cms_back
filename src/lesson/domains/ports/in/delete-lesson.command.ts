import { TLessonId } from "./i-lesson.use-cases";

export class DeleteLessonCommand {
    constructor(private readonly _id: TLessonId) {}

    get id(): TLessonId {
        return this._id;
    }
}
