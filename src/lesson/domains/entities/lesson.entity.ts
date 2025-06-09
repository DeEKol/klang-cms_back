export class LessonEntity {
    constructor(
        private readonly _idPk: number,
        private readonly _id: string,
        private readonly _text: string,
    ) {}

    get idPk(): number {
        return this._idPk;
    }

    get id(): string {
        return this._id;
    }

    get text(): string {
        return this._text;
    }
}
