import { TLessonId } from "../out/i-lesson-crud.port";

export class DeleteLessonCommand {
    constructor(private readonly _id: TLessonId) {}

    get id(): TLessonId {
        return this._id;
    }
}
