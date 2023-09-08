import { Migration } from '@mikro-orm/migrations';

export class Migration20230908072646 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `unit` (`id` integer not null primary key autoincrement, `name` text not null, `price` integer not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `full_name` text not null);');

    this.addSql('create table `booking` (`id` integer not null primary key autoincrement, `check_in_date` datetime not null, `number_of_nights` integer not null, `unit_id` integer not null, `user_id` integer not null, constraint `booking_unit_id_foreign` foreign key(`unit_id`) references `unit`(`id`) on update cascade, constraint `booking_user_id_foreign` foreign key(`user_id`) references `user`(`id`) on update cascade);');
    this.addSql('create index `booking_unit_id_index` on `booking` (`unit_id`);');
    this.addSql('create index `booking_user_id_index` on `booking` (`user_id`);');
  }

}
