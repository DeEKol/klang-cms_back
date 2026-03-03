import { TSectionId } from "../out/i-lesson-crud.port";

export class DeleteSectionCommand {
    constructor(private readonly _id: TSectionId) {}

    get id(): TSectionId {
        return this._id;
    }
}
