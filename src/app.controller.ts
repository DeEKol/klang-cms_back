import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return JSON.stringify({ text: "Hello World!" });
    }
}
