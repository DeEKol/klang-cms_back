import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ILessonUseCases, SLessonCrudUseCases } from "../../domains/ports/in/i-lesson.use-cases";
import { SectionResponse } from "./dto/section.response";
import { GetSectionCommand } from "../../domains/ports/in/get-section.command";
import { SectionFindRequest } from "./dto/section-find.request";
import { SectionDeleteRequest } from "./dto/section-delete.request";
import { DeleteSectionCommand } from "../../domains/ports/in/delete-section.command";
import { SectionUpdateRequest } from "./dto/section-update.request";
import { UpdateSectionCommand } from "../../domains/ports/in/update-section.command";
import { CreateSectionCommand } from "../../domains/ports/in/create-section.command";
import { SectionCreateRequest } from "./dto/section-create.request";

@ApiTags("Lesson")
@Controller("section")
export class SectionApiController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly _lessonCrudUseCases: ILessonUseCases,
    ) {}

    @Get("find-all")
    @ApiResponse({ status: 200, description: "Get all", type: [SectionResponse] })
    async findAll() {
        const sectionEntities = await this._lessonCrudUseCases.getSections();

        return sectionEntities.map((sectionEntity) => SectionResponse.mapToResponse(sectionEntity));
    }

    @Get("find/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Get one", type: SectionResponse })
    async findOne(@Param() { id }: SectionFindRequest): Promise<SectionResponse | null> {
        const command = new GetSectionCommand(id);
        const sectionEntity = await this._lessonCrudUseCases.getSection(command);

        return SectionResponse.mapToResponse(sectionEntity);
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Delete one", type: Boolean })
    async deleteOne(@Param() { id }: SectionDeleteRequest): Promise<boolean> {
        const command = new DeleteSectionCommand(id);

        return this._lessonCrudUseCases.deleteSection(command);
    }

    @Post("update")
    @ApiBody({ type: SectionUpdateRequest })
    @ApiResponse({ status: 200, description: "Update", type: Boolean })
    async update(@Body() { id, text }: SectionUpdateRequest): Promise<boolean> {
        const command = new UpdateSectionCommand(id, text);

        return this._lessonCrudUseCases.updateSection(command);
    }

    @Post("create")
    @ApiBody({ type: SectionCreateRequest })
    @ApiResponse({ status: 200, description: "Create", type: SectionResponse })
    async create(@Body() sectionRequest: SectionCreateRequest): Promise<SectionResponse | null> {
        const command = new CreateSectionCommand(sectionRequest.text);

        const sectionEntity = await this._lessonCrudUseCases.createSection(command);

        return SectionResponse.mapToResponse(sectionEntity);
    }
}
