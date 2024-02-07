import seedUsers from "./user.seed";
import seedBlogger from "./blogger.seed";

export default async function seed() {
    const users = await seedUsers();
    const blogger = await seedBlogger();
}
