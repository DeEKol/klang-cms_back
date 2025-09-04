import { TSectionText } from "../out/i-lesson-crud.ports";

export class CreateSectionCommand {
    constructor(private readonly _text: TSectionText) {}

    get text(): TSectionText {
        return this._text;
    }
}
