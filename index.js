import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const isValidate = (date) => {
  const startDate = moment("2022-02-01");
  const endDate = moment("2022-03-12");
  return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
  const data = { data: date.toISOString() };
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
  const git = simpleGit();
  
  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 54 * 4);
    const randomDays = random.int(0, 6);

    const randomDate = moment("2022-02-01").add(randomWeeks, "weeks").add(randomDays, "days");

    if (isValidate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push();
};

makeCommits(50000);