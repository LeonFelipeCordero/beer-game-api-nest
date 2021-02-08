import { Module } from '@nestjs/common';
import { LocalEventEmitter } from './local.events.emitter';

@Module({
  providers: [LocalEventEmitter],
  exports: [LocalEventEmitter],
})
export class EventsModule {}
