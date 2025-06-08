import { Migration } from '@mikro-orm/migrations';

export class Migration20250607132706 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "banner" drop column if exists "is_active";`);

    this.addSql(`alter table if exists "banner" add column if not exists "link" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "banner" drop column if exists "link";`);

    this.addSql(`alter table if exists "banner" add column if not exists "is_active" boolean not null default false;`);
  }

}
