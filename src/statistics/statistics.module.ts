import { Module } from "@nestjs/common";
import { StatisticsApiModule } from "./modules/api/statistics-api.module";
import { StatisticsPersistenceModule } from "./modules/persistence/statistics-persistence.module";

@Module({
    imports: [StatisticsPersistenceModule, StatisticsApiModule],
    controllers: [],
    providers: [],
})
export class StatisticsModule {}
