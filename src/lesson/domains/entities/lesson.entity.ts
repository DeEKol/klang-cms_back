export class LessonEntity {
    constructor(
        private readonly _id: number,
        private readonly _text: string,
    ) {}

    get id(): number {
        return this._id;
    }

    get text(): string {
        return this._text;
    }
}
