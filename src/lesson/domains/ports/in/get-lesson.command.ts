import { TLessonId } from "../out/i-lesson-crud.ports";

export class GetLessonCommand {
    constructor(private readonly _id: TLessonId) {}

    get id(): TLessonId {
        return this._id;
    }
}
