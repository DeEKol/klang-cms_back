import { Controller, Get, Inject, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DomainErrorMapper } from "@infrastructure/errors/domain-error.mapper";
import { UserAuthGuard } from "@infrastructure/auth/guards/user-auth.guard";
import { ILessonUseCases, SLessonCrudUseCases } from "../../../domains/ports/in/i-lesson.use-cases";
import { GetSectionCommand } from "../../../domains/ports/in/get-section.command";
import { GetLessonCommand } from "../../../domains/ports/in/get-lesson.command";
import { SectionResponse } from "../dto/section.response";
import { LessonResponse } from "../dto/lesson.response";

@ApiTags("Mobile")
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller("mob")
export class LessonMobileController {
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
        const result = await this.lessonUseCases.getSection(new GetSectionCommand(id));

        if (!result.ok) throw DomainErrorMapper.toHttpException(result.error);

        return SectionResponse.mapToResponse(result.value);
    }

    // ─── Lessons ─────────────────────────────────────────────────────────────

    @Get("lessons/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, type: LessonResponse })
    async getLesson(@Param("id") id: string): Promise<LessonResponse | null> {
        const result = await this.lessonUseCases.getLesson(new GetLessonCommand(id));

        if (!result.ok) throw DomainErrorMapper.toHttpException(result.error);

        return LessonResponse.mapToResponse(result.value);
    }
}
