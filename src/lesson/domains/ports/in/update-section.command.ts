import { TSectionId, TSectionText } from "../out/i-lesson-crud.ports";

export class UpdateSectionCommand {
    constructor(
        private readonly _id: TSectionId,
        private readonly _text?: TSectionText,
    ) {}

    get id(): TSectionId {
        return this._id;
    }

    get text(): TSectionText | undefined {
        return this?._text;
    }
}
