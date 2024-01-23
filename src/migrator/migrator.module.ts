import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@toolkit/services';
import { MigratorService } from '@migrator/migrator.service';

@Module({
	imports: [ConfigModule],
	providers: [PrismaService, MigratorService],
	exports: [MigratorService]
})
export class MigratorModule {}
