import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { WorkerAuthGuard } from "@infrastructure/auth/guards/worker-auth.guard";
import { WorkerRolesGuard } from "@infrastructure/auth/guards/worker-roles.guard";
import { Roles } from "@infrastructure/auth/decorators/roles.decorator";
import { WorkerRole } from "@modules/worker/domains/entities/worker.entity";
import { ILessonUseCases, SLessonCrudUseCases } from "../../../domains/ports/in/i-lesson.use-cases";
import { GetSectionCommand } from "../../../domains/ports/in/get-section.command";
import { CreateSectionCommand } from "../../../domains/ports/in/create-section.command";
import { UpdateSectionCommand } from "../../../domains/ports/in/update-section.command";
import { DeleteSectionCommand } from "../../../domains/ports/in/delete-section.command";
import { GetLessonCommand } from "../../../domains/ports/in/get-lesson.command";
import { CreateLessonCommand } from "../../../domains/ports/in/create-lesson.command";
import { UpdateLessonCommand } from "../../../domains/ports/in/update-lesson.command";
import { DeleteLessonCommand } from "../../../domains/ports/in/delete-lesson.command";
import { CreatePageCommand } from "../../../domains/ports/in/create-page.command";
import { UpdatePageCommand } from "../../../domains/ports/in/update-page.command";
import { DeletePageCommand } from "../../../domains/ports/in/delete-page.command";
import { SectionResponse } from "../dto/section.response";
import { SectionCreateRequest } from "../dto/section-create.request";
import { SectionUpdateRequest } from "../dto/section-update.request";
import { LessonResponse } from "../dto/lesson.response";
import { LessonRequest } from "../dto/lesson.request";
import { LessonUpdateRequest } from "../dto/lesson-update.request";
import { PageResponse } from "../dto/page.response";
import { PageCreateRequest } from "../dto/page-create.request";
import { PageUpdateRequest } from "../dto/page-update.request";

@ApiTags("CMS")
@ApiBearerAuth()
@UseGuards(WorkerAuthGuard)
@Controller("cms")
export class LessonCmsController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly lessonUseCases: ILessonUseCases,
    ) {}

    // ─── Sections ────────────────────────────────────────────────────────────

    @Get("sections")
    @ApiResponse({ status: 200, type: [SectionResponse] })
    async getSections(): Promise<SectionResponse[]> {
        const sections = await this.lessonUseCases.getSections();

        return sections.reduce((acc, s) => {
            const r = SectionResponse.mapToResponse(s);
            if (r) acc.push(r);
            return acc;
        }, [] as SectionResponse[]);
    }

    @Get("sections/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: SectionResponse })
    async getSection(@Param("id") id: string): Promise<SectionResponse | null> {
        return SectionResponse.mapToResponse(
            await this.lessonUseCases.getSection(new GetSectionCommand(id)),
        );
    }

    @Post("sections")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiResponse({ status: 201, type: SectionResponse })
    async createSection(@Body() dto: SectionCreateRequest): Promise<SectionResponse | null> {
        return SectionResponse.mapToResponse(
            await this.lessonUseCases.createSection(new CreateSectionCommand(dto.text)),
        );
    }

    @Patch("sections/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async updateSection(
        @Param("id") id: string,
        @Body() dto: SectionUpdateRequest,
    ): Promise<boolean> {
        return this.lessonUseCases.updateSection(new UpdateSectionCommand(id, dto.text));
    }

    @Delete("sections/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async deleteSection(@Param("id") id: string): Promise<boolean> {
        return this.lessonUseCases.deleteSection(new DeleteSectionCommand(id));
    }

    // ─── Lessons ─────────────────────────────────────────────────────────────

    @Get("lessons/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: LessonResponse })
    async getLesson(@Param("id") id: string): Promise<LessonResponse | null> {
        return LessonResponse.mapToResponse(
            await this.lessonUseCases.getLesson(new GetLessonCommand(id)),
        );
    }

    @Post("lessons")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiResponse({ status: 201, type: LessonResponse })
    async createLesson(@Body() dto: LessonRequest): Promise<LessonResponse | null> {
        return LessonResponse.mapToResponse(
            await this.lessonUseCases.createLesson(new CreateLessonCommand(dto.text)),
        );
    }

    @Patch("lessons/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async updateLesson(
        @Param("id") id: string,
        @Body() dto: LessonUpdateRequest,
    ): Promise<boolean> {
        return this.lessonUseCases.updateLesson(new UpdateLessonCommand(id, dto.text));
    }

    @Delete("lessons/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async deleteLesson(@Param("id") id: string): Promise<boolean> {
        return this.lessonUseCases.deleteLesson(new DeleteLessonCommand(id));
    }

    // ─── Pages ───────────────────────────────────────────────────────────────

    @Post("pages")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiResponse({ status: 201, type: PageResponse })
    async createPage(@Body() dto: PageCreateRequest): Promise<PageResponse | null> {
        return PageResponse.mapToResponse(
            await this.lessonUseCases.createPage(
                new CreatePageCommand(dto.text, dto.pageNumber, dto.lessonId),
            ),
        );
    }

    @Patch("pages/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async updatePage(@Param("id") id: string, @Body() dto: PageUpdateRequest): Promise<boolean> {
        return this.lessonUseCases.updatePage(
            new UpdatePageCommand(id, dto.lessonId, dto.pageNumber, dto.text),
        );
    }

    @Delete("pages/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN)
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: Boolean })
    async deletePage(@Param("id") id: string): Promise<boolean> {
        return this.lessonUseCases.deletePage(new DeletePageCommand(id));
    }
}
