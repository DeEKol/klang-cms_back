import { TSectionId } from "../out/i-lesson-crud.ports";

export class DeleteSectionCommand {
    constructor(private readonly _id: TSectionId) {}

    get id(): TSectionId {
        return this._id;
    }
}
