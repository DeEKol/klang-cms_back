import { Body, Controller, Delete, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ILessonUseCases, SLessonCrudUseCases } from "../../domains/ports/in/i-lesson.use-cases";
import { CreatePageCommand } from "../../domains/ports/in/create-page.command";
import { DeletePageCommand } from "../../domains/ports/in/delete-page.command";
import { UpdatePageCommand } from "../../domains/ports/in/update-page.command";
import { PageCreateRequest } from "./dto/page-create.request";
import { PageResponse } from "./dto/page.response";
import { PageUpdateRequest } from "./dto/page-update.request";
import { PageDeleteRequest } from "./dto/page-delete.request";

@ApiTags("Lesson")
@Controller("page")
export class PageApiController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly _lessonCrudUseCases: ILessonUseCases,
    ) {}

    @Delete("delete/:id")
    @ApiResponse({ status: 200, description: "Delete one page", type: Boolean })
    async deletePage(@Param() { lessonId, pageNumber }: PageDeleteRequest): Promise<boolean> {
        const command = new DeletePageCommand(lessonId, pageNumber);

        return this._lessonCrudUseCases.deletePage(command);
    }

    @Post("update")
    @ApiBody({ type: PageUpdateRequest })
    @ApiResponse({ status: 200, description: "Update", type: Boolean })
    async updatePage(
        @Body()
        pageUpdateRequest: PageUpdateRequest,
    ): Promise<boolean> {
        const command = new UpdatePageCommand(
            pageUpdateRequest.id,
            pageUpdateRequest.lessonId,
            pageUpdateRequest.pageNumber,
            pageUpdateRequest.text,
        );

        return this._lessonCrudUseCases.updatePage(command);
    }

    @Post("create")
    @ApiBody({ type: PageCreateRequest })
    @ApiResponse({ status: 200, description: "Create", type: PageResponse })
    async createPage(@Body() lessonPageRequest: PageCreateRequest): Promise<PageResponse | null> {
        const command = new CreatePageCommand(
            lessonPageRequest.text,
            lessonPageRequest.pageNumber,
            lessonPageRequest.lessonId,
        );

        const pageEntity = await this._lessonCrudUseCases.createPage(command);

        return PageResponse.mapToResponse(pageEntity);
    }
}
