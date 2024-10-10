import { Module, forwardRef } from '@nestjs/common';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [forwardRef(() => ImageModule)],
  controllers: [OutfitController],
  providers: [OutfitService],
  exports: [OutfitService]
})
export class OutfitModule {}
